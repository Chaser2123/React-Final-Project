// Mock seatmap data based on typical aircraft configurations
// This is used as a fallback when Amadeus API is unavailable
// Layout is based on real aircraft cabin configurations

export function generateMockSeatmap(aircraftType, rows, seatsPerRow) {
  console.log(`Generating realistic seatmap for ${aircraftType} with ${rows} rows and ${seatsPerRow} seats per row`);
  
  // Determine lavatory positions based on aircraft size and type
  const lavatoryPositions = [];
  
  if (rows <= 20) {
    // Small aircraft: front and rear lavatories
    lavatoryPositions.push({ row: 2, position: 'after' }); // Front galley area
    lavatoryPositions.push({ row: rows, position: 'after' }); // Rear
  } else if (rows <= 35) {
    // Medium aircraft: front, middle, and rear (typical for A320, 737)
    lavatoryPositions.push({ row: 3, position: 'after' }); // Front
    lavatoryPositions.push({ row: Math.floor(rows / 2) + 2, position: 'after' }); // Mid-cabin
    lavatoryPositions.push({ row: rows - 1, position: 'after' }); // Near rear
    lavatoryPositions.push({ row: rows, position: 'after' }); // Rear
  } else {
    // Large aircraft: multiple throughout (typical for wide-body aircraft)
    lavatoryPositions.push({ row: 3, position: 'after' }); // Front
    lavatoryPositions.push({ row: Math.floor(rows / 4), position: 'after' }); // Forward mid
    lavatoryPositions.push({ row: Math.floor(rows / 2), position: 'after' }); // Mid-cabin
    lavatoryPositions.push({ row: Math.floor(3 * rows / 4), position: 'after' }); // Aft mid
    lavatoryPositions.push({ row: rows - 1, position: 'after' }); // Near rear
    lavatoryPositions.push({ row: rows, position: 'after' }); // Rear
  }

  // Determine emergency exit positions based on aircraft size
  // Emergency exits follow FAA/EASA regulations for aircraft evacuation
  const emergencyExitPositions = [];
  
  // All aircraft have front and rear exits (doors)
  emergencyExitPositions.push({ row: 0, position: 'before' }); // Front exit/door before row 1
  
  if (rows <= 20) {
    // Small aircraft: front, rear, and typically one overwing exit pair
    emergencyExitPositions.push({ row: Math.floor(rows / 2), position: 'after' }); // Overwing exit
  } else if (rows <= 35) {
    // Medium aircraft (A320, 737): front, rear, and two overwing exit pairs
    // Overwing exits typically around rows 12-14 and 18-20 for standard config
    emergencyExitPositions.push({ row: Math.floor(rows * 0.4), position: 'after' }); // Forward overwing
    emergencyExitPositions.push({ row: Math.floor(rows * 0.6), position: 'after' }); // Aft overwing
  } else {
    // Large aircraft (wide-body): multiple door pairs throughout
    emergencyExitPositions.push({ row: Math.floor(rows * 0.25), position: 'after' }); // Forward door
    emergencyExitPositions.push({ row: Math.floor(rows * 0.45), position: 'after' }); // Mid forward
    emergencyExitPositions.push({ row: Math.floor(rows * 0.65), position: 'after' }); // Mid aft
    emergencyExitPositions.push({ row: Math.floor(rows * 0.85), position: 'after' }); // Aft door
  }
  
  emergencyExitPositions.push({ row: rows, position: 'after' }); // Rear exit/door after last row

  const facilities = [
    ...lavatoryPositions.map((lav, index) => ({
      code: 'LAV',
      coordinates: {
        x: 0,
        y: lav.row + 1
      },
      position: lav.position
    })),
    ...emergencyExitPositions.map((exit, index) => ({
      code: 'EXIT',
      coordinates: {
        x: 0,
        y: exit.row + 1
      },
      position: exit.position
    }))
  ];

  // Generate seats
  const seats = [];
  for (let rowNum = 1; rowNum <= rows; rowNum++) {
    for (let seatIndex = 0; seatIndex < seatsPerRow; seatIndex++) {
      const seatLetter = String.fromCharCode(65 + seatIndex);
      seats.push({
        number: `${rowNum}${seatLetter}`,
        characteristicsCodes: ['A'], // Available
        travelerPricing: []
      });
    }
  }

  return {
    data: [{
      type: 'seatmap',
      flightOfferId: '1',
      segmentId: '1',
      decks: [{
        deckType: 'MAIN',
        deckConfiguration: {
          width: seatsPerRow,
          length: rows,
          startSeatRow: 1,
          endSeatRow: rows
        },
        facilities: facilities,
        seats: seats
      }]
    }]
  };
}
