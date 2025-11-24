// Aircraft seating configurations
// Dynamically determines seating based on aircraft type from SERP API

/**
 * Get seating configuration for a given aircraft type
 * @param {string} aircraftType - The aircraft type/model from SERP API
 * @returns {Object} Configuration with rows and class-based seating
 */
export function getSeatingConfig(aircraftType) {
  if (!aircraftType) {
    return { 
      rows: 30, 
      seatsPerRow: 6,
      classes: [
        { name: 'First', rows: 2, seatsPerRow: 4 },
        { name: 'Business', rows: 6, seatsPerRow: 4 },
        { name: 'Premium Economy', rows: 6, seatsPerRow: 6 },
        { name: 'Economy', rows: 16, seatsPerRow: 6 }
      ]
    };
  }
  
  const type = aircraftType.toLowerCase();
  
  // Regional jets (small aircraft, 2-2 seating)
  if (type.includes('embraer') || type.includes('crj') || type.includes('erj')) {
    return { 
      rows: 20, 
      seatsPerRow: 4,
      classes: [
        { name: 'First', rows: 2, seatsPerRow: 2 },
        { name: 'Economy', rows: 18, seatsPerRow: 4 }
      ]
    };
  }
  
  // Wide-body aircraft (twin aisle, typically 2-4-2 or 3-3-3 seating)
  if (type.includes('787') || type.includes('777') || type.includes('767') || 
      type.includes('a330') || type.includes('a340') || type.includes('a350') || 
      type.includes('a380')) {
    return { 
      rows: 40, 
      seatsPerRow: 9,
      classes: [
        { name: 'First', rows: 3, seatsPerRow: 4 },
        { name: 'Business', rows: 10, seatsPerRow: 6 },
        { name: 'Premium Economy', rows: 8, seatsPerRow: 8 },
        { name: 'Economy', rows: 19, seatsPerRow: 9 }
      ]
    };
  }
  
  // Narrow-body aircraft (single aisle, 3-3 seating) - most common
  // Covers 737, A320 family (including A321neo), 757, A220, etc.
  if (type.includes('a321')) {
    // Airbus A321neo specific configuration
    return { 
      rows: 32, 
      seatsPerRow: 6,
      classes: [
        { name: 'First', rows: 2, seatsPerRow: 4 },
        { name: 'Business', rows: 6, seatsPerRow: 6 },
        { name: 'Premium Economy', rows: 6, seatsPerRow: 6 },
        { name: 'Economy', rows: 18, seatsPerRow: 6 }
      ]
    };
  }
  
  return { 
    rows: 30, 
    seatsPerRow: 6,
    classes: [
      { name: 'First', rows: 2, seatsPerRow: 4 },
      { name: 'Business', rows: 6, seatsPerRow: 4 },
      { name: 'Premium Economy', rows: 6, seatsPerRow: 6 },
      { name: 'Economy', rows: 16, seatsPerRow: 6 }
    ]
  };
}

/**
 * Generate facility positions (emergency exits and lavatories) based on aircraft configuration
 * @param {string} aircraftType - The aircraft type/model
 * @returns {Object} Object containing arrays of emergency exits and lavatories with their positions
 */
export function generateFacilities(aircraftType) {
  const config = getSeatingConfig(aircraftType);
  const { rows } = config;
  
  console.log('Generating facilities for aircraft with', rows, 'rows');
  
  const lavatoryPositions = [];
  const emergencyExitPositions = [];
  
  // Helper to add positions at specified row ratios
  const addPositions = (positions, rowRatios) => {
    rowRatios.forEach(ratio => {
      // Convert fractional ratios to actual row numbers
      const row = ratio < 1 && ratio > 0 ? Math.floor(rows * ratio) : ratio;
      positions.push({ row, position: 'after' });
    });
  };
  
  // Determine lavatory positions based on aircraft size
  if (rows <= 20) {
    // Small aircraft: front and rear lavatories
    addPositions(lavatoryPositions, [2, rows]);
  } else if (rows <= 35) {
    // Medium aircraft: front, middle, and rear
    addPositions(lavatoryPositions, [3, Math.floor(rows / 2) + 2, rows]);
  } else {
    // Large aircraft: multiple throughout
    addPositions(lavatoryPositions, [3, Math.floor(rows * 0.25), Math.floor(rows * 0.5), Math.floor(rows * 0.75), rows]);
  }
  
  // Determine emergency exit positions based on aircraft size
  emergencyExitPositions.push({ row: 0, position: 'before' }); // Front exit
  
  if (rows <= 20) {
    // Small aircraft: one overwing exit
    addPositions(emergencyExitPositions, [0.5]);
  } else if (rows <= 35) {
    // Medium aircraft: two overwing exits
    addPositions(emergencyExitPositions, [0.4, 0.6]);
  } else {
    // Large aircraft: multiple door pairs
    addPositions(emergencyExitPositions, [0.25, 0.45, 0.65, 0.85]);
  }
  
  addPositions(emergencyExitPositions, [rows]); // Rear exit
  
  console.log('Lavatory positions:', lavatoryPositions);
  console.log('Exit positions:', emergencyExitPositions);
  
  // Format facility objects for seatmap rendering
  const facilities = [
    ...lavatoryPositions.map(lav => ({
      code: 'LAV',
      coordinates: {
        x: 0,
        y: lav.row
      },
      position: lav.position
    })),
    ...emergencyExitPositions.map(exit => ({
      code: 'EXIT',
      coordinates: {
        x: 0,
        y: exit.row
      },
      position: exit.position
    }))
  ];
  
  return facilities;
}
