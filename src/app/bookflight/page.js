"use client";
import FlightSearchForm from "@/pages/BookFlight/FlightSearchForm";
import FlightList from "../../components/FlightList.jsx";
import LoadingScreen from "../../components/LoadingScreen.jsx";
import { normalizeSerpData } from "@/lib/flightDataFetcher";
import { useState, useEffect } from "react";

// Chases's Code that was conflicted 
// export default asnc function Home(){ 
//   const flights = await fetchAndNormalizeFlights();}

export default function Home() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load saved flights on mount
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
    console.log('Search clicked with:', { departure, arrival, outbound, returnd });
    setFlights([]); // Clear existing tickets
    setLoading(true);
    try {
      // Use /api route to keep API key secure on server side
      const url = `/api/flights?departure_id=${departure}&arrival_id=${arrival}&outbound_date=${outbound}&return_date=${returnd}`;
      console.log('Fetching from:', url);
      const response = await fetch(url, { cache: 'no-store' });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error:', errorData);
        throw new Error(`SERP API error ${response.status}: ${errorData.error || 'Unknown error'}`);
      }
      
      const data = await response.json();
      console.log('Raw API data:', data);
      const normalizedFlights = normalizeSerpData(data);
      console.log('Normalized flights:', normalizedFlights);
      setFlights(normalizedFlights);
      localStorage.setItem('flightSearchResults', JSON.stringify(normalizedFlights));
    } catch (error) {
      console.error('Search failed:', error);
      alert('Failed to search flights. Please try again. Error: ' + error.message);
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
      {loading ? <LoadingScreen /> : <FlightList flightsList={flights} />}
    </main>
  );
}

