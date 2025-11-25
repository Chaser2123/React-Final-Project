export default function ModalInput({ value, type = "text" }) {
  return (
    <div>
      <label htmlFor={value}>{value}</label>
      <input type={type} id={value} className="border-2 ml-2" />
    </div>
  );
}