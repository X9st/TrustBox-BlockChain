
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wallet, Box, Vote, PlusCircle, User, LogOut } from 'lucide-react';

interface Props {
  isConnected: boolean;
  currentUser: any | null;
  onConnect: () => void;
}

export const Navbar: React.FC<Props> = ({ isConnected, currentUser, onConnect }) => {
  const location = useLocation();

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${isActive ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'}`}
      >
        <Icon className="w-4 h-4" />
        <span className="hidden md:inline font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-brand-600 p-1.5 rounded-lg">
               <Box className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">TrustBox</span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <NavItem to="/market" icon={Box} label="盲盒市场" />
            <NavItem to="/publish" icon={PlusCircle} label="发布盲盒" />
            <NavItem to="/dao" icon={Vote} label="社区治理" />
          </div>

          {/* Wallet Action */}
          <div className="flex items-center space-x-3">
             {isConnected && currentUser ? (
               <div className="flex items-center space-x-3">
                  <Link to="/profile" className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full transition-colors border border-slate-200 group">
                    <div className="w-5 h-5 bg-brand-500 rounded-full text-[10px] text-white flex items-center justify-center">
                        {currentUser.address.substring(2,3)}
                    </div>
                    <div className="flex flex-col items-start text-xs">
                        <span className="font-bold text-slate-800 group-hover:text-brand-700">我的账户</span>
                        <span className="font-mono text-slate-500">{currentUser.address.substring(0,6)}...</span>
                    </div>
                  </Link>
               </div>
             ) : (
               <button 
                 onClick={onConnect}
                 className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-full shadow-lg shadow-brand-200 transition-all active:scale-95"
               >
                 <Wallet className="w-4 h-4" />
                 <span className="text-sm font-semibold">连接钱包</span>
               </button>
             )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-50">
        <Link to="/market" className="flex flex-col items-center text-slate-600">
          <Box className="w-6 h-6" />
          <span className="text-[10px] mt-1">市场</span>
        </Link>
        <Link to="/publish" className="flex flex-col items-center text-brand-600">
          <PlusCircle className="w-8 h-8 -mt-4 bg-white rounded-full p-1 shadow-lg border border-slate-100" />
          <span className="text-[10px] mt-1">发布</span>
        </Link>
        <Link to="/dao" className="flex flex-col items-center text-slate-600">
          <Vote className="w-6 h-6" />
          <span className="text-[10px] mt-1">DAO</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center text-slate-600">
          <User className="w-6 h-6" />
          <span className="text-[10px] mt-1">我的</span>
        </Link>
      </div>
    </nav>
  );
};
