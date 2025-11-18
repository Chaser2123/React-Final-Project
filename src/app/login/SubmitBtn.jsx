"use client";

export default function SubmitBtn({ label, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-2 px-4 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        disabled 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-blue-500 hover:bg-blue-600'
      }`}
    >
      {label}
    </button>
  );
}
