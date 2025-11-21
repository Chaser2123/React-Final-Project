// Aircraft seating configurations
// Based on typical economy class configurations for each aircraft type

export const aircraftSeatingConfig = {
  // Airbus narrow-body
  'Airbus A319': { rows: 24, seatsPerRow: 6 },
  'Airbus A320': { rows: 30, seatsPerRow: 6 },
  'Airbus A321': { rows: 36, seatsPerRow: 6 },
  
  // Airbus wide-body
  'Airbus A330': { rows: 42, seatsPerRow: 8 },
  'Airbus A350': { rows: 45, seatsPerRow: 9 },
  'Airbus A380': { rows: 60, seatsPerRow: 10 },
  
  // Boeing narrow-body
  'Boeing 737': { rows: 29, seatsPerRow: 6 },
  'Boeing 737MAX 8 Passenger': { rows: 30, seatsPerRow: 6 },
  'Boeing 737MAX 9 Passenger': { rows: 33, seatsPerRow: 6 },
  'Boeing 757': { rows: 35, seatsPerRow: 6 },
  
  // Boeing wide-body
  'Boeing 767': { rows: 35, seatsPerRow: 7 },
  'Boeing 777': { rows: 42, seatsPerRow: 9 },
  'Boeing 787': { rows: 38, seatsPerRow: 9 },
  
  // Embraer
  'Embraer 175': { rows: 20, seatsPerRow: 4 },
  'Embraer 190': { rows: 25, seatsPerRow: 4 },
  
  // Airbus A220 (formerly Bombardier C Series)
  'Airbus A220-300 Passenger': { rows: 30, seatsPerRow: 5 },
  
  // Default fallback
  'default': { rows: 30, seatsPerRow: 6 }
};

/**
 * Get seating configuration for a given aircraft type
 * @param {string} aircraftType - The aircraft type/model
 * @returns {Object} Configuration with rows and seatsPerRow
 */
export function getSeatingConfig(aircraftType) {
  if (!aircraftType) {
    return aircraftSeatingConfig.default;
  }
  
  // Try exact match first
  if (aircraftSeatingConfig[aircraftType]) {
    return aircraftSeatingConfig[aircraftType];
  }
  
  // Try partial match for aircraft families
  const normalizedType = aircraftType.toLowerCase();
  
  if (normalizedType.includes('737')) {
    return aircraftSeatingConfig['Boeing 737'];
  } else if (normalizedType.includes('787')) {
    return aircraftSeatingConfig['Boeing 787'];
  } else if (normalizedType.includes('777')) {
    return aircraftSeatingConfig['Boeing 777'];
  } else if (normalizedType.includes('767')) {
    return aircraftSeatingConfig['Boeing 767'];
  } else if (normalizedType.includes('a320') || normalizedType.includes('airbus a320')) {
    return aircraftSeatingConfig['Airbus A320'];
  } else if (normalizedType.includes('a319')) {
    return aircraftSeatingConfig['Airbus A319'];
  } else if (normalizedType.includes('a321')) {
    return aircraftSeatingConfig['Airbus A321'];
  } else if (normalizedType.includes('a350')) {
    return aircraftSeatingConfig['Airbus A350'];
  } else if (normalizedType.includes('a330')) {
    return aircraftSeatingConfig['Airbus A330'];
  } else if (normalizedType.includes('embraer')) {
    return aircraftSeatingConfig['Embraer 175'];
  }
  
  // Return default if no match
  return aircraftSeatingConfig.default;
}
