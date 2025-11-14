import InputField from "./InputField"

export default function LoginInputField({ values, onChange }) {
    return (
        <>
            <InputField label="Login" name="login" type="text" placeholder="Enter your login" value={values?.login || ''} onChange={onChange} />
            <InputField label="Password" name="password" type="password" placeholder="Enter your password" value={values?.password || ''} onChange={onChange} />
        </>
    )
}