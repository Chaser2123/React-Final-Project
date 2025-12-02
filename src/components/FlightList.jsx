import Link from "next/link";
import { FaPlaneDeparture } from "react-icons/fa6";
import { FaPlaneArrival } from "react-icons/fa";
import { extractFlightData } from "@/lib/flightDataFetcher";

export default function FlightList({ flightsList }) {
    // flightsList is now an array of flights: { flightRouteList, price }
    const flights = Array.isArray(flightsList) ? flightsList : [];
    return (
        <div className="flight-grid px-2 py-2 flex flex-col gap-6">
            {flights.filter(flight => Array.isArray(flight?.flightRouteList)).map((flight, idx) => (
                <div key={idx} className="flight-row border-2 border-indigo-300 rounded-lg shadow-lg bg-white p-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-sm">Flight #{idx + 1}</span>
                        <span className="text-xl text-green-600 font-extrabold">$ {flight.price}</span>
                    </div>
                    <div className="flex flex-row gap-4 flex-wrap">
                        {flight.flightRouteList.map((segment, segIdx) => {
                            const flightData = extractFlightData(segment);
                            let key = segment?.flight_number || segment?.id || segIdx;
                            key = key.replace(/\s+/g, '_').toLowerCase();
                            return (
                                <Link href={`/flights/${key}`} key={key} className="flight-card bg-white min-w-[250px]">
                                    <div className="flex flex-col gap-2 w-full p-2 border border-slate-200 rounded bg-white">
                                        <div className="font-bold text-base mb-1 flex items-center gap-2">
                                            {flightData.airlineLogo ? (
                                                <img className="w-8 h-8" src={flightData.airlineLogo} alt={flightData.airline || "airline logo"} />
                                            ) : null}
                                            <span>{flightData.airline && flightData.airline.trim().split(/\s+/).length === 1 ? `${flightData.airline} Airlines` : flightData.airline}</span>
                                        </div>
                                        {flightData.departureAirportName || flightData.departureId ? (
                                            <div className="flex">
                                                <FaPlaneDeparture className="inline mr-2" />
                                                <span><strong>Departure:</strong> {flightData.departureAirportName} <span className="text-xs">({flightData.departureId})</span></span>
                                            </div>
                                        ) : null}
                                        {flightData.arrivalAirportName || flightData.arrivalId ? (
                                            <div className="flex">
                                                <FaPlaneArrival className="inline mr-2" />
                                                <span><strong>Arrival:</strong> {flightData.arrivalAirportName} <span className="text-xs">({flightData.arrivalId})</span></span>
                                            </div>
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
                </div>
            ))}
        </div>
    );
}