import Link from "next/link";
import { FaPlaneDeparture } from "react-icons/fa6";
import { FaPlaneArrival } from "react-icons/fa";

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
                const airline = flight?.airline || "";
                const airlineLogo = flight?.airline_logo || flight?.airlineLogo || "";
                const departureAirportName = flight?.departureAirport ?? flight?.departure_airport?.name ?? "";
                const departureId = flight?.departureId ?? flight?.departure_airport?.id ?? "";
                const arrivalAirportName = flight?.arrivalAirport ?? flight?.arrival_airport?.name ?? "";
                const arrivalId = flight?.arrivalId ?? flight?.arrival_airport?.id ?? "";
                const price = flight?.price || "N/A";

                let key = flight?.flight_number || flight?.id || idx;
                key = key.replace(/\s+/g, '_').toLowerCase();

                const numericPrice = Number(String(price).replace(/[^0-9.-]+/g, ''));
                const formattedPrice = Number.isFinite(numericPrice) ? numericPrice.toLocaleString() : price;

                return (
                    <Link href={`/flights/${key}`} key={key} className="flight-card bg-white">
                        <div className="flex flex-col gap-2 w-full p-4 border-2 border-slate-300 rounded-lg shadow-lg bg-white">
                            <div className="flex justify-between items-center mb-2">
                                <div className="font-bold text-base mb-1 flex items-center gap-2">
                                    {airlineLogo ? (<img className="w-8 h-8" src={airlineLogo} alt={airline || "airline logo"} />) : null}
                                    <span>{airline && airline.trim().split(/\s+/).length === 1 ? `${airline} Airlines` : airline}</span>
                                </div>
                                <span className="text-xl text-green-600 font-extrabold">$ {formattedPrice}</span>
                            </div>

                            {departureAirportName || departureId ? (
                                <div className="flex"><FaPlaneDeparture className="inline mr-2" /> <span><strong>Departure Airport:</strong> {departureAirportName} <span className="text-xs">({departureId})</span></span></div>
                            ) : null}
                            {arrivalAirportName || arrivalId ? (
                                <div className="flex"><FaPlaneArrival className="inline mr-2" /> <span><strong>Arrival Airport:</strong> {arrivalAirportName} <span className="text-xs">({arrivalId})</span></span></div>
                            ) : null}
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}