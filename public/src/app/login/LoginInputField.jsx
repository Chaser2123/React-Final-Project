"use client";
import InputField from './InputField';

export default function LoginInputField({ values, onChange }) {
  return (
    <>
      <InputField label="Email" name="email" type="email" placeholder="Your Email" value={values?.email || ''} onChange={onChange} />
      <InputField label="Password" name="password" type="password" placeholder="Enter your password" value={values?.password || ''} onChange={onChange} />
    </>
  );
}
