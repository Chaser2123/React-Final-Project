
export default async function FlightDetails({params}) {
    const {flight_number}= await params
    return (
        <div>
            <h1 className="text-white">Flight Details for Flight Number: {flight_number}</h1>
        </div>
    );

}