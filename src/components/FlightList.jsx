export default function FlightList({ flightsList }) {
    // Normalize input: support existing nested shape, API `flights` array, or direct array
    const allFlights = flightsList?.flightList
        ? flightsList.flightList.flatMap(group => group.flightList || [])
        : (Array.isArray(flightsList?.flights)
            ? flightsList.flights
            : (Array.isArray(flightsList) ? flightsList : []));

    return (
        <div className="flight-grid px-2 py-2 flex flex-col gap-6">
            {allFlights.map((flight, idx) => {
                const airline = flight?.airline || "";
                const airlineLogo = flight?.airline_logo || flight?.airlineLogo || "";
                const departureAirportName = flight?.departureAirport ?? flight?.departure_airport?.name ?? "";
                const departureId = flight?.departureId ?? flight?.departure_airport?.id ?? "";
                const arrivalAirportName = flight?.arrivalAirport ?? flight?.arrival_airport?.name ?? "";
                const arrivalId = flight?.arrivalId ?? flight?.arrival_airport?.id ?? "";
                const key = flight?.flight_number || flight?.id || idx;

                return (
                    <div key={key} className="flight-card bg-white">
                        <div className="flex flex-col gap-2 w-full p-4 border-2 border-slate-300 rounded-lg shadow-lg bg-white">
                        <div className="font-bold text-base mb-1 flex items-center gap-2">
                            {airlineLogo ? (<img className="w-8 h-8" src={airlineLogo} alt={airline || "airline logo"} />) : null}
                            <span>{airline && airline.trim().split(/\s+/).length === 1 ? `${airline} Airlines` : airline}</span>
                        </div>

                        {departureAirportName || departureId ? (
                            <p>Departure Airport: {departureAirportName} ({departureId})</p>
                        ) : null}
                        {arrivalAirportName || arrivalId ? (
                            <p>Arrival Airport: {arrivalAirportName} ({arrivalId})</p>
                        ) : null}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}