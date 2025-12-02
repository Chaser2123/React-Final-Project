"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

import LoginInputField from './LoginInputField.jsx';
import SignupInputField from './SignupInputField.jsx';
import Toggle from './Toggle.jsx';
import SubmitBtn from './SubmitBtn.jsx';
import LoadingScreen from '@/components/LoadingScreen.jsx';

import '@/app/globals.css';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function LoginPage() {
  const router = useRouter();
  const { login: authLogin, signup, isLoading: authIsLoading } = useAuth() || {}; // handle null context gracefully
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toggle, setToggle] = useState(0);
  const [form, setForm] = useState({
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  });

  const firebaseErrorMap = {
    'auth/email-already-in-use': 'Email already registered. Try logging in.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/operation-not-allowed': 'Email/password sign-in is disabled for this project.',
    'auth/weak-password': 'Password is too weak (Firebase minimum is 6 characters).',
    'auth/missing-email': 'Please provide an email address.',
    'auth/configuration-not-found': 'Authentication is not configured for this project. Enable Email/Password in Firebase Authentication and ensure the Identity Toolkit API is enabled.'
  };

  const { password, email, firstName, lastName, confirmPassword } = form;

  // One-time diagnostic: verify Firebase Auth config loaded in client
  useEffect(() => {
    try {
      // eslint-disable-next-line no-console
      console.log('Auth app options:', auth.app.options);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('Auth app options not available:', e);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAuth = () => {
    if (toggle === 0) {
      if (!email || !password) {
        alert('Please enter email and password.');
        return;
      }
      if (authLogin) {
        setIsSubmitting(true);
        const sanitizedEmail = email.trim();
        authLogin({ email: sanitizedEmail, password })
          .then(() => router.replace('/'))
          .catch((err) => {
            console.error('Login error raw:', err);
            const friendly = firebaseErrorMap[err.code] || err.message || 'Failed to log in.';
            alert(friendly);
            setIsSubmitting(false);
          });
      } else {
        alert('Auth not ready, please retry.');
      }
    } else {
      if (!password) {
        alert('Please enter a password.');
        return;
      }
      const passReq = [];
      if (password.length < 8) passReq.push('be at least 8 characters long');
      if (!/[A-Z]/.test(password)) passReq.push('include at least one uppercase letter');
      if (!/[a-z]/.test(password)) passReq.push('include at least one lowercase letter');
      if (!/\d/.test(password)) passReq.push('include at least one number');
      if (passReq.length > 0) {
        const message = passReq.length === 1
          ? passReq[0]
          : `${passReq.slice(0, -1).join(', ')}, and ${passReq[passReq.length - 1]}`;
        alert(`Password must ${message}.`);
        return;
      }
      if (!email || !firstName || !lastName || !confirmPassword) {
        alert('Please fill in all fields to sign up.');
        return;
      }
      if (password !== confirmPassword) {
        alert('Passwords do not match, please try again.');
        return;
      }
      setIsSubmitting(true);
      const sanitizedEmail = email.trim();
      // Use useAuth.js signup function to create user and Firestore profile
      signup({ email: sanitizedEmail, password, firstName, lastName })
        .then(() => router.replace('/'))
        .catch((err) => {
          console.error('Signup error raw:', err);
          const friendly = firebaseErrorMap[err.code] || err.message || 'Failed to sign up.';
          alert(friendly);
          setIsSubmitting(false);
        });
    }
  };

  const isLoading = authIsLoading || isSubmitting;

  return (
    <div className="w-full min-h-screen flex flex-col justify-start items-center fixed bg-image bg-cover bg-center bg-[url('@/images/airplaneBG.jpg')]">
      {isLoading && <LoadingScreen />}
      <div className={`flex flex-col gap-6 w-96 mx-auto mt-20 p-8 border-2 border-slate-300 rounded-lg shadow-lg bg-white ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="relative flex flex-col items-center mb-6 p-4 bg-slate-100 rounded-lg">
          <div className="flex gap-6 justify-center w-full relative">
            <Toggle label="Login" index={0} active={toggle} onClick={setToggle} />
            <Toggle label="Sign Up" index={1} active={toggle} onClick={setToggle} />
          </div>
          <div
            className="absolute top-0 left-1/4 h-2 bg-blue-400 rounded-lg w-1/4 transition-transform duration-400 ease-in-out"
            style={{
              transform: `translateX(${toggle === 0 ? '-1rem' : '5.2rem'})`,
              backgroundColor: toggle === 0 ? '#3b82f6' : '#28b0a2',
              transition: 'transform 400ms ease-in-out, background-color 400ms ease-in-out'
            }}
            aria-hidden="true"
          />
        </div>
        <div className="flex flex-col gap-4">
          {toggle === 0 ? (
            <LoginInputField values={{ email, password }} onChange={handleChange} />
          ) : (
            <SignupInputField values={{ email, firstName, lastName, password, confirmPassword }} onChange={handleChange} />
          )}
          <div className="mt-4 flex justify-center">
            <SubmitBtn label={toggle === 0 ? 'Login' : 'Sign Up'} onClick={handleAuth} disabled={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
