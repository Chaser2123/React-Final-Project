
export default function Home() {
  return (
    <>
      <div
        className="mx-auto p-4 bg-cover rounded-lg bg-[url('./OIP.jpg')] h-100" 
        style={{ backgroundPosition: "0px -260px" }}
      >
        <div className="bg-black/40 p-6 rounded">
          <h1 className="text-3xl font-bold mb-4 text-white">Welcome to the Flight Booking App</h1>
          <p className="text-lg text-white">Explore and book flights easily!</p>
        </div>
      </div>
    </>
  );
}
