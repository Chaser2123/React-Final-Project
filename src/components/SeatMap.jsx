'use client';
import { useState, useEffect } from 'react';
import { generateFacilities } from '@/lib/aircraftSeatingConfig';
import { FaRestroom } from "react-icons/fa";
import { IoExitOutline } from "react-icons/io5";

function generateSeatmapData(aircraftType, rows, seatsPerRow) {
  const facilities = generateFacilities(aircraftType);
  const seats = [];
  
  for (let rowNum = 1; rowNum <= rows; rowNum++) {
    for (let seatIndex = 0; seatIndex < seatsPerRow; seatIndex++) {
      seats.push({
        number: `${rowNum}${String.fromCharCode(65 + seatIndex)}`,
        rowNum
      });
    }
  }

  return { facilities, seats, rows, seatsPerRow };
}

export default function SeatMap({ flightRowsCount, seatsPerRow, seatCost, onTotalCostChange, aircraftType }) {
  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [seatmapData, setSeatmapData] = useState(null);

  useEffect(() => {
    setSeatmapData(generateSeatmapData(aircraftType, flightRowsCount, seatsPerRow));
  }, [aircraftType, flightRowsCount, seatsPerRow]);
  const flightClasses = ['Economy'];
  if (flightRowsCount > 20) flightClasses.push('Premium Economy');
  if (flightRowsCount > 30) flightClasses.push('Business');
  flightClasses.push('First');
  

  const handleSeatClick = (seatId) => {
    setSelectedSeats(prev => {
      const updated = new Set(prev);
      updated.has(seatId) ? updated.delete(seatId) : updated.add(seatId);
      
      onTotalCostChange?.(updated.size * seatCost);
      return updated;
    });
  };

  if (!seatmapData) return <div className="min-h-screen bg-gray-900 p-8 flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>;

  const { facilities, seats } = seatmapData;
  
  console.log('Facilities:', facilities);
  console.log('Total rows:', seatmapData.rows);
  
  const seatsByRow = {};
  seats.forEach(seat => {
    if (!seatsByRow[seat.rowNum]) seatsByRow[seat.rowNum] = [];
    seatsByRow[seat.rowNum].push(seat.number);
  });

  const rowNumbers = Object.keys(seatsByRow).map(Number).sort((a, b) => a - b);
  const seatRows = [];
  const seatsPerSide = seatsPerRow / 2;

  // Add front facilities (before row 1)
  facilities.filter(f => f.code === 'EXIT' && f.coordinates.y === 0).forEach(() => 
    seatRows.push({ type: 'exit' }));
  facilities.filter(f => f.code === 'LAV' && f.coordinates.y < 1).forEach(() => 
    seatRows.push({ type: 'lav' }));

  // Add rows with facilities interspersed
  rowNumbers.forEach(rowNum => {
    // Add the seat row first
    seatRows.push({ type: 'seats', seats: seatsByRow[rowNum].sort(), rowNum });
    
    // Then check for facilities that come AFTER this row
    facilities.filter(f => f.code === 'LAV' && f.coordinates.y === rowNum).forEach(() => 
      seatRows.push({ type: 'lav' }));
    facilities.filter(f => f.code === 'EXIT' && f.coordinates.y === rowNum && f.coordinates.y !== 0).forEach(() => 
      seatRows.push({ type: 'exit' }));
  });

  // Add rear facilities (after the last row)
  const lastRow = rowNumbers[rowNumbers.length - 1];
  facilities.filter(f => f.code === 'LAV' && f.coordinates.y > lastRow).forEach(() => 
    seatRows.push({ type: 'lav' }));
  facilities.filter(f => f.code === 'EXIT' && f.coordinates.y > lastRow).forEach(() => 
    seatRows.push({ type: 'exit' }));

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="flex justify-center">
        <div className="space-y-2">
          {seatRows.map((row, i) => {
            if (row.type === 'lav') {
              return (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-8"></span>
                  <div className="bg-gray-600 text-white flex justify-center items-center py-3 rounded font-semibold text-sm shadow-lg border-2 border-purple-400" style={{ width: `calc(${seatsPerRow} * 2.5rem + ${seatsPerRow - 1} * 0.5rem + 2rem)` }}>
                    <FaRestroom className="inline mr-2 text-2xl" /><span>LAVATORY</span>
                  </div>
                </div>
              );
            }
            
            if (row.type === 'exit') {
              return (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-8"></span>
                  <div className="bg-red-600 text-white flex justify-center items-center py-1 rounded font-semibold text-sm shadow-lg border-2 border-red-400" style={{ width: `calc(${seatsPerRow} * 2.5rem + ${seatsPerRow - 1} * 0.5rem + 2rem)` }}>
                    <IoExitOutline className="inline mr-2 text-2xl font-bold" style={{ strokeWidth: '3px' }} /><span className="font-bold">EMERGENCY EXIT</span>
                  </div>
                </div>
              );
            }
            
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="text-white w-8 text-right font-mono">{row.rowNum}</span>
                <div className="flex gap-2">
                  {row.seats.slice(0, seatsPerSide).map(seatId => (
                    <button
                      key={seatId}
                      className={`w-10 h-10 ${selectedSeats.has(seatId) ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded font-mono text-sm transition-colors`}
                      onClick={() => handleSeatClick(seatId)}
                    >
                      {seatId}
                    </button>
                  ))}
                </div>
                <div className="w-8"></div>
                <div className="flex gap-2">
                  {row.seats.slice(seatsPerSide).map(seatId => (
                    <button
                      key={seatId}
                      className={`w-10 h-10 ${selectedSeats.has(seatId) ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded font-mono text-sm transition-colors`}
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
