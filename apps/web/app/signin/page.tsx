import Link from 'next/link';
import { FaGoogle, FaGithub } from 'react-icons/fa';

export default function SignIn() {
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
            <form className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-bold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
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
                  className="w-full p-3 border-2 border-gray-800 focus:outline-none focus:border-[#B8D8E3] font-mono"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 border-2 border-gray-800"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm">
                    Remember me
                  </label>
                </div>
                <Link href="/forgot-password" className="text-sm text-[#FF6B6B] hover:text-[#FF8C66]">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="brutalist-button w-full py-3 bg-[#FF6B6B] hover:bg-[#FF8C66] text-white font-bold"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button className="brutalist-button w-full py-3 bg-[#FF6B6B] hover:bg-[#FF8C66] text-white font-bold flex items-center justify-center">
                  <FaGoogle className="mr-2 text-xl" />
                  Google
                </button>
                <button className="brutalist-button w-full py-3 bg-[#FF6B6B] hover:bg-[#FF8C66] text-white font-bold flex items-center justify-center">
                  <FaGithub className="mr-2 text-xl" />
                  GitHub
                </button>
              </div>
            </div>
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
