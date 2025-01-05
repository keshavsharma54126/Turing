"use client"
import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, TestTube, GraduationCap, Settings, Menu, X, LogOut } from 'lucide-react';
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



  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-40 dashboard-button p-2 h-10 w-10 flex items-center justify-center "
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 w-64 h-screen bg-[#1B4D3E] text-white fixed left-0 top-0 p-4 z-40 inset-0 dashboard-card`}
      >
        <div className="mb-8 pt-4">
          <h1 className="text-2xl font-bold text-[#2A6B5D] text-center">TURING AI</h1>
        </div>
        <nav>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 p-3 rounded hover:bg-[#3E8E7E] transition-colors dashboard-button mb-2 bg-[#1B4D3E] text-white"
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              <span className="font-mono">{item.label}</span>
            </Link>
          ))}
          
        </nav>
        <button
              className="flex items-center gap-3 p-3 rounded transition-colors dashboard-button mb-2 !bg-[#f12e2e] hover:!bg-[#be1a1a] text-white"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              <span className="font-mono">Logout</span>
            </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

const Navbar = ({user}:{user:User | null}) => {
  return (
    <div className="h-20 bg-[#E8EEF2] border-b-2 border-[#1B4D3E] fixed top-0 right-0 left-0 lg:left-64 z-20 px-6 brutalist-card">
      <div className="h-full flex items-center justify-between">
        {/* Search and Profile Section */}
        <div className="flex-1 flex items-center justify-end gap-6">
          {/* Search Bar */}
          <div className="relative max-w-md w-full">
            <input
              type="search"
              placeholder="Search..."
              className="w-full px-4 py-2 rounded-none border-2 border-[#1B4D3E] focus:outline-none focus:border-[#3E8E7E] font-mono dashboard-card transition-colors"
            />
          </div>
          
          {/* Profile Section */}
          <div className="flex items-center gap-3 p-2 border-2 border-[#1B4D3E] dashboard-card">
            <div className="font-mono text-sm">{user?.username || 'Guest'}</div>
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-[#1B4D3E]">
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
  const [user,setUser] = useState<User | null>(null)
  const authToken = localStorage.getItem('authToken');
  const router = useRouter();
  if(!authToken){
    router.push('/signin')
  }

  useEffect(()=>{
    if(!localStorage.getItem('authToken')){
      router.push('/signin')
    }
    const fetchUser = async()=>{
      try{
        const token = localStorage.getItem('authToken')
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user`,{
          headers:{
            Authorization: `Bearer ${token}`
          }
        })
        const user = response.data.user
        setUser(user)
      }catch(e){
        console.log(e)
      }
    }
    fetchUser()
  },[])

  return (
    <div className="flex dashboard-layout max-h-screen dashboard-grid">
     <div className='flex flex-col'>
     <Sidebar />
     <Navbar user={user}/>
     </div>
      <main className="flex-1 justify-center items-center p-6 pt-24 ">
        <div className="fixed lg:relative first-letter:dashboard-card p-6 dashboard-grid left-0">
          {children}
        </div>
      </main>
    </div>
  );
}
