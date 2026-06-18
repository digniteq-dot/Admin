import { useState, useEffect } from 'react';
import api from '../api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

const ProcessManager = () => {
    const [steps, setSteps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ step: '', title: '', description: '', order: 0 });

    const fetchSteps = async () => {
        setLoading(true);
        try {
            const res = await api.get('/process');
            setSteps(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSteps();
    }, []);

    const handleOpenModal = (step = null) => {
        if (step) {
            setFormData(step);
            setEditingId(step._id);
        } else {
            setFormData({ step: `0${steps.length + 1}`, title: '', description: '', order: steps.length + 1 });
            setEditingId(null);
        }
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this process step?')) {
            try {
                await api.delete(`/process/${id}`);
                fetchSteps();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/process/${editingId}`, formData);
            } else {
                await api.post('/process', formData);
            }
            setIsModalOpen(false);
            fetchSteps();
        } catch (err) {
            console.error(err);
        }
    };

    const columns = [
        { header: 'Order', accessor: 'order', render: (row) => <span className="text-white/50">#{row.order}</span> },
        { header: 'Step #', accessor: 'step', render: (row) => <span className="font-sans font-black text-xl text-blue-400">{row.step}</span> },
        { header: 'Title', accessor: 'title', render: (row) => <span className="font-bold">{row.title}</span> },
        { header: 'Description', accessor: 'description', render: (row) => <span className="text-white/50 text-sm">{row.description}</span> },
    ];

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-sans font-black uppercase tracking-tight mb-2">Process Steps</h2>
                    <p className="text-white/50">Manage the \"How we work together\" steps.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
                    <Plus size={18} /> Add Step
                </button>
            </div>

            {loading ? (
                <div className="text-white/50 animate-pulse">Loading process steps...</div>
            ) : (
                <DataTable columns={columns} data={steps} onEdit={handleOpenModal} onDelete={handleDelete} />
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Step' : 'Add New Step'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Step Number</label>
                        <input type="text" value={formData.step} onChange={e => setFormData({...formData, step: e.target.value})} className="input-field" placeholder="e.g. 01" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Title</label>
                        <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input-field" placeholder="e.g. Discovery" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Description</label>
                        <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field resize-none" rows="3" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Display Order</label>
                        <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} className="input-field" required />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary">Save Step</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ProcessManager;
