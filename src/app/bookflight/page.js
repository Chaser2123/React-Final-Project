import FlightSearchForm from "@/pages/BookFlight/FlightSearchForm";
import FlightList from "../../components/FlightList.jsx";
import { fetchAndNormalizeFlights } from "@/lib/flightDataFetcher";

export default async function Home() {
  const flights = await fetchAndNormalizeFlights();

  return (
    <main >
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

