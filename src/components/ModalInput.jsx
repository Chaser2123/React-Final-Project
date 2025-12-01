export default function ModalInput({ value, onChange, type = "text", placeholder }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border-2 ml-2 w-full px-2 py-1 rounded"
    />
  );
}