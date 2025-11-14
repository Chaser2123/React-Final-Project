import InputField from "./InputField";

export default function SignupInputField({ values, onChange }) {
    return (
        <>
        <InputField label="Email" name="email" type="email" placeholder="Your Email" value={values?.email || ''} onChange={onChange} />
        <InputField label="First Name" name="firstName" type="text" placeholder="First Name" value={values?.firstName || ''} onChange={onChange} />
        <InputField label="Last Name" name="lastName" type="text" placeholder="Last Name" value={values?.lastName || ''} onChange={onChange} />
        <InputField label="Password" name="password" type="password" placeholder="Enter Password" value={values?.password || ''} onChange={onChange} />
        <InputField label="Confirm Password" name="confirmPassword" type="password" placeholder="Confirm password" value={values?.confirmPassword || ''} onChange={onChange} />
        </>
    )
}