'use client';
import { useState, useEffect } from 'react';
import SeatMap from '@/components/SeatMap.jsx';
import { fetchAndNormalizeFlights, extractFlightData } from '@/lib/flightDataFetcher';
import { getSeatingConfig } from '@/lib/aircraftSeatingConfig';
import { FaPlaneDeparture } from 'react-icons/fa6';
import { FaPlaneArrival } from 'react-icons/fa';

export default function FlightDetails({ params }) {
    const [flight, setFlight] = useState(null);
    const [flightData, setFlightData] = useState({});
    const [totalCost, setTotalCost] = useState(0);
    const [flightNumber, setFlightNumber] = useState(null);
    const [seatingConfig, setSeatingConfig] = useState({ rows: 30, seatsPerRow: 6 });

    useEffect(() => {
        async function loadFlight() {
            const resolvedParams = await params;
            const { flight_number } = resolvedParams;
            setFlightNumber(flight_number);
            
            const flights = await fetchAndNormalizeFlights();
            const foundFlight = flights.find(f => f.id === flight_number || f.flight_number === flight_number);
            
            setFlight(foundFlight);
            if (foundFlight) {
                const extractedData = extractFlightData(foundFlight);
                setFlightData(extractedData);
                
                // Get seating configuration based on aircraft type
                const config = getSeatingConfig(extractedData.airplane);
                setSeatingConfig(config);
            }
        }
        loadFlight();
    }, [params]);

    const seatCost = parseFloat(String(flightData.price || 0).replace(/[^0-9.-]+/g, '')) || 0;

    const handleTotalCostChange = (newTotal) => {
        setTotalCost(newTotal);
    };
    return (
        <div>
            <h1 className="text-white text-3xl font-bold text-center my-4">Flight Details for {flightNumber}</h1>
            <div className='flex justify-around'>
            {flight ? (
                <div className="bg-white h-auto p-4 border-2 w-120 border-slate-300 rounded-lg shadow-lg mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <div className="font-bold text-base mb-1 flex items-center gap-2">
                            {flightData.airlineLogo ? (<img className="w-8 h-8" src={flightData.airlineLogo} alt={flightData.airline || "airline logo"} />) : null}
                            <span>{flightData.airline && flightData.airline.trim().split(/\s+/).length === 1 ? `${flightData.airline} Airlines` : flightData.airline}</span>
                        </div>
                        <span className="text-xl text-green-600 font-extrabold">$ {totalCost.toLocaleString()}</span>
                    </div>

                    {flightData.departureAirportName || flightData.departureId ? (
                        <div className="flex"><FaPlaneDeparture className="inline mr-2" /> <span><strong>Departure Airport:</strong> {flightData.departureAirportName} <span className="text-xs">({flightData.departureId})</span></span></div>
                    ) : null}
                    {flightData.arrivalAirportName || flightData.arrivalId ? (
                        <div className="flex"><FaPlaneArrival className="inline mr-2" /> <span><strong>Arrival Airport:</strong> {flightData.arrivalAirportName} <span className="text-xs">({flightData.arrivalId})</span></span></div>
                    ) : null}
                    <button className='rounded bg-blue-950 border-blue-700 border-2 hover:bg-blue-800 text-white px-4 py-2 mt-2'>Proceed to Checkout</button>
                    <div>
                        <strong>Goal:</strong>
                        <div>* If you select a flight with connecting flights, instead of showing the Proceed to Checkout button, display "Next Flight" button that when clicked shows details of the next flight.</div>
                        <div><em>Not yet implemented.</em></div>
                        <br />
                        <div>* Pull from another API that will correcltly show which seats have been taken already, and show different prices for different classes (Economy, Business, First Class).</div>
                        <div><em>Not yet implemented.</em></div>
                    </div>
                </div>
            ) : (
                <p className="text-red-600 mb-6">Flight not found.</p>
            )}

            <SeatMap 
                flightNumber={flightNumber} 
                flightRowsCount={seatingConfig.rows} 
                seatsPerRow={seatingConfig.seatsPerRow}
                seatCost={seatCost}
                onTotalCostChange={handleTotalCostChange}
                departureDate={flightData.departureDate || '2025-12-25'}
                origin={flightData.departureId}
                destination={flightData.arrivalId}
                aircraftType={flightData.airplane}
            />
            </div>
        </div>
    );
}