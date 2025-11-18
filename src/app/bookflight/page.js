import FlightSearchForm from "@/pages/BookFlight/FlightSearchForm";
import FlightList from "../../components/FlightList.jsx";

export default async function Home() {
    const API_KEY = process.env.API_KEY;
    const response = await fetch('https://serpapi.com/search.json?engine=google_flights&departure_id=AUS&arrival_id=PEK&outbound_date=2025-11-20&return_date=2025-11-25&currency=USD&hl=en&api_key=' + API_KEY);
    const data = await response.json();
    console.log('Fetched data:', data);
    class flightList {
      constructor() {
        this.flightList = [];
      }
      add(item) {
        this.flightList.push(item);
      }
    }
    class FlightDetails {
      constructor(arrivalAirport, arrivalId, departureAirport, departureId) {
        this.arrivalAirport = arrivalAirport;
        this.arrivalId = arrivalId;
        this.departureAirport = departureAirport;
        this.departureId = departureId;
      }
    }
    function processFlightData() {
      const compiledFlights = new flightList
     for (const flights of data.best_flights && data.other_flights) {
      const flightRouteList = new flightList();
      for (const flightStops of flights.flights) {
        const flightDetails = new FlightDetails(
          flightStops.arrival_airport.name,
          flightStops.arrival_airport.id,
          flightStops.departure_airport.name,
          flightStops.departure_airport.id
        );
        flightRouteList.add(flightDetails);
      }
      compiledFlights.add(flightRouteList);
    }
    console.log('compiledFlights', compiledFlights)
    return compiledFlights;
  }

  return (
    <main>
            <h1 className="text-3xl font-bold underline">
        Book A Flight!
      </h1>
      
      <div className="rounded-md bg-white max-w-3xl p-6 shadow flex">
        <h2 className="text-lg font-medium">Flight Search Parameters</h2>
        <FlightSearchForm />
      </div>

      
      <div id="renderLocation"></div>
      <FlightList flightsList={processFlightData()} />
    </main>
  ); 
};

