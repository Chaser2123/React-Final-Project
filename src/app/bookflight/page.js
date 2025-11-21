"use client";
import FlightSearchForm from "@/pages/BookFlight/FlightSearchForm";
import FlightList from "../../components/FlightList.jsx";
import { fetchAndNormalizeFlights, normalizeSerpData } from "@/lib/flightDataFetcher";
import serpFallback from "../../../SERPAPI_SEARHES.json";
import { useState, useEffect } from "react";

// Chases's Code that was conflicted 
// export default asnc function Home(){ 
//   const flights = await fetchAndNormalizeFlights();}

export default function Home() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load saved flights from localStorage on mount
  useEffect(() => {
    const savedFlights = localStorage.getItem('flightSearchResults');
    if (savedFlights) {
      try {
        setFlights(JSON.parse(savedFlights));
      } catch (e) {
        console.error('Failed to parse saved flights:', e);
      }
    }
  }, []);

  const searchFlights = async (departure, arrival, outbound, returnd) => {
    setLoading(true);
    try {
      const API_KEY = process.env.NEXT_PUBLIC_SERP_API_KEY;
      let data;
      
      if (API_KEY) {
        try {
          const url = `https://serpapi.com/search.json?engine=google_flights&departure_id=${departure}&arrival_id=${arrival}&outbound_date=${outbound}&return_date=${returnd}&currency=USD&hl=en&api_key=${API_KEY}`;
          const response = await fetch(url, { cache: 'no-store' });
          if (!response.ok) throw new Error(`SERP API error ${response.status}`);
          data = await response.json();
        } catch (e) {
          console.error('SERP API failed, using fallback JSON:', e.message);
          data = serpFallback;
        }
      } else {
        data = serpFallback;
        alert('SERP API key is missing. Using fallback data.');
      }

      const normalizedFlights = normalizeSerpData(data);
      setFlights(normalizedFlights);
      // Save flights to localStorage
      localStorage.setItem('flightSearchResults', JSON.stringify(normalizedFlights));
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main >
      <h1 className="text-3xl font-bold underline">Book A Flight!</h1>

      <div className="rounded-md bg-white max-w-3xl p-6 shadow flex">
        <h2 className="text-lg font-medium text-black">Flight Search Parameters</h2>
        <FlightSearchForm className="text-slate-900" onSearch={searchFlights} />
      </div>

      <div id="renderLocation"></div>
      {loading && <p className="text-center mt-4">Searching for flights...</p>}
      <FlightList flightsList={flights} />
    </main>
  );
}

