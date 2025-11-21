
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Marketplace } from './pages/Marketplace';
import { Publish } from './pages/Publish';
import { DaoVoting } from './pages/DaoVoting';
import { Profile } from './pages/Profile';
import { BlockchainService } from './services/mockBlockchain';
import { UserProfile } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<(UserProfile & {name: string}) | null>(null);

  useEffect(() => {
      loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const address = await BlockchainService.connectWallet();
      const profile = await BlockchainService.getUserProfile();
      if (profile) {
          setCurrentUser({ ...profile, name: "Wallet User" });
      }
    } catch (e) {
      // Not connected
    }
  };

  const handleConnect = async () => {
    try {
      const address = await BlockchainService.connectWallet();
      const profile = await BlockchainService.getUserProfile();
      setCurrentUser({ ...profile, name: "Wallet User" });
    } catch (e) {
      console.error("Connection failed", e);
    }
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <Navbar 
          isConnected={!!currentUser} 
          currentUser={currentUser}
          onConnect={handleConnect}
        />
        <main className="pb-20 md:pb-0">
          <Routes key={currentUser?.address || 'default'}>
            <Route path="/" element={<Home />} />
            <Route path="/market" element={<Marketplace />} />
            <Route path="/publish" element={<Publish />} />
            <Route path="/dao" element={<DaoVoting />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}
