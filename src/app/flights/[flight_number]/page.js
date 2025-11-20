import SeatMap from '@/components/SeatMap.jsx';

export default async function FlightDetails({ params }) {
    const { flight_number } = await params;
    const flightRowsCount = 15; // Example: 20 rows
    const seatsPerRow = 6 

    return (
        <SeatMap 
            flightNumber={flight_number} 
            flightRowsCount={flightRowsCount}
            seatsPerRow={seatsPerRow}
        />
    );
}