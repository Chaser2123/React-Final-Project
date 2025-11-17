import InputField from "./InputField"

export default function LoginInputField({ values, onChange }) {
    return (
        <>
            <InputField label="Email" name="login" type="text" placeholder="Enter your email" value={values?.login || ''} onChange={onChange} />
            <InputField label="Password" name="password" type="password" placeholder="Enter your password" value={values?.password || ''} onChange={onChange} />
        </>
    )
}