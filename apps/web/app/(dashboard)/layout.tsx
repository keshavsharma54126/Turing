"use client"

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, TestTube, GraduationCap, Settings, Menu, X, LogOut, Loader2, Search } from 'lucide-react';
import './dashboard.css';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface User {
  id: string;
  username: string;
  email: string;
  profileImage: string;
}

const Sidebar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuItems = [
    { icon: <Home size={20} />, label: 'Home', href: '/home' },
    { icon: <TestTube size={20} />, label: 'Testing Agent', href: '/testing-agent' },
    { icon: <GraduationCap size={20} />, label: 'Tutor Agent', href: '/tutor-agent' },
    { icon: <Settings size={20} />, label: 'Settings', href: '/settings' },
  ];
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (!localStorage.getItem('authToken')) {
      router.push('/signin');
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loader2 size={24} className='animate-spin' />
      </div>
    );
  }

  return (
    <>
      {/* Mobile Menu Button - Moved to top-right for better reachability */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-2 right-4 z-50 dashboard-button p-2 h-10 w-10 flex items-center justify-center rounded-full"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar - Added backdrop blur and improved animation */}
      <div
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-all duration-300 ease-in-out w-full lg:w-64 h-screen fixed left-0 top-0 z-40 
        ${isOpen ? 'bg-[#eaecec]/95 backdrop-blur-sm' : 'bg-[#eaecec]'} lg:bg-[#eaecec]`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="mb-8 pt-4">
            <h1 className="text-2xl font-bold text-[#2A6B5D] text-center">TURING AI</h1>
          </div>
          
          <nav className="flex-grow">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 p-3 rounded hover:bg-[#42bba3] transition-all duration-200 dashboard-button mb-2 bg-[#31a783] text-white"
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span className="font-mono">{item.label}</span>
              </Link>
            ))}
             <button
            className="flex items-center gap-3 p-3 rounded transition-all duration-200 dashboard-button mb-2 !bg-[#f12e2e] hover:!bg-[#be1a1a] text-white"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span className="font-mono">Logout</span>
          </button>
          </nav>
          
         
        </div>
      </div>

      {/* Improved overlay with blur effect */}
      {isOpen && (
        <div
          className="fixed inset-0 lg:hidden z-30 bg-black/20 backdrop-blur-sm transition-all duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

const Navbar = ({ user }: { user: User | null }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="h-20 bg-[#E8EEF2] border-b-2 border-[#1B4D3E] fixed top-0 right-0 left-0 lg:left-64 z-20 brutalist-card">
      <div className="h-full flex items-center justify-between px-4 lg:px-6">
        {/* Mobile Search Toggle */}
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="lg:hidden p-2 left-10 dashboard-button"
        >
          <Search size={20} />
        </button>

        <div className="flex-1 flex items-center justify-end gap-4">
          {/* Search Bar - Responsive */}
          <div className={`
            absolute lg:relative top-full left-0 right-0 p-4 lg:p-0 bg-[#E8EEF2] 
            ${isSearchOpen ? 'flex' : 'hidden lg:flex'}
            transition-all duration-300 lg:max-w-md w-full
          `}>
            <input
              type="search"
              placeholder="Search..."
              className="w-full px-4 py-2 rounded-none border-2 border-[#1B4D3E] focus:outline-none focus:border-[#3E8E7E] font-mono dashboard-card transition-colors"
            />
          </div>
          
          {/* Profile Section - Responsive */}
          <div className="flex items-center gap-2 p-2 border-2 border-[#1B4D3E] dashboard-card">
            <div className="font-mono text-sm hidden sm:block">{user?.username || 'Guest'}</div>
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden border-2 border-[#1B4D3E]">
              <Image 
                src={user?.profileImage || '/default-avatar.png'} 
                alt="profile" 
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('authToken')!;
    }
    if (!token) {
      router.push('/signin');
    }
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const user = response.data.user;
        setUser(user);
      } catch (e) {
        console.log(e);
      }
    };
    fetchUser();
  }, [router]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 dashboard-layout dashboard-grid">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-64">
        <Navbar user={user} />
        <main className="flex-1 p-2 lg:p-8 pt-16 lg:pt-28 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}