'use client';
import { useState } from 'react';

export default function SeatMap({ flightNumber, flightRowsCount = 20, seatsPerRow = 8, seatCost = 0, onTotalCostChange }) {
  // Track selected seats
  const [selectedSeats, setSelectedSeats] = useState(new Set());

  // Generate seat layout
  const seatRows = [];
  for (let i = 0; i < flightRowsCount; i++) {
    const seats = [];
    for (let j = 0; j < seatsPerRow; j++) {
      const seatLetter = String.fromCharCode(65 + j); // Convert to A, B, C, ...
      const seatId = `${i + 1}${seatLetter}`;
      seats.push(seatId);
    }
    seatRows.push(seats);
  }

  // Split seats for aisle (half on left, half on right)
  const seatsPerSide = seatsPerRow / 2;

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

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      {/* <h1 className="text-white text-3xl font-bold text-center mb-8">
        Flight Details for Flight Number: {flightNumber}
      </h1> */}

      <div className="flex justify-center">
        <div className="space-y-2">
          {seatRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-2">
              {/* Row number */}
              <span className="text-white w-8 text-right font-mono">
                {rowIndex + 1}
              </span>

              {/* Left side seats */}
              <div className="flex gap-2">
                {row.slice(0, seatsPerSide).map((seatId) => (
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
                {row.slice(seatsPerSide).map((seatId) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}
