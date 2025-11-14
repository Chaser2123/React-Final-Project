"use client";

export default function FlightSearchParam({
  label,
  value,
  onChange,
  checked,
  className = "",
  inputClassName = "mt-1 rounded border px-2 py-1",
  labelClassName = "flex flex-col text-sm",
  children,
  ...rest
}) {
  // Checkbox variant renders inline with the label text on the right
  return (
    <label className={`${labelClassName} ${className}`}>
      {label}
      <input type='text' className={inputClassName} value={value} onChange={onChange} {...rest} />
      {children}
    </label>
  );
}
