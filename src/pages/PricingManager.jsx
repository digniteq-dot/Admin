import { useState, useEffect } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const services = [
    { id: 'website-design', label: 'Website Design' },
    { id: 'smm-strategy', label: 'SMM Strategy' },
    { id: 'seo-strategy', label: 'SEO Strategy' },
    { id: 'branding', label: 'Branding' }
];

const PricingManager = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(services[0].id);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        serviceType: activeTab,
        planName: '', 
        price: '', 
        period: '', 
        desc: '',
        targetAudience: '',
        features: '', 
        isPopular: false, 
        ctaLabel: 'Deploy Plan', 
        order: 0
    });

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/pricing?serviceType=${activeTab}`);
            setPlans(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, [activeTab]);

    const handleOpenModal = (plan = null) => {
        if (plan) {
            setFormData({ 
                ...plan, 
                features: plan.features.join('\n'),
                targetAudience: plan.targetAudience ? plan.targetAudience.join(', ') : ''
            });
            setEditingId(plan._id);
        } else {
            setFormData({ 
                serviceType: activeTab,
                planName: '', 
                price: '', 
                period: '', 
                desc: '',
                targetAudience: '',
                features: '', 
                isPopular: false, 
                ctaLabel: 'Deploy Plan', 
                order: plans.length + 1 
            });
            setEditingId(null);
        }
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this pricing plan?')) {
            try {
                await api.delete(`/pricing/${id}`);
                fetchPlans();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            serviceType: activeTab,
            features: formData.features.split('\n').filter(f => f.trim() !== ''),
            targetAudience: formData.targetAudience.split(',').map(a => a.trim()).filter(a => a !== '')
        };
        
        try {
            if (editingId) {
                await api.put(`/pricing/${editingId}`, payload);
            } else {
                await api.post('/pricing', payload);
            }
            setIsModalOpen(false);
            fetchPlans();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-sans font-black uppercase tracking-tight mb-2">Pricing Plans</h2>
                    <p className="text-white/50">Manage subscription tiers and service packages per page.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2 shrink-0">
                    <Plus size={18} /> Add Plan
                </button>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto gap-2 mb-8 pb-2 border-b border-white/10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {services.map(service => (
                    <button
                        key={service.id}
                        onClick={() => setActiveTab(service.id)}
                        className={`px-6 py-3 font-sans-premium text-xs font-black uppercase tracking-widest whitespace-nowrap transition-colors ${
                            activeTab === service.id 
                            ? 'text-blue-400 border-b-2 border-blue-400' 
                            : 'text-white/40 hover:text-white'
                        }`}
                    >
                        {service.label}
                    </button>
                ))}
            </div>

            {/* Pricing Cards Grid matching Frontend */}
            {loading ? (
                <div className="text-white/50 animate-pulse">Loading pricing plans...</div>
            ) : plans.length === 0 ? (
                <div className="text-white/50 py-10 text-center glass-card rounded-3xl">No plans found for {services.find(s => s.id === activeTab).label}. Add one to get started.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plans.map((item) => (
                        <div 
                            key={item._id} 
                            className={`relative glass-card p-8 rounded-[32px] flex flex-col items-start group transition-all duration-500 ${
                                item.isPopular ? "border-blue-500/30 bg-blue-500/[0.02]" : "border-white/5"
                            }`}
                        >
                            {/* Overlay Edit Actions */}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                <button onClick={() => handleOpenModal(item)} className="p-2 bg-white/10 hover:bg-blue-500 hover:text-white rounded-full text-white/70 transition-colors">
                                    <Edit2 size={14} />
                                </button>
                                <button onClick={() => handleDelete(item._id)} className="p-2 bg-white/10 hover:bg-red-500 hover:text-white rounded-full text-white/70 transition-colors">
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            <div className="w-full flex justify-between items-start mb-6">
                                <div>
                                    <span className="font-sans-premium text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] mb-2 block">
                                        {item.planName}
                                    </span>
                                    <div className="text-3xl font-sans-premium font-black tracking-tighter text-white">
                                        {item.price}
                                        {item.period && <span className="text-xs font-sans text-white/50 tracking-normal"> {item.period}</span>}
                                    </div>
                                </div>
                                {item.isPopular && (
                                    <span className="bg-blue-500 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest mt-1">
                                        Popular
                                    </span>
                                )}
                            </div>
                            
                            <p className="font-inter text-[11px] text-white/50 uppercase tracking-widest leading-relaxed mb-6 text-left min-h-[40px]">
                                {item.desc}
                            </p>

                            <div className="w-full">
                                <div className="h-[1px] w-full bg-white/5 mb-6"></div>
                                
                                <div className="mb-6">
                                    <span className="font-sans-premium text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3 block text-left">Best For</span>
                                    <div className="flex flex-wrap gap-2 text-left">
                                        {(item.targetAudience || []).map((audience, idx) => (
                                            <span key={idx} className="font-inter text-[9px] text-white/70 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full bg-white/5">
                                                {audience}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <ul className="flex flex-col gap-4 mb-8 w-full min-h-[150px]">
                                    {(item.features || []).map((feat, j) => (
                                        <li key={j} className="font-inter text-[10px] text-white/60 uppercase tracking-widest flex items-start gap-3 text-left">
                                            <span className="text-blue-500 mt-0.5">✦</span> {feat}
                                        </li>
                                    ))}
                                </ul>

                                <div className={`w-full py-4 rounded-full font-sans-premium text-[10px] font-black uppercase tracking-widest transition-all text-center flex flex-col items-center justify-center gap-1 ${item.isPopular ? "bg-white text-black" : "bg-white/5 text-white"}`}>
                                    <span>{item.ctaLabel} ➔</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Plan' : 'Add New Plan'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Plan Name</label>
                            <input type="text" value={formData.planName} onChange={e => setFormData({...formData, planName: e.target.value})} className="input-field" placeholder="e.g. Standard Website" required />
                        </div>
                        <div className="flex items-center mt-6">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={formData.isPopular} onChange={e => setFormData({...formData, isPopular: e.target.checked})} className="w-5 h-5 rounded border-white/10 bg-[#0A0618] text-blue-500 focus:ring-blue-500/50" />
                                <span className="text-sm font-bold text-white/80">Mark as Popular</span>
                            </label>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Price</label>
                            <input type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="input-field" placeholder="e.g. ₹11,999" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Period (Optional)</label>
                            <input type="text" value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})} className="input-field" placeholder="e.g. /month" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Description</label>
                        <textarea value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="input-field resize-none" rows="2" placeholder="e.g. Specially designed for small businesses..." required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Target Audience (Comma Separated)</label>
                        <input type="text" value={formData.targetAudience} onChange={e => setFormData({...formData, targetAudience: e.target.value})} className="input-field" placeholder="Local Restaurant, Cafe, Gym" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Features (One per line)</label>
                        <textarea value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="input-field resize-none font-mono text-sm leading-relaxed" rows="5" placeholder="1-5 Pages&#10;1 year hosting&#10;Free SSL" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">CTA Button Label</label>
                            <input type="text" value={formData.ctaLabel} onChange={e => setFormData({...formData, ctaLabel: e.target.value})} className="input-field" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Display Order</label>
                            <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} className="input-field" required />
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary">Save Plan</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default PricingManager;
