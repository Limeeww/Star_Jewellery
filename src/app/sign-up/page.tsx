'use client'
import React, { useState, useEffect } from 'react';
import {useCreateUserWithEmailAndPassword, useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebaseConfig';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [user, loading, error] = useAuthState(auth);
  const [createUserWithEmailAndPassword, userEmail, loadingEmail, errorEmail] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEmailSignUp, setIsEmailSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 

  useEffect(() => {
    if (user || userEmail) {
      router.push('/profile');
    }
  }, [user, userEmail, router]);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    await createUserWithEmailAndPassword(email, password);
  };

  // const handleGoogleSignIn = async () => {
  //   await signInWithGoogle();
  // };

  if (loading || loadingEmail) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-full">
        <p className="font-semibold text-5xl mt-20 mb-12">Loading...</p>
      </div>
    );
  }

  if (error || errorEmail) {
    return (
      <div>
        <p>Error: {error?.message || errorEmail?.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <h1 className="font-semibold text-5xl mt-20 mb-12">Sign up</h1>

      {/* Форма регистрации через email и пароль */}
      <button 
        onClick={() => setIsEmailSignUp(true)} 
        className="bg-white hover:bg-gray-300 text-gray font-bold py-3 px-12 rounded-full border border-black p-3 mb-4">
        Sign up with Email
      </button>
      
      {isEmailSignUp && (
        <form onSubmit={handleEmailSignUp} className="flex flex-col">
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2"
              required
            />
          </div>
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"} // Переключаем тип поля
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)} // Переключаем видимость пароля
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className="mb-4 relative">
            <input
              type={showConfirmPassword ? "text" : "password"} // Переключаем тип поля для подтверждения пароля
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Переключаем видимость подтверждения пароля
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <button type="submit" className="bg-blue-500 text-white py-3 px-12 rounded-full">

          Register
          </button>
        </form>
      )}
    </div>
  );
}
