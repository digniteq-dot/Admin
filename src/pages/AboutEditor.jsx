import { useState, useEffect } from 'react';
import api from '../api';

const AboutEditor = () => {
    const [formData, setFormData] = useState({
        title: '',
        paragraph1: '',
        paragraph2: '',
        mission: '',
        vision: '',
        yearsExp: '',
        happyClients: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/about');
                if (res.data) setFormData(res.data);
            } catch (err) {
                console.error("Failed to fetch about content", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ text: '', type: '' });
        try {
            await api.put('/about', formData);
            setMessage({ text: 'About section updated successfully!', type: 'success' });
        } catch (err) {
            setMessage({ text: 'Failed to update content', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-white/50 animate-pulse">Loading editor...</div>;

    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <h2 className="text-3xl font-sans font-black uppercase tracking-tight mb-2">About Section</h2>
                <p className="text-white/50">Edit the company story, mission, and vision.</p>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl mb-6 ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl space-y-8 border border-white/10">
                <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Main Heading</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="input-field" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Story Paragraph 1</label>
                        <textarea name="paragraph1" value={formData.paragraph1} onChange={handleChange} rows="4" className="input-field resize-none" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Story Paragraph 2</label>
                        <textarea name="paragraph2" value={formData.paragraph2} onChange={handleChange} rows="4" className="input-field resize-none" required />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Our Mission</label>
                        <textarea name="mission" value={formData.mission} onChange={handleChange} rows="3" className="input-field resize-none" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Our Vision</label>
                        <textarea name="vision" value={formData.vision} onChange={handleChange} rows="3" className="input-field resize-none" required />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Years of Vision (Badge)</label>
                        <input type="text" name="yearsExp" value={formData.yearsExp} onChange={handleChange} className="input-field" placeholder="e.g. 02+" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Happy Clients (Badge)</label>
                        <input type="text" name="happyClients" value={formData.happyClients} onChange={handleChange} className="input-field" placeholder="e.g. 50+" required />
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button type="submit" disabled={saving} className="btn-primary">
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AboutEditor;
