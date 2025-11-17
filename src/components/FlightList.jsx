export default function FlightList({ flightsList }) {
    console.log('returned data', flightsList.flightList[0].flightList[0])
    return (
        <>
            {flightsList.flightList.map((i, idx) => (
                <div key={idx} className="px-2 py-2 flex gap-y-2">
                    {i.flightList.map((j, jdx) => (
                        <div key={jdx} className="px-2 py-2 flex bg-amber-950 border-2 gap-x-7">
                            <p>Departure Airport: {j.departureAirport}({j.departureId})</p>
                            <p>Arrival Airport: {j.arrivalAirport}({j.arrivalId})</p>
                        </div>
                    ))}
                </div>
            ))}
        </>
    )
}