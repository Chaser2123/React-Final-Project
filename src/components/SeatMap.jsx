'use client';
import { useState, useEffect } from 'react';
import { generateFacilities } from '@/lib/aircraftSeatingConfig';
import { FaRestroom } from "react-icons/fa";
import { IoExitOutline } from "react-icons/io5";

function generateSeatmapData(aircraftType, seatingConfig) {
  const facilities = generateFacilities(aircraftType);
  const seats = [];
  const classInfo = [];
  
  let currentRow = 1;
  
  // Ensure classes array exists
  const classes = seatingConfig?.classes || [];
  
  // Generate seats based on class configuration
  classes.forEach(classConfig => {
    const classStartRow = currentRow;
    
    for (let i = 0; i < classConfig.rows; i++) {
      for (let seatIndex = 0; seatIndex < classConfig.seatsPerRow; seatIndex++) {
        seats.push({
          number: `${currentRow}${String.fromCharCode(65 + seatIndex)}`,
          rowNum: currentRow,
          class: classConfig.name,
          seatsPerRow: classConfig.seatsPerRow
        });
      }
      currentRow++;
    }
    
    classInfo.push({
      name: classConfig.name,
      startRow: classStartRow,
      endRow: currentRow - 1,
      seatsPerRow: classConfig.seatsPerRow
    });
  });

  return { facilities, seats, rows: currentRow - 1, classInfo };
}

