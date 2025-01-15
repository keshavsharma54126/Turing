"use client"

import React, { useState, FormEvent, ChangeEvent } from 'react';

import Image from 'next/image';

interface FormData {
  username: string;
  email: string;
  profileImage: string;
  testCount: number;
  SessionQuerryCount: number;
}

const Settings = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    profileImage:'',
    testCount:  2,
    SessionQuerryCount:  10
  });

 

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      {/* Profile Section */}
      <div className="brutalist-card bg-white p-6 mb-8 border-2 border-[#1B4D3E]">
        <h2 className="text-xl font-bold mb-6 font-mono">Profile</h2>
        <form >
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 mr-6 rounded-full overflow-hidden border-2 border-[#1B4D3E]">
              <Image
                src={formData.profileImage}
                alt="Profile"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-2 font-mono text-sm">Profile Image URL</label>
              <input
                type="text"
                value={formData.profileImage}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, profileImage: e.target.value})}
                className="w-full px-4 py-2 border-2 border-[#1B4D3E] focus:outline-none focus:border-[#3E8E7E] font-mono dashboard-card"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-mono text-sm">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, username: e.target.value})}
                className="w-full px-4 py-2 border-2 border-[#1B4D3E] focus:outline-none focus:border-[#3E8E7E] font-mono dashboard-card"
              />
            </div>
            <div>
              <label className="block mb-2 font-mono text-sm">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, email: e.target.value})}
                disabled
                className="w-full px-4 py-2 border-2 border-[#1B4D3E] bg-gray-100 font-mono dashboard-card"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="dashboard-button bg-[#31a783] hover:bg-[#42bba3] text-white px-6 py-2 font-mono"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>

      {/* Security Section */}
      <div className="brutalist-card bg-white p-6 mb-8 border-2 border-[#1B4D3E]">
        <h2 className="text-xl font-bold mb-6 font-mono">Security</h2>
        <form >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-mono text-sm">Current Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 border-2 border-[#1B4D3E] focus:outline-none focus:border-[#3E8E7E] font-mono dashboard-card"
              />
            </div>
            <div>
              <label className="block mb-2 font-mono text-sm">New Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 border-2 border-[#1B4D3E] focus:outline-none focus:border-[#3E8E7E] font-mono dashboard-card"
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="dashboard-button bg-[#31a783] hover:bg-[#42bba3] text-white px-6 py-2 font-mono"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>

      {/* Preferences Section */}
      <div className="brutalist-card bg-white p-6 mb-8 border-2 border-[#1B4D3E]">
        <h2 className="text-xl font-bold mb-6 font-mono">Preferences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-mono text-sm">Default Test Count</label>
            <input
              type="number"
              value={formData.testCount}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, testCount: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border-2 border-[#1B4D3E] focus:outline-none focus:border-[#3E8E7E] font-mono dashboard-card"
            />
          </div>
          <div>
            <label className="block mb-2 font-mono text-sm">Session Query Count</label>
            <input
              type="number"
              value={formData.SessionQuerryCount}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, SessionQuerryCount: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border-2 border-[#1B4D3E] focus:outline-none focus:border-[#3E8E7E] font-mono dashboard-card"
            />
          </div>
        </div>
        <div className="mt-6">
          <button
            
            className="dashboard-button bg-[#31a783] hover:bg-[#42bba3] text-white px-6 py-2 font-mono"
          >
            Save Preferences
          </button>
        </div>
      </div>

      {/* Account Actions */}
      <div className="brutalist-card bg-white p-6 border-2 border-red-300">
        <h2 className="text-xl font-bold mb-6 font-mono text-red-600">Danger Zone</h2>
        <div className="space-y-4">
          <button
            className="dashboard-button bg-red-500 hover:bg-red-600 text-white px-6 py-2 font-mono"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
