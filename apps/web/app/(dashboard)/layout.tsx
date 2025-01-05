"use client"
import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { Home, TestTube, GraduationCap, Settings, Menu, X } from 'lucide-react';
import './dashboard.css';

interface DashboardLayoutProps {
  children: ReactNode;
}

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuItems = [
    { icon: <Home size={20} />, label: 'Home', href: '/home' },
    { icon: <TestTube size={20} />, label: 'Testing Agent', href: '/testing-agent' },
    { icon: <GraduationCap size={20} />, label: 'Tutor Agent', href: '/tutor-agent' },
    { icon: <Settings size={20} />, label: 'Settings', href: '/settings' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-30 dashboard-button p-2 h-10 w-10 flex items-center justify-center rounded-full"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 w-64 h-screen bg-[#1B4D3E] text-white fixed left-0 top-0 p-4 z-20 inset-0 dashboard-card`}
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

const Navbar = () => {
  return (
    <div className="h-20 bg-[#E8EEF2] border-b-2 border-[#1B4D3E] fixed top-0 right-0 left-0 lg:left-64 z-20 px-6 brutalist-card">
      <div className="h-full flex items-center justify-between">
        <div className="flex items-center gap-4 ml-12 lg:ml-0">
          <input
            type="search"
            placeholder="Search..."
            className="px-4 py-2 rounded-none border-2 focus:outline-none font-mono dashboard-card"
          />
        </div>
      </div>
    </div>
  );
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex dashboard-layout min-h-screen dashboard-grid">
     <div className='flex flex-col'>
     <Sidebar />
     <Navbar />
     </div>
      <main className="flex-1 justify-center items-center p-6 pt-24 ">
        <div className="fixed lg:relative first-letter:dashboard-card p-6 dashboard-grid left-0">
          {children}
        </div>
      </main>
    </div>
  );
}
