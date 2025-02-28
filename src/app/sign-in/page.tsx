'use client'
import React, { useState, useEffect } from 'react';
import { useSignInWithGoogle, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebaseConfig';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const [signInWithEmailAndPassword, userEmail, loadingEmail, errorEmail] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailSignIn, setIsEmailSignIn] = useState(false); // Устанавливаем флаг, что пользователь входит через email
  
  useEffect(() => {
    if (user || userEmail) {
      router.push('/profile'); // Перенаправляем на страницу профиля, если пользователь успешно вошел
    }
  }, [user, userEmail, router]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signInWithEmailAndPassword(email, password);
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  const handleSignUpRedirect = () => {
    router.push('/sign-up'); // Перенаправление на страницу регистрации
  };

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
      <h1 className="font-semibold text-5xl mt-20 mb-12">Sign In</h1>
      
      {/* Кнопка входа через Google */}
      <button 
        onClick={handleGoogleSignIn} 
        className="bg-white hover:bg-gray-300 text-gray font-bold py-3 px-12 rounded-full border border-black p-3 flex items-center mb-4">
        <span>Continue with Google</span>
      </button>

      {/* Форма входа через email и пароль */}
      <button 
        onClick={() => setIsEmailSignIn(true)} 
        className="bg-white hover:bg-gray-300 text-gray font-bold py-3 px-12 rounded-full border border-black p-3 mb-4">
        Sign in with Email
      </button>
      
      {isEmailSignIn && (
        <form onSubmit={handleEmailSignIn} className="flex flex-col">
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
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white py-3 px-12 rounded-full">
            Sign In
          </button>
        </form>
      )}

      {/* Кнопка для перенаправления на страницу регистрации */}
      <button 
        onClick={handleSignUpRedirect} 
        className="bg-transparent text-blue-500 font-bold py-3 px-12 mt-4 border border-blue-500 rounded-full">
        No account? Sign up
      </button>
    </div>
  );
}
