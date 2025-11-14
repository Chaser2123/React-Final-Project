import { useState } from 'react'
import LoginInputField from './LoginInputField.jsx'
import SignupInputField from './SignupInputField.jsx'
import Toggle from './Toggle.jsx'
import SubmitBtn from './SubmitBtn.jsx'
import '../../App.css'

function LoginPage() {
  const [toggle, setToggle] = useState(0)
  const [form, setForm] = useState({
    login: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  return (
      <div className="flex flex-col gap-4 w-96 mx-auto mt-20 p-8 border-2 border-slate-300 rounded-lg shadow-lg bg-white">
        <div>
          <Toggle label="Login" index={0} active={toggle} onClick={setToggle} />
          <Toggle label="Sign Up" index={1} active={toggle} onClick={setToggle} />
        </div>
        <div>
          {toggle === 0 ? (
            <LoginInputField values={{ login: form.login, password: form.password }} onChange={handleChange} />
          ) : (
            <SignupInputField values={{
              email: form.email,
              firstName: form.firstName,
              lastName: form.lastName,
              password: form.password,
              confirmPassword: form.confirmPassword
            }} onChange={handleChange} />
          )}
          <SubmitBtn label={toggle === 0 ? "Login" : "Sign Up"} onClick={() => {
            if (toggle === 0) {
              console.log("Logging in with", form.login, form.password)
            } else {
              console.log("Signing up with", form.email, form.firstName, form.lastName, form.password)
            }
          }} />
        </div>
      </div>
  )
}

export default LoginPage
