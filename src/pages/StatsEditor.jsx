import { useState, useEffect } from 'react';
import api from '../api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

const StatsEditor = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ label: '', value: '', sub: '', order: 0 });

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await api.get('/stats');
            setStats(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleOpenModal = (stat = null) => {
        if (stat) {
            setFormData(stat);
            setEditingId(stat._id);
        } else {
            setFormData({ label: '', value: '', sub: '', order: stats.length + 1 });
            setEditingId(null);
        }
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this statistic?')) {
            try {
                await api.delete(`/stats/${id}`);
                fetchStats();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/stats/${editingId}`, formData);
            } else {
                await api.post('/stats', formData);
            }
            setIsModalOpen(false);
            fetchStats();
        } catch (err) {
            console.error(err);
        }
    };

    const columns = [
        { header: 'Order', accessor: 'order', render: (row) => <span className="text-white/50">#{row.order}</span> },
        { header: 'Value', accessor: 'value', render: (row) => <span className="font-serif italic text-2xl text-blue-400">{row.value}</span> },
        { header: 'Label', accessor: 'label', render: (row) => <span className="font-bold">{row.label}</span> },
        { header: 'Sub-label', accessor: 'sub', render: (row) => <span className="text-white/50 text-sm">{row.sub}</span> },
    ];

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-sans font-black uppercase tracking-tight mb-2">Statistics</h2>
                    <p className="text-white/50">Manage the key numbers shown in the trust section.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
                    <Plus size={18} /> Add Statistic
                </button>
            </div>

            {loading ? (
                <div className="text-white/50 animate-pulse">Loading stats...</div>
            ) : (
                <DataTable columns={columns} data={stats} onEdit={handleOpenModal} onDelete={handleDelete} />
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Statistic' : 'Add New Statistic'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Value (Number/Text)</label>
                        <input type="text" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} className="input-field" placeholder="e.g. 50+" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Main Label (Top)</label>
                        <input type="text" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} className="input-field" placeholder="e.g. Active Clients" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Sub-label (Bottom)</label>
                        <input type="text" value={formData.sub} onChange={e => setFormData({...formData, sub: e.target.value})} className="input-field" placeholder="e.g. Trusted Partners" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Display Order</label>
                        <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} className="input-field" required />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary">Save Statistic</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default StatsEditor;
