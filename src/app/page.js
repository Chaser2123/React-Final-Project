
export default function Home() {
  return (
    <>
      <div
        className="mx-auto p-4 bg-cover bg-center rounded-lg"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80')",
        }}
      >
        <div className="bg-black/40 p-6 rounded">
          <h1 className="text-3xl font-bold mb-4 text-white">Welcome to the Flight Booking App</h1>
          <p className="text-lg text-white">Explore and book flights easily!</p>
        </div>
      </div>
    </>
  );
}
