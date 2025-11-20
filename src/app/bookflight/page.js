import FlightSearchForm from "@/pages/BookFlight/FlightSearchForm";
import FlightList from "../../components/FlightList.jsx";
import charlestonBg from "@/images/Seattle.jpg";
import serpFallback from "../../../SERPAPI_SEARHES.json";

export default async function Home() {
  const API_KEY = process.env.API_KEY || process.env.SERP_API_KEY || process.env.NEXT_PUBLIC_SERP_API_KEY;

  let data;
  if (API_KEY) {
    try {
      const url = `https://serpapi.com/search.json?engine=google_flights&departure_id=AUS&arrival_id=PEK&outbound_date=2025-11-20&return_date=2025-11-25&currency=USD&hl=en&api_key=${API_KEY}`;
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error(`SERP API error ${response.status}`);
      data = await response.json();
    } catch (e) {
      console.error('SERP API failed, using fallback JSON:', e.message);
      data = serpFallback;
    }
  } else {
    data = serpFallback;
  }

  const flights = normalizeSerpData(data);

  return (
    <main className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${charlestonBg.src})` }}>
      <h1 className="text-3xl font-bold underline">Book A Flight!</h1>

      <div className="rounded-md bg-white max-w-3xl p-6 shadow flex">
        <h2 className="text-lg font-medium text-black">Flight Search Parameters</h2>
        <FlightSearchForm className="text-slate-900" />
      </div>

      <div id="renderLocation"></div>
      <FlightList flightsList={flights} />
    </main>
  );
}

function normalizeSerpData(data) {
  const itineraries = [
    ...(Array.isArray(data?.best_flights) ? data.best_flights : []),
    ...(Array.isArray(data?.other_flights) ? data.other_flights : [])
  ];

  const segments = [];
  for (const itin of itineraries) {
    const price = itin.price;
    if (Array.isArray(itin.flights)) {
      for (const leg of itin.flights) {
        segments.push({
          flight_number: leg.flight_number,
          id: String(leg.flight_number || '').replace(/\s+/g, ''),
          airline: leg.airline,
          airline_logo: leg.airline_logo,
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

