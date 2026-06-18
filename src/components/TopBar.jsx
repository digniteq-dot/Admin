import { Menu, Bell, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const TopBar = ({ setIsSidebarOpen }) => {
    const location = useLocation();
    
    const getTitle = () => {
        if (location.pathname === '/') return 'Dashboard';
        const path = location.pathname.substring(1);
        return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <header className="h-16 bg-[#030610]/60 backdrop-blur-xl border-b border-white/[0.04] flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="md:hidden w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.08] transition-all"
                >
                    <Menu size={18} />
                </button>
                <div>
                    <h1 className="font-sans font-bold text-base md:text-lg text-white tracking-wide leading-tight">
                        {getTitle()}
                    </h1>
                    <p className="text-[11px] text-white/25 hidden sm:block">{getGreeting()}, Admin</p>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                {/* Notification Bell */}
                <button className="relative w-9 h-9 rounded-xl bg-white/[0.03] flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all">
                    <Bell size={16} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
                </button>
                
                {/* Avatar */}
                <div className="flex items-center gap-2.5 ml-1 pl-3 border-l border-white/[0.06]">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/[0.08]">
                        <span className="text-blue-400 font-bold text-xs">A</span>
                    </div>
                    <span className="text-sm font-medium text-white/60 hidden sm:block">Admin</span>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
