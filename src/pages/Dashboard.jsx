import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Type, List, MessageSquare, CreditCard, LayoutList, BarChart3, Image as ImageIcon, Info, ArrowUpRight, Activity } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        services: 0,
        portfolio: 0,
        contacts: 0,
        pricing: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [servicesRes, portfolioRes, contactsRes, pricingRes] = await Promise.all([
                    api.get('/services'),
                    api.get('/portfolio'),
                    api.get('/contact'),
                    api.get('/pricing')
                ]);

                setStats({
                    services: servicesRes.data.length,
                    portfolio: portfolioRes.data.length,
                    contacts: contactsRes.data.length,
                    pricing: pricingRes.data.length
                });
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const cards = [
        { title: 'Hero Section', desc: 'Edit landing area', path: '/hero', icon: <Type size={20} />, gradient: 'from-blue-500/15 to-cyan-500/15', iconColor: 'text-blue-400', borderColor: 'hover:border-blue-500/20' },
        { title: 'Services', desc: 'Manage offerings', path: '/services', count: stats.services, icon: <List size={20} />, gradient: 'from-purple-500/15 to-pink-500/15', iconColor: 'text-purple-400', borderColor: 'hover:border-purple-500/20' },
        { title: 'Portfolio', desc: 'Showcase projects', path: '/portfolio', count: stats.portfolio, icon: <ImageIcon size={20} />, gradient: 'from-pink-500/15 to-rose-500/15', iconColor: 'text-pink-400', borderColor: 'hover:border-pink-500/20' },
        { title: 'Contacts', desc: 'View messages', path: '/contacts', count: stats.contacts, icon: <MessageSquare size={20} />, gradient: 'from-emerald-500/15 to-teal-500/15', iconColor: 'text-emerald-400', borderColor: 'hover:border-emerald-500/20' },
        { title: 'Process', desc: 'Workflow steps', path: '/process', icon: <LayoutList size={20} />, gradient: 'from-amber-500/15 to-orange-500/15', iconColor: 'text-amber-400', borderColor: 'hover:border-amber-500/20' },
        { title: 'Pricing', desc: 'Plan packages', path: '/pricing', count: stats.pricing, icon: <CreditCard size={20} />, gradient: 'from-teal-500/15 to-cyan-500/15', iconColor: 'text-teal-400', borderColor: 'hover:border-teal-500/20' },
        { title: 'Statistics', desc: 'Trust numbers', path: '/stats', icon: <BarChart3 size={20} />, gradient: 'from-indigo-500/15 to-blue-500/15', iconColor: 'text-indigo-400', borderColor: 'hover:border-indigo-500/20' },
        { title: 'About Us', desc: 'Company story', path: '/about', icon: <Info size={20} />, gradient: 'from-sky-500/15 to-blue-500/15', iconColor: 'text-sky-400', borderColor: 'hover:border-sky-500/20' },
    ];

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="skeleton h-28 w-full rounded-2xl" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="skeleton h-36 rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden glass-card rounded-2xl p-6 md:p-8 border border-white/[0.06]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/[0.06] to-transparent rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl pointer-events-none" />
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity size={16} className="text-blue-400" />
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.15em]">System Status — Online</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-sans font-black uppercase tracking-tight text-white mb-1">
                        System Overview
                    </h2>
                    <p className="text-white/35 text-sm max-w-md">
                        Manage your digital agency content from a single control panel. All sections are live and synced.
                    </p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Services', value: stats.services, color: 'text-purple-400' },
                    { label: 'Projects', value: stats.portfolio, color: 'text-pink-400' },
                    { label: 'Messages', value: stats.contacts, color: 'text-emerald-400' },
                    { label: 'Plans', value: stats.pricing, color: 'text-teal-400' },
                ].map((item, i) => (
                    <div key={i} className="glass-card rounded-xl p-4 text-center">
                        <div className={`text-2xl md:text-3xl font-sans font-black ${item.color}`}>{item.value}</div>
                        <div className="text-[10px] font-bold text-white/25 uppercase tracking-[0.12em] mt-0.5">{item.label}</div>
                    </div>
                ))}
            </div>

            {/* Navigation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 stagger-children">
                {cards.map((card, i) => (
                    <Link 
                        key={i} 
                        to={card.path}
                        className={`group glass-card p-5 rounded-2xl transition-all duration-300 ${card.borderColor} hover:translate-y-[-2px]`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center ${card.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                                {card.icon}
                            </div>
                            <ArrowUpRight size={16} className="text-white/0 group-hover:text-white/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                        <div className="flex items-end justify-between">
                            <div>
                                <h3 className="font-semibold text-sm text-white/80 group-hover:text-white transition-colors">{card.title}</h3>
                                <p className="text-[11px] text-white/25 mt-0.5">{card.desc}</p>
                            </div>
                            {card.count !== undefined && (
                                <div className="text-2xl font-sans font-black text-white/15 group-hover:text-white/25 transition-colors">
                                    {card.count}
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
