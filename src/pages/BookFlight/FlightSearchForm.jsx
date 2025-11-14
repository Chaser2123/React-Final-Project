"use client";
import FlightSearchParam from "./FlightSearchParam";
import { useState } from "react";
export default function FlightSearchForm({ defaults = {}}) {
  const [departure, setDeparture] = useState(defaults.departure_id || "PEK");
  const [arrival, setArrival] = useState(defaults.arrival_id || "AUS");
  const [outbound, setOutbound] = useState(defaults.outbound_date || "2025-11-14");
  const [returnd, setReturnd] = useState(defaults.return_date || "2025-11-20");

  const handleSubmit = () => {
    alert(`form submitted: ${departure}, ${arrival}, ${outbound}, ${returnd}`);
  }

  return (
    <form className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2" onSubmit={handleSubmit}>
      <FlightSearchParam label="Departure (IATA)" value={departure} onChange={(e) => setDeparture(e.target.value.toUpperCase())} />
      <FlightSearchParam label="Arrival (IATA)" value={arrival} onChange={(e) => setArrival(e.target.value.toUpperCase())} />
      <FlightSearchParam label="Outbound date" type="date" value={outbound} onChange={(e) => setOutbound(e.target.value)} />
      <FlightSearchParam label="Return date" type="date" value={returnd} onChange={(e) => setReturnd(e.target.value)} />

      <div className="sm:col-span-2 mt-2 flex gap-2">
        <button type="submit" className="rounded bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-60">Search</button>
      </div>
    </form>
  );
}