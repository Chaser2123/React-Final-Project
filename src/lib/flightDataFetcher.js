export async function fetchAndNormalizeFlights() {
    const API_KEY = process.env.NEXT_PUBLIC_SERP_API_KEY;

    if (!API_KEY) {
        console.error('SERP API key is missing');
        return [];
    }

    try {
        const url = `https://serpapi.com/search.json?engine=google_flights&departure_id=AUS&arrival_id=PEK&outbound_date=2025-11-20&return_date=2025-11-25&currency=USD&hl=en&api_key=${API_KEY}`;
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) throw new Error(`SERP API error ${response.status}`);
        const data = await response.json();
        return normalizeSerpData(data);
    } catch (e) {
        console.error('SERP API failed:', e.message);
        return [];
    }
}

export function normalizeSerpData(data) {
    const itineraries = [
        ...(Array.isArray(data?.best_flights) ? data.best_flights : []),
        ...(Array.isArray(data?.other_flights) ? data.other_flights : [])
    ];

    const segments = [];
    for (const itin of itineraries) {
        const price = itin.price;
        if (Array.isArray(itin.flights)) {
            for (const leg of itin.flights) {
                let flightKey = leg.flight_number || '';
                flightKey = flightKey.replace(/\s+/g, '_').toLowerCase();
                
                // Convert duration from minutes to readable format
                const durationMinutes = leg.duration || 0;
                const hours = Math.floor(durationMinutes / 60);
                const minutes = durationMinutes % 60;
                const durationFormatted = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
                
                segments.push({
                    flight_number: leg.flight_number,
                    id: flightKey,
                    airline: leg.airline,
                    airlineLogo: leg.airline_logo,
                    airplane: leg.airplane,
                    departureAirportName: leg.departure_airport?.name,
                    departureId: leg.departure_airport?.id,
                    departureTime: leg.departure_airport?.time,
                    arrivalAirportName: leg.arrival_airport?.name,
                    arrivalId: leg.arrival_airport?.id,
                    arrivalTime: leg.arrival_airport?.time,
                    duration: durationFormatted,
                    legroom: leg.legroom,
                    stops: itin.flights?.length > 1 ? itin.flights.length - 1 : 0,
                    price
                });
            }
        }
    }
    return segments;
}

export function extractFlightData(flight) {
    const numericPrice = Number(String(flight?.price || 0).replace(/[^0-9.-]+/g, ''));
    
    return {
        ...flight,
        formattedPrice: Number.isFinite(numericPrice) ? numericPrice.toLocaleString() : flight?.price || "N/A"
    };
}