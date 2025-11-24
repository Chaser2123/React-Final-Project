import Link from "next/link";
import { FaPlaneDeparture } from "react-icons/fa6";
import { FaPlaneArrival } from "react-icons/fa";
import { extractFlightData } from "@/lib/flightDataFetcher";

export default function FlightList({ flightsList }) {
    // Normalize input: support existing nested shape, API `flights` array, or direct array
    const allFlights = flightsList?.flightList
        ? flightsList.flightList.flatMap(group => group.flightList || [])
        : (Array.isArray(flightsList?.flights)
            ? flightsList.flights
            : (Array.isArray(flightsList) ? flightsList : []));
            return (
            <div className="flight-grid px-2 py-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allFlights.map((flight, idx) => {
                const flightData = extractFlightData(flight);

                let key = flight?.flight_number || flight?.id || idx;
                key = key.replace(/\s+/g, '_').toLowerCase();

                return (
                    <Link href={`/flights/${key}`} key={key} className="flight-card bg-white">
                        <div className="flex flex-col gap-2 w-full p-4 border-2 border-slate-300 rounded-lg shadow-lg bg-white">
                            <div className="flex justify-between items-center mb-2">
                                <div className="font-bold text-base mb-1 flex items-center gap-2">
                                    {flightData.airlineLogo ? (<img className="w-8 h-8" src={flightData.airlineLogo} alt={flightData.airline || "airline logo"} />) : null}
                                    <span>{flightData.airline && flightData.airline.trim().split(/\s+/).length === 1 ? `${flightData.airline} Airlines` : flightData.airline}</span>
                                </div>
                                <span className="text-xl text-green-600 font-extrabold">$ {flightData.formattedPrice}</span>
                            </div>

                            {flightData.departureAirportName || flightData.departureId ? (
                                <div className="flex"><FaPlaneDeparture className="inline mr-2" /> <span><strong>Departure Airport:</strong> {flightData.departureAirportName} <span className="text-xs">({flightData.departureId})</span></span></div>
                            ) : null}
                            {flightData.arrivalAirportName || flightData.arrivalId ? (
                                <div className="flex"><FaPlaneArrival className="inline mr-2" /> <span><strong>Arrival Airport:</strong> {flightData.arrivalAirportName} <span className="text-xs">({flightData.arrivalId})</span></span></div>
                            ) : null}
                            
                            <div className="text-sm text-gray-600 mt-2">
                                {flightData.departureTime && flightData.arrivalTime && (
                                    <div className="flex justify-between">
                                        <span><strong>Departs:</strong> {flightData.departureTime}</span>
                                        <span><strong>Arrives:</strong> {flightData.arrivalTime}</span>
                                    </div>
                                )}
                                {flightData.duration && (
                                    <div><strong>Duration:</strong> {flightData.duration}</div>
                                )}
                                {typeof flightData.stops !== 'undefined' && flightData.stops !== null && (
                                    <div><strong>Stops:</strong> {flightData.stops === 0 ? 'Nonstop' : String(flightData.stops)}</div>
                                )}
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}