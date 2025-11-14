export default function InputField({ label, type = 'text', placeholder = '', value = '', onChange, name, id }) {
  const computedId = id ?? name; // assume at least one is provided by parent
  const computedName = name ?? id;
  return (
    <div className="mb-4 flex items-center gap-4">
      <label
        className="w-32 text-right text-gray-700 text-sm font-medium"
        htmlFor={computedId}
      >
        {label}
      </label>
      <input
        id={computedId}
        name={computedName}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="shadow-sm border border-gray-300 rounded-md w-45 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}