export default function SeatMap({ flightRowsCount, seatsPerRow, seatCost, onTotalCostChange, aircraftType, seatingConfig }) {
  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [seatmapData, setSeatmapData] = useState(null);

  useEffect(() => {
    // Use seatingConfig if provided and has classes, otherwise fallback to legacy props
    const config = seatingConfig?.classes ? seatingConfig : {
      classes: [{ name: 'Economy', rows: flightRowsCount || 30, seatsPerRow: seatsPerRow || 6 }]
    };
    setSeatmapData(generateSeatmapData(aircraftType, config));
  }, [aircraftType, flightRowsCount, seatsPerRow, seatingConfig]);
  // Flight classes are now determined by seatingConfig
  const flightClasses = seatmapData?.classInfo?.map(c => c.name) || ['Economy'];
  

  const handleSeatClick = (seatId) => {
    setSelectedSeats(prev => {
      const updated = new Set(prev);
      updated.has(seatId) ? updated.delete(seatId) : updated.add(seatId);
      
      onTotalCostChange?.(updated.size * seatCost);
      return updated;
    });
  };

  if (!seatmapData) return <div className="min-h-screen bg-gray-900 p-8 flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>;

  const { facilities, seats, classInfo } = seatmapData;
  
  console.log('Facilities:', facilities);
  console.log('Total rows:', seatmapData.rows);
  console.log('Class Info:', classInfo);
  console.log('First 10 seats:', seats.slice(0, 10));
  
  const seatsByRow = {};
  seats.forEach(seat => {
    if (!seatsByRow[seat.rowNum]) seatsByRow[seat.rowNum] = [];
    seatsByRow[seat.rowNum].push(seat);
  });

  const rowNumbers = Object.keys(seatsByRow).map(Number).sort((a, b) => a - b);
  const seatRows = [];
  
  console.log('Row numbers:', rowNumbers);
  console.log('Seats by row:', seatsByRow);
  
  // Determine the first class seatsPerRow for front facilities
  const firstClassSeatsPerRow = classInfo[0]?.seatsPerRow || 6;
  
  // Calculate max seats for consistent width
  const maxSeatsPerRow = Math.max(...classInfo.map(c => c.seatsPerRow));

  // Add front emergency exit
  facilities.filter(f => f.code === 'EXIT' && f.coordinates.y === 0).forEach(() => 
    seatRows.push({ type: 'exit', seatsPerRow: maxSeatsPerRow }));

  // Add rows with facilities interspersed
  rowNumbers.forEach(rowNum => {
    // Determine class for this row
    const classForRow = classInfo.find(c => rowNum >= c.startRow && rowNum <= c.endRow);
    const rowSeatsPerRow = classForRow?.seatsPerRow || 6;
    
    // Check if this is the START of a new class to add a header BEFORE the seats
    if (classForRow && rowNum === classForRow.startRow) {
      seatRows.push({ type: 'class-divider', className: classForRow.name, seatsPerRow: rowSeatsPerRow });
    }
    
    // Add the seat row
    const rowSeats = seatsByRow[rowNum].sort((a, b) => a.number.localeCompare(b.number));
    seatRows.push({ 
      type: 'seats', 
      seats: rowSeats, 
      rowNum,
      seatsPerRow: rowSeatsPerRow,
      className: classForRow?.name
    });
    
    // Then check for facilities that come AFTER this row
    facilities.filter(f => f.code === 'LAV' && f.coordinates.y === rowNum).forEach(() => 
      seatRows.push({ type: 'lav', seatsPerRow: rowSeatsPerRow }));
    facilities.filter(f => f.code === 'EXIT' && f.coordinates.y === rowNum && f.coordinates.y !== 0).forEach(() => 
      seatRows.push({ type: 'exit', seatsPerRow: rowSeatsPerRow }));
  });
  
  console.log('Final seatRows array:', seatRows);

  // Add rear facilities (after the last row)
  const lastRow = rowNumbers[rowNumbers.length - 1];
  const lastRowClass = classInfo.find(c => lastRow >= c.startRow && lastRow <= c.endRow);
  const lastRowSeatsPerRow = lastRowClass?.seatsPerRow || 6;
  facilities.filter(f => f.code === 'LAV' && f.coordinates.y > lastRow).forEach(() => 
    seatRows.push({ type: 'lav', seatsPerRow: lastRowSeatsPerRow }));
  facilities.filter(f => f.code === 'EXIT' && f.coordinates.y > lastRow).forEach(() => 
    seatRows.push({ type: 'exit', seatsPerRow: lastRowSeatsPerRow }));

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="flex justify-center">
        <div className="space-y-2">
          {seatRows.map((row, i) => {
            if (row.type === 'lav') {
              const maxSeatsPerRow = Math.max(...classInfo.map(c => c.seatsPerRow));
              return (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-8"></span>
                  <div className="bg-gray-600 text-white flex justify-center items-center py-3 rounded font-semibold text-sm shadow-lg border-2 border-purple-400" style={{ width: `calc(${maxSeatsPerRow} * 2.5rem + ${maxSeatsPerRow - 1} * 0.5rem + 2rem)` }}>
                    <FaRestroom className="inline mr-2 text-2xl" /><span>LAVATORY</span>
                  </div>
                </div>
              );
            }
            
            if (row.type === 'exit') {
              const maxSeatsPerRow = Math.max(...classInfo.map(c => c.seatsPerRow));
              return (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-8"></span>
                  <div className="bg-red-600 text-white flex justify-center items-center py-1 rounded font-semibold text-sm shadow-lg border-2 border-red-400" style={{ width: `calc(${maxSeatsPerRow} * 2.5rem + ${maxSeatsPerRow - 1} * 0.5rem + 2rem)` }}>
                    <IoExitOutline className="inline mr-2 text-2xl font-bold" style={{ strokeWidth: '3px' }} /><span className="font-bold">EMERGENCY EXIT</span>
                  </div>
                </div>
              );
            }
            
            if (row.type === 'class-divider') {
              const dividerSeatsPerRow = row.seatsPerRow || 6;
              // Always use the maximum width (Economy width) for consistency
              const maxSeatsPerRow = Math.max(...classInfo.map(c => c.seatsPerRow));
              return (
                <div key={i} className="flex items-center gap-2 my-2">
                  <span className="w-8"></span>
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white flex justify-center items-center py-2 rounded font-bold text-sm shadow-lg border-2 border-blue-400" style={{ width: `calc(${maxSeatsPerRow} * 2.5rem + ${maxSeatsPerRow - 1} * 0.5rem + 2rem)` }}>
                    {row.className} CLASS
                  </div>
                </div>
              );
            }
            
            const rowSeatsPerRow = row.seatsPerRow || 6;
            const seatsPerSide = Math.floor(rowSeatsPerRow / 2);
            const leftSeats = row.seats.slice(0, seatsPerSide);
            const rightSeats = row.seats.slice(seatsPerSide);
            
            // Calculate seat width to fill the space when there are fewer seats
            const maxSeatsPerRow = Math.max(...classInfo.map(c => c.seatsPerRow));
            const maxSeatsPerSide = Math.floor(maxSeatsPerRow / 2);
            
            // Calculate width per seat to maintain alignment
            // For rows with fewer seats, make them wider to fill the same space
            const seatWidth = rowSeatsPerRow < maxSeatsPerRow 
              ? `calc((${maxSeatsPerSide} * 2.5rem + ${maxSeatsPerSide - 1} * 0.5rem) / ${seatsPerSide})`
              : '2.5rem';
            
            // Determine seat color based on class
            let seatColorClass = 'bg-blue-500 hover:bg-blue-600';
            if (row.className === 'First') {
              seatColorClass = 'bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600';
            } else if (row.className === 'Business') {
              seatColorClass = 'bg-purple-500 hover:bg-purple-600';
            } else if (row.className === 'Premium Economy') {
              seatColorClass = 'bg-cyan-500 hover:bg-cyan-600';
            }
            
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="text-white w-8 text-right font-mono">{row.rowNum}</span>
                <div className="flex gap-2" style={{ width: `calc(${maxSeatsPerSide} * 2.5rem + ${maxSeatsPerSide - 1} * 0.5rem)` }}>
                  {leftSeats.map(seat => (
                    <button
                      key={seat.number}
                      className={`h-10 ${selectedSeats.has(seat.number) ? 'bg-green-500 hover:bg-green-600' : seatColorClass} text-white rounded font-mono text-sm transition-colors`}
                      style={{ width: seatWidth }}
                      onClick={() => handleSeatClick(seat.number)}
                    >
                      {seat.number}
                    </button>
                  ))}
                </div>
                <div className="w-8"></div>
                <div className="flex gap-2" style={{ width: `calc(${maxSeatsPerSide} * 2.5rem + ${maxSeatsPerSide - 1} * 0.5rem)` }}>
                  {rightSeats.map(seat => (
                    <button
                      key={seat.number}
                      className={`h-10 ${selectedSeats.has(seat.number) ? 'bg-green-500 hover:bg-green-600' : seatColorClass} text-white rounded font-mono text-sm transition-colors`}
                      style={{ width: seatWidth }}
                      onClick={() => handleSeatClick(seat.number)}
                    >
                      {seat.number}
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
