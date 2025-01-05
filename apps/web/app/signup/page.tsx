'use client';

import Link from 'next/link';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleSignUp = async () => {
    setIsLoading(true);
    try{
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/signup`, { username, email, password, confirmPassword });
      console.log('Sign up response:', response);
      if(response.status === 200){
        setIsLoading(false);
        router.push('/signin');
      }else{
        setError(response.data.message);
      }
      setIsLoading(false);
    }catch(error){
      console.error('Sign up error:', error);
      setError('An error occurred while signing up. Please try again.');
    }
  };



  return (
    <div className="min-h-screen gradient-bg relative">
      <div className="absolute inset-0 pattern-grid opacity-30"></div>
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <Link href="/" className="text-2xl font-bold">
              TURING AI
            </Link>
            <h2 className="text-3xl font-bold mt-6 mb-2">Create Account</h2>
            <p className="text-gray-600 font-mono">Join our learning community</p>
          </div>

          <div className="brutalist-card bg-white p-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-bold mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 border-2 border-gray-800 focus:outline-none focus:border-[#B8D8E3] font-mono"
                  placeholder="johndoe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border-2 border-gray-800 focus:outline-none focus:border-[#B8D8E3] font-mono"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border-2 border-gray-800 focus:outline-none focus:border-[#B8D8E3] font-mono"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-bold mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border-2 border-gray-800 focus:outline-none focus:border-[#B8D8E3] font-mono"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                onClick={handleSignUp}
                className="brutalist-button w-full py-3 bg-[#FF6B6B] hover:bg-[#FF8C66] text-white font-bold"
              >
                Create Account
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                 
                </div>
                {error && <p className="text-red-600 font-mono text-center text-xl">{error}</p>}
              </div>
              {isLoading && (
                <div className="text-center mt-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#FF6B6B] border-t-transparent"></div>
                </div>
              )}
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/signin" className="text-[#FF6B6B] hover:text-[#FF8C66] font-bold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
