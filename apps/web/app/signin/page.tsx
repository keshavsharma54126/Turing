'use client';

import Link from 'next/link';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const[loading,setLoading] = useState(false)
  const router = useRouter();

  useEffect(() => {
    setLoading(true)
    if (typeof window !== 'undefined' && localStorage.getItem('authToken')) {
      router.push('/home');
    }
    setLoading(false)
  }, []);

  const handleSignIn = async () => {
    try{
      
      if(!email || !password){
        setError('Please fill in all fields');
        return;
      }
      setIsLoading(true);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/signin`, { email, password });
      console.log(response)
      if(response.status === 200){
        localStorage.setItem('authToken', response.data.token);
        setIsLoading(false);
        router.push('/home');
      }else{
        setError(response.data.message);
      }
      setIsLoading(false);
    }catch(error){
      console.error('Sign in error:', error);
      setError('An error occurred while signing in. Please try again.');
    }
  }

  if(loading){
    return <div className='flex justify-center items-center h-screen'>
      <Loader2 size={24} className='animate-spin' />
    </div>
  }

  else{
    return (
      <div className="min-h-screen gradient-bg relative">
        <div className="absolute inset-0 pattern-grid opacity-30"></div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="max-w-md w-full mx-4">
            <div className="text-center mb-8">
              <Link href="/" className="text-2xl font-bold">
                TURING AI
              </Link>
              <h2 className="text-3xl font-bold mt-6 mb-2">Welcome Back</h2>
              <p className="text-gray-600 font-mono">Sign in to continue learning</p>
            </div>
  
            <div className="brutalist-card bg-white p-8">
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
  
  
                <button
                  onClick={handleSignIn}
                  className="brutalist-button w-full py-3 mt-4 bg-[#FF6B6B] hover:bg-[#FF8C66] text-white font-bold"
                >
                  Sign In
                </button>
  
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>
  
                <div className="mt-6 ">
                  <GoogleLoginButton clientId="883449637885-trb16ii0jj4qu7bj44mf6c6nqdkomtuh.apps.googleusercontent.com"/>
                </div>
              </div>
              {error && <div className="text-red-500 text-center mt-4">{error}</div>}
              {isLoading && (
                <div className="text-center mt-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#FF6B6B] border-t-transparent"></div>
                </div>
              )}
            </div>
  
            <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup" className="text-[#FF6B6B] hover:text-[#FF8C66] font-bold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  
}



const GoogleLoginButton = ({clientId}:{clientId:string}) => {
  const router = useRouter()
  if(!clientId){
    console.log("Google Client ID not found")
  }
  return (
  <GoogleOAuthProvider  clientId={clientId}>
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        if (!credentialResponse.credential) {
          console.error('No credential received from Google');
          return;
        }
        const decoded = jwtDecode(credentialResponse.credential);
        console.log("decoded",decoded)
        try{
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google-signin`,{
            decoded
          })
          const token = response.data.token
          localStorage.setItem("authToken",token)
          router.push("/home")
        }catch(e){
          console.log(e)
        }
        
        
      }}
      onError={() => console.log('Login Failed')}
    />
  </GoogleOAuthProvider>
);
}

