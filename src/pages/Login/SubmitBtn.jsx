export default function SubmitBtn({ label, onClick }) {
  return (
    <button 
    className="bg-indigo-500 transition-transform duration-400 align-middle ease-in-out hover:bg-indigo-700 text-white font-bold py-2 px-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 w-40"
    onClick={onClick}>
      {label}
    </button>

  );
}