import { useState, useEffect } from 'react';
import api from '../api';

const HeroEditor = () => {
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        ctaText: '',
        ctaLink: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/hero');
                if (res.data) setFormData(res.data);
            } catch (err) {
                console.error("Failed to fetch hero content", err);
                setMessage({ text: 'Failed to load content', type: 'error' });
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
            await api.put('/hero', formData);
            setMessage({ text: 'Hero content updated successfully!', type: 'success' });
        } catch (err) {
            setMessage({ text: 'Failed to update content', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-white/50 animate-pulse">Loading editor...</div>;

    return (
        <div className="max-w-3xl">
            <div className="mb-8">
                <h2 className="text-3xl font-sans font-black uppercase tracking-tight mb-2">Hero Section</h2>
                <p className="text-white/50">Edit the main landing area of the website.</p>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl mb-6 ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl space-y-6 border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Title (Top Large Text)</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Subtitle (Bottom Large Text)</label>
                        <input
                            type="text"
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Description Paragraph</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        className="input-field resize-none"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Call to Action Text</label>
                        <input
                            type="text"
                            name="ctaText"
                            value={formData.ctaText}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Call to Action Link</label>
                        <input
                            type="text"
                            name="ctaLink"
                            value={formData.ctaLink}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="https://..."
                            required
                        />
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default HeroEditor;
