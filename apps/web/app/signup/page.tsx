import Link from 'next/link';
import Image from 'next/image';

export default function SignUp() {
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
            <form className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-bold mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
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

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-bold mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full p-3 border-2 border-gray-800 focus:outline-none focus:border-[#B8D8E3] font-mono"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-4 w-4 border-2 border-gray-800"
                />
                <label htmlFor="terms" className="ml-2 text-sm">
                  I agree to the{' '}
                  <Link href="/terms" className="text-[#B8D8E3] hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-[#B8D8E3] hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                className="brutalist-button w-full py-3 bg-[#FF6B6B] hover:bg-[#FF8C66] text-white font-bold"
              >
                Create Account
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                
              </div>
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
