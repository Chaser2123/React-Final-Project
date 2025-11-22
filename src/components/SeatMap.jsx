'use client';
import { useState, useEffect } from 'react';
import { generateMockSeatmap } from '@/lib/mockSeatmapData';

import { FaRestroom } from "react-icons/fa";
import { FaDoorOpen } from "react-icons/fa";
import { IoExitOutline } from "react-icons/io5";

export default function SeatMap({ flightNumber, flightRowsCount = 20, seatsPerRow = 8, seatCost = 0, onTotalCostChange, departureDate, origin, destination, aircraftType }) {
  // Track selected seats
  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [seatmapData, setSeatmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  // Fetch seatmap data from Amadeus API
  useEffect(() => {
    async function fetchSeatmap() {
      // If missing flight details, use mock data directly
      if (!origin || !destination || !departureDate) {
        console.log('Missing flight details, using mock seatmap data');
        const mockData = generateMockSeatmap(aircraftType, flightRowsCount, seatsPerRow);
        setSeatmapData(mockData);
        setUsingMockData(true);
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching seatmap with:', { flightNumber, departureDate, origin, destination });
        
        const response = await fetch('/api/seatmap', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            flightNumber,
            departureDate,
            origin,
            destination,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Seatmap data received from Amadeus API');
          setSeatmapData(data);
          setUsingMockData(false);
        } else {
          const errorData = await response.json();
          console.error('Seatmap API error:', errorData);
          console.log('Using mock seatmap data as fallback');
          // Use mock data as fallback
          const mockData = generateMockSeatmap(aircraftType, flightRowsCount, seatsPerRow);
          setSeatmapData(mockData);
          setUsingMockData(true);
        }
      } catch (error) {
        console.error('Failed to fetch seatmap:', error);
        console.log('Using mock seatmap data as fallback');
        // Use mock data as fallback
        const mockData = generateMockSeatmap(aircraftType, flightRowsCount, seatsPerRow);
        setSeatmapData(mockData);
        setUsingMockData(true);
      } finally {
        setLoading(false);
      }
    }

    fetchSeatmap();
  }, [flightNumber, departureDate, origin, destination, aircraftType, flightRowsCount, seatsPerRow]);

  const handleSeatClick = (seatId) => {
    setSelectedSeats(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(seatId)) {
        // Deselect seat
        newSelected.delete(seatId);
      } else {
        // Select seat
        newSelected.add(seatId);
      }
      
      // Update total cost
      if (onTotalCostChange) {
        onTotalCostChange(newSelected.size * seatCost);
      }
      
      return newSelected;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8 flex items-center justify-center">
        <div className="text-white text-xl">Loading seat map...</div>
      </div>
    );
  }

  if (error || !seatmapData?.data?.[0]?.decks) {
    return (
      <div className="min-h-screen bg-gray-900 p-8 flex items-center justify-center">
        <div className="bg-red-600 text-white p-6 rounded-lg max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">Unable to Load Seatmap</h2>
          <p className="mb-2">Unable to load seatmap data from Amadeus API.</p>
          <p className="text-sm mb-4">Error: {error || 'No seatmap data available'}</p>
          <p className="text-sm">Please ensure valid flight details are provided.</p>
        </div>
      </div>
    );
  }

  // Generate seat layout with lavatories from Amadeus data
  const seatRows = [];
  
  // We only proceed if we have valid Amadeus seatmap data
  const deck = seatmapData.data[0].decks[0]; // Using first deck (main cabin)
  const deckConfig = deck.deckConfiguration;
  
  // Parse deck configuration to get facilities (lavatories, galleys, etc.)
  const facilities = [];
  if (deck.facilities) {
    deck.facilities.forEach(facility => {
      facilities.push({
        type: facility.code, // LAV for lavatory, GAL for galley, etc.
        coordinates: facility.coordinates
      });
    });
  }

  // Build seat map based on actual aircraft configuration
  const seatsByRow = {};
  if (deck.seats) {
    deck.seats.forEach(seat => {
      const rowNum = seat.number.match(/\d+/)?.[0];
      if (rowNum) {
        if (!seatsByRow[rowNum]) {
          seatsByRow[rowNum] = [];
        }
        seatsByRow[rowNum].push(seat);
      }
    });
  }

  // Sort row numbers
  const rowNumbers = Object.keys(seatsByRow).sort((a, b) => parseInt(a) - parseInt(b));
  
  // Check for front exits and lavatories (before row 1)
  const frontExits = facilities.filter(f => 
    f.type === 'EXIT' && 
    f.coordinates && 
    parseInt(f.coordinates.y) <= 0
  );
  
  frontExits.forEach(() => {
    seatRows.push({ type: 'emergency-exit', position: 'front' });
  });
  
  const frontLavs = facilities.filter(f => 
    f.type === 'LAV' && 
    f.coordinates && 
    parseInt(f.coordinates.y) <= 0
  );
  
  frontLavs.forEach(() => {
    seatRows.push({ type: 'lavatory', position: 'front' });
  });
  
  rowNumbers.forEach(rowNum => {
    const rowSeats = seatsByRow[rowNum];
    
    // Check if there's a lavatory before this row
    const lavBefore = facilities.find(f => 
      f.type === 'LAV' && 
      f.coordinates && 
      parseInt(f.coordinates.y) === parseInt(rowNum) - 1
    );
    
    if (lavBefore) {
      seatRows.push({ type: 'lavatory', position: 'front' });
    }
    
    // Check if there's an emergency exit before this row
    const exitBefore = facilities.find(f => 
      f.type === 'EXIT' && 
      f.coordinates && 
      parseInt(f.coordinates.y) === parseInt(rowNum) - 1
    );
    
    if (exitBefore) {
      seatRows.push({ type: 'emergency-exit', position: 'front' });
    }
    
    // Add the seat row
    const seats = rowSeats.map(seat => seat.number).sort();
    seatRows.push({ type: 'seats', seats: seats, rowNumber: parseInt(rowNum) });
  });

  // Check for rear lavatory (after the last row)
  const maxRow = Math.max(...rowNumbers.map(r => parseInt(r)));
  const rearLavs = facilities.filter(f => 
    f.type === 'LAV' && 
    f.coordinates && 
    parseInt(f.coordinates.y) > maxRow
  );
  
  // Add all rear lavatories
  rearLavs.forEach(() => {
    seatRows.push({ type: 'lavatory', position: 'rear' });
  });
  
  // Check for rear exits (after the last row)
  const rearExits = facilities.filter(f => 
    f.type === 'EXIT' && 
    f.coordinates && 
    parseInt(f.coordinates.y) > maxRow
  );
  
  // Add all rear exits
  rearExits.forEach(() => {
    seatRows.push({ type: 'emergency-exit', position: 'rear' });
  });

  // Split seats for aisle (half on left, half on right)
  const seatsPerSide = seatsPerRow / 2;

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      {/* <h1 className="text-white text-3xl font-bold text-center mb-8">
        Flight Details for Flight Number: {flightNumber}
      </h1> */}

      <div className="flex justify-center">
        <div className="space-y-2">
          {seatRows.map((row, rowIndex) => {
            if (row.type === 'lavatory') {
              // Render lavatory row
              return (
                <div key={rowIndex} className="flex items-center gap-2">
                  {/* Empty space for row number alignment */}
                  <span className="w-8"></span>
                  
                  <div className="bg-gray-600 text-white flex justify-center items-center py-3 rounded font-semibold text-sm shadow-lg border-2 border-purple-400" style={{ width: `calc(${seatsPerRow} * 2.5rem + ${seatsPerRow - 1} * 0.5rem + 2rem)` }}>
                    <FaRestroom className="inline mr-2 text-2xl" /><span>LAVATORY</span>
                  </div>
                </div>
              );
            }
            
            if (row.type === 'emergency-exit') {
              // Render emergency exit row
              return (
                <div key={rowIndex} className="flex items-center gap-2">
                  {/* Empty space for row number alignment */}
                  <span className="w-8"></span>
                  
                  <div className="bg-red-600 text-white flex justify-center items-center py-1 rounded font-semibold text-sm shadow-lg border-2 border-red-400" style={{ width: `calc(${seatsPerRow} * 2.5rem + ${seatsPerRow - 1} * 0.5rem + 2rem)` }}>
                    <IoExitOutline className="inline mr-2 text-2xl font-bold" style={{ strokeWidth: '3px' }} /><span className="font-bold">EMERGENCY EXIT</span>
                  </div>
                </div>
              );
            }
            
            // Render seat row
            return (
              <div key={rowIndex} className="flex items-center gap-2">
                {/* Row number */}
                <span className="text-white w-8 text-right font-mono">
                  {row.rowNumber}
                </span>

                {/* Left side seats */}
                <div className="flex gap-2">
                  {row.seats.slice(0, seatsPerSide).map((seatId) => (
                    <button
                      key={seatId}
                      className={`w-10 h-10 ${
                        selectedSeats.has(seatId)
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'bg-blue-500 hover:bg-blue-600'
                      } text-white rounded font-mono text-sm transition-colors`}
                      onClick={() => handleSeatClick(seatId)}
                    >
                      {seatId}
                    </button>
                  ))}
                </div>

                {/* Aisle gap */}
                <div className="w-8"></div>

                {/* Right side seats */}
                <div className="flex gap-2">
                  {row.seats.slice(seatsPerSide).map((seatId) => (
                    <button
                      key={seatId}
                      className={`w-10 h-10 ${
                        selectedSeats.has(seatId)
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'bg-blue-500 hover:bg-blue-600'
                      } text-white rounded font-mono text-sm transition-colors`}
                      onClick={() => handleSeatClick(seatId)}
                    >
                      {seatId}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
