"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
// import { useNavigate } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'

import LoginInputField from './Login/LoginInputField.jsx'
import SignupInputField from './Login/SignupInputField.jsx'
import Toggle from './Login/Toggle.jsx'
import SubmitBtn from './Login/SubmitBtn.jsx'

import '@/app/globals.css'
// Initialize users from localStorage without overwriting existing data
const savedUsers = JSON.parse(localStorage.getItem('users') || '{}')

function Login() {
  const router = useRouter()
  const { login: authLogin } = useAuth()
  const [toggle, setToggle] = useState(0)
  const [form, setForm] = useState({
    login: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  })

  // Destructure to reduce repetitive `form.` usage
  const { login: username, password, email, firstName, lastName, confirmPassword } = form

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="w-full min-h-screen flex flex-col justify-start items-center bg-image bg-cover bg-center bg-[url('@/images/airplaneBG.jpg')]">
    <div className="flex flex-col gap-6 w-96 mx-auto mt-20 p-8 border-2 border-slate-300 rounded-lg shadow-lg bg-white">
      {/* Toggle group with proper spacing */}
      <div className="relative flex flex-col items-center mb-6 p-4 bg-slate-100 rounded-lg">
        <div className="flex gap-6 justify-center w-full relative">
          <Toggle label="Login" index={0} active={toggle} onClick={setToggle} />
          <Toggle label="Sign Up" index={1} active={toggle} onClick={setToggle} />
        </div>
        <div
          className="absolute top-0 left-1/4 h-full bg-blue-400 rounded-lg w-1/4 transition-transform duration-400 ease-in-out"
          style={{
            transform: `translateX(${toggle === 0 ? '0%' : '83px'})`,
            backgroundColor: toggle === 0 ? '#3b82f6' : '#28b0a2',
            transition: 'transform 400ms ease-in-out, background-color 400ms ease-in-out'
          }}
          aria-hidden="true"
        />
      </div>

      {/* Form fields */}
      <div className="flex flex-col gap-4">
        {toggle === 0 ? (
          <LoginInputField
            values={{ login: username, password }}
            onChange={handleChange}
          />
        ) : (
          <SignupInputField
            values={{
              email,
              firstName,
              lastName,
              password,
              confirmPassword
            }}
            onChange={handleChange}
          />
        )}
        <div className="mt-4 flex justify-center">
          <SubmitBtn
            label={toggle === 0 ? "Login" : "Sign Up"}
            onClick={() => {
              if (toggle === 0) {
                console.log("Logging in with", username, password)
                // Attempt to retrieve saved user to populate name
                const existingUser = savedUsers[username] || null;
                if (existingUser) {
                  authLogin({ role: existingUser.role || 'user', firstName: existingUser.firstName, lastName: existingUser.lastName });
                } else {
                  authLogin({ role: 'user', firstName: username });
                }
                // Redirect to home after successful login
                router.replace('/')
              } else {
                // Check for existing email, then save new user to localStorage
                if (savedUsers[email]) {
                  alert("Email already exists, please sign up with a different email.")
                  return
                }
                if (password !== confirmPassword) {
                  alert("Passwords do not match, please try again.")
                  return
                }
                // Store new user keyed by email
                savedUsers[email] = {
                  email,
                  firstName,
                  lastName,
                  password,
                  role: 'user'
                }
                localStorage.setItem('users', JSON.stringify(savedUsers))
                console.log("Signing up with", email, firstName, lastName, password)
                // Set auth context with provided names
                authLogin({ role: 'user', firstName, lastName })
                // Navigate back to previous page after successful signup
                router.back()
              }
            }}
          />
        </div>
      </div>
    </div>
  </div>
  )
}

export default Login