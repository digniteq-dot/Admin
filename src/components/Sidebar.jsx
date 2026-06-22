import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Type, List, BarChart3, Info, LayoutList, Image as ImageIcon, CreditCard, MessageSquare, LogOut, ChevronRight, FileText } from 'lucide-react';
import api from '../api';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation();
    const [settings, setSettings] = useState({
        companyName: 'Digniteq',
        tagline: 'Admin',
        logoUrl: ''
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings');
                if (res.data) {
                    setSettings({
                        companyName: res.data.companyName || 'Digniteq',
                        tagline: res.data.tagline || 'Admin',
                        logoUrl: res.data.logoUrl || ''
                    });
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchSettings();
    }, []);

    const navItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
        { name: 'Hero Section', path: '/hero', icon: <Type size={18} /> },
        { name: 'Services', path: '/services', icon: <List size={18} /> },
        { name: 'Stats', path: '/stats', icon: <BarChart3 size={18} /> },
        { name: 'About Us', path: '/about', icon: <Info size={18} /> },
        { name: 'Process Steps', path: '/process', icon: <LayoutList size={18} /> },
        { name: 'Portfolio', path: '/portfolio', icon: <ImageIcon size={18} /> },
        { name: 'Pricing Plans', path: '/pricing', icon: <CreditCard size={18} /> },
        { name: 'Contact Submissions', path: '/contacts', icon: <MessageSquare size={18} /> },
        { name: 'Service Requests', path: '/proposals', icon: <FileText size={18} /> },
    ];

    const handleLogout = () => {
        localStorage.removeItem('digniteq_admin_token');
        window.location.href = '/login';
    };

    return (
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#060212]/95 backdrop-blur-2xl border-r border-white/[0.06] transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col`}>
            {/* Logo Area */}
            <div className="p-5 flex items-center justify-between border-b border-white/[0.04]">
                <div className="flex items-center gap-2.5">
                    {settings.logoUrl ? (
                        <img src={settings.logoUrl} alt="Logo" className="w-8 h-8 object-contain rounded bg-white/10" />
                    ) : (
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/20">
                            {settings.companyName.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="flex flex-col">
                        <span className="font-sans font-bold tracking-wider text-white text-sm uppercase leading-none">
                            {settings.companyName}
                        </span>
                        <span className="text-blue-400 font-bold text-[10px] mt-0.5 max-w-[120px] truncate" title={settings.tagline}>
                            {settings.tagline}
                        </span>
                    </div>
                </div>
                <button 
                    onClick={() => setIsOpen(false)} 
                    className="md:hidden w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                >
                    ✕
                </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-3 px-3">
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.15em] px-3 mb-2">Navigation</p>
                <nav className="space-y-0.5">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => window.innerWidth < 768 && setIsOpen(false)}
                                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative ${
                                    isActive 
                                    ? 'bg-blue-500/10 text-blue-400' 
                                    : 'text-white/45 hover:bg-white/[0.04] hover:text-white/80'
                                }`}
                            >
                                {/* Active indicator line */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-500 rounded-r-full" />
                                )}
                                <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                                    {item.icon}
                                </span>
                                <span className="font-medium text-[13px] flex-1">{item.name}</span>
                                {isActive && <ChevronRight size={14} className="text-blue-400/50" />}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/[0.04]">
                <button 
                    onClick={handleLogout}
                    className="group flex items-center gap-3 w-full px-3 py-2.5 text-white/35 hover:text-red-400 hover:bg-red-500/[0.06] rounded-xl transition-all duration-200"
                >
                    <LogOut size={18} className="group-hover:rotate-[-12deg] transition-transform" />
                    <span className="font-medium text-[13px]">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
