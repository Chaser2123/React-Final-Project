"use client";

export default function SubmitBtn({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      {label}
    </button>
  );
}
