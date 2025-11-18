"use client";

export default function Toggle({ label, index, active, onClick }) {
  const isActive = index === active;
  return (
    <button
      type="button"
      onClick={() => onClick(index)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-300 ${
        isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
      }`}
    >
      {label}
    </button>
  );
}
