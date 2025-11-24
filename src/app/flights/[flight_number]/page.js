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
            
            // Try to get flights from localStorage first
            let flights = [];
            const savedFlights = localStorage.getItem('flightSearchResults');
            if (savedFlights) {
                try {
                    flights = JSON.parse(savedFlights);
                    console.log('Loaded flights from localStorage:', flights);
                } catch (e) {
                    console.error('Failed to parse saved flights:', e);
                }
            }
            
            // If no flights in localStorage, fetch from API
            if (flights.length === 0) {
                console.log('No flights in localStorage, fetching from API...');
                flights = await fetchAndNormalizeFlights();
            }
            
            const foundFlight = flights.find(f => f.id === flight_number || f.flight_number === flight_number);
            console.log('Looking for flight:', flight_number);
            console.log('Found flight:', foundFlight);
            
            setFlight(foundFlight);
            if (foundFlight) {
                const extractedData = extractFlightData(foundFlight);
                console.log('Extracted flight data:', extractedData);
                console.log('airlineLogo:', extractedData.airlineLogo);
                console.log('departureAirportName:', extractedData.departureAirportName);
                console.log('arrivalAirportName:', extractedData.arrivalAirportName);
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
                            {flightData.airlineLogo && (<img className="w-8 h-8" src={flightData.airlineLogo} alt={flightData.airline || "airline logo"} />)}
                            <span>{flightData.airline && flightData.airline.trim().split(/\s+/).length === 1 ? `${flightData.airline} Airlines` : flightData.airline}</span>
                        </div>
                        <span className="text-xl text-green-600 font-extrabold">$ {totalCost.toLocaleString()}</span>
                    </div>

                    {(flightData.departureAirportName || flightData.departureId) && (
                        <div className="flex items-center mb-2"><FaPlaneDeparture className="inline mr-2" /> <span><strong>Departure:</strong> {flightData.departureAirportName} {flightData.departureId && <span className="text-xs">({flightData.departureId})</span>}</span></div>
                    )}
                    {(flightData.arrivalAirportName || flightData.arrivalId) && (
                        <div className="flex items-center mb-2"><FaPlaneArrival className="inline mr-2" /> <span><strong>Arrival:</strong> {flightData.arrivalAirportName} {flightData.arrivalId && <span className="text-xs">({flightData.arrivalId})</span>}</span></div>
                    )}

                    <div className="text-sm mt-3 space-y-1">
                        {flightData.departureTime && (
                            <div><strong>Departure Time:</strong> {flightData.departureTime}</div>
                        )}
                        {flightData.arrivalTime && (
                            <div><strong>Arrival Time:</strong> {flightData.arrivalTime}</div>
                        )}
                        {flightData.duration && (
                            <div><strong>Duration:</strong> {flightData.duration}</div>
                        )}
                        {flightData.airplane && (
                            <div><strong>Aircraft:</strong> {flightData.airplane}</div>
                        )}
                        {flightData.legroom && (
                            <div><strong>Legroom:</strong> {flightData.legroom}</div>
                        )}
                        {typeof flightData.stops !== 'undefined' && flightData.stops !== null && (
                            <div><strong>Stops:</strong> {flightData.stops === 0 ? 'Nonstop' : String(flightData.stops)}</div>
                        )}
                    </div>
                    
                    <button className='rounded bg-blue-950 border-blue-700 border-2 hover:bg-blue-800 text-white px-4 py-2 mt-4'>Proceed to Checkout</button>
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
                seatingConfig={seatingConfig}
            />
            </div>
        </div>
    );
}