export async function fetchAndNormalizeFlights() {
    const API_KEY = process.env.API_KEY || process.env.SERP_API_KEY || process.env.NEXT_PUBLIC_SERP_API_KEY;

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
                
                segments.push({
                    flight_number: leg.flight_number,
                    id: flightKey,
                    airline: leg.airline,
                    airline_logo: leg.airline_logo,
                    airplane: leg.airplane,
                    departureAirport: leg?.departure_airport?.name,
                    departureId: leg?.departure_airport?.id,
                    arrivalAirport: leg?.arrival_airport?.name,
                    arrivalId: leg?.arrival_airport?.id,
                    price
                });
            }
        }
    }
    return segments;
}

export function extractFlightData(flight) {
    const airline = flight?.airline || "";
    const airlineLogo = flight?.airline_logo || flight?.airlineLogo || "";
    const airplane = flight?.airplane || "";
    const departureAirportName = flight?.departureAirport ?? flight?.departure_airport?.name ?? "";
    const departureId = flight?.departureId ?? flight?.departure_airport?.id ?? "";
    const arrivalAirportName = flight?.arrivalAirport ?? flight?.arrival_airport?.name ?? "";
    const arrivalId = flight?.arrivalId ?? flight?.arrival_airport?.id ?? "";
    const price = flight?.price || "N/A";

    const numericPrice = Number(String(price).replace(/[^0-9.-]+/g, ''));
    const formattedPrice = Number.isFinite(numericPrice) ? numericPrice.toLocaleString() : price;

    return {
        airline,
        airlineLogo,
        airplane,
        departureAirportName,
        departureId,
        arrivalAirportName,
        arrivalId,
        price,
        formattedPrice
    };
}
