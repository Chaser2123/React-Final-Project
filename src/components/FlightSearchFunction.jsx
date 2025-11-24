'use client'; 
import { useState } from "react";
import FlightList from "./FlightList";
import FlightSearchParam from "../pages/BookFlight/FlightSearchParam";

export default function FlightSearchFunction() {
    const [APIdepartureId, setAPIdepartureId] = useState("PEK");
    const [APIarrivalId, setAPIarrivalId] = useState("AUS");
    const [APIoutboundDate, setAPIoutboundDate] = useState("2025-11-24");
    const [APIreturnDate, setAPIreturnDate] = useState("2025-11-28");

    async function fetchFlightData() {
    const API_KEY = process.env.API_KEY;
    try {
    const response = await fetch(`https://serpapi.com/search.json?engine=google_flights&departure_id=AUS&arrival_id=PEK&outbound_date=2025-11-24&return_date=2025-11-28&currency=USD&hl=en&api_key=` + `1dcd7977a64fd72992151415ea0d29aa5cf811704e150316803e04ac9f24cf9f`);
    console.log('API Response Status:', response.json());
  } catch (error) {
      console.error('Error fetching flight data:', error);
      return null;
    }
    const data = await response.json();
  }
    const data = fetchFlightData();
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

  const handleSubmit = () => {
    alert(`form submitted: ${departure}, ${arrival}, ${outbound}, ${returnd}`);
  }
  return (
    <main>
      
      <h1 className="text-3xl font-bold underline">
        Book A Flight!
      </h1>
      <div id="renderLocation"></div>
      <FlightList flightsList={processFlightData()} />

      <form className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2" onSubmit={handleSubmit}>
            <FlightSearchParam label="Departure (IATA)" value={APIdepartureId} onChange={(e) => setAPIdepartureId(e.target.value.toUpperCase())} />
            <FlightSearchParam label="Arrival (IATA)" value={APIarrivalId} onChange={(e) => setAPIarrivalId(e.target.value.toUpperCase())} />
            <FlightSearchParam label="Outbound date" type="date" value={APIoutboundDate} onChange={(e) => setAPIoutboundDate(e.target.value)} />
            <FlightSearchParam label="Return date" type="date" value={APIreturnDate} onChange={(e) => setAPIreturnDate(e.target.value)} />
      
            <div className="sm:col-span-2 mt-2 flex gap-2">
              <button type="submit" className="rounded bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-60">Search</button>
            </div>
          </form>
    </main>
  ); 
};
