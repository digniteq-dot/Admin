import { useState, useEffect } from 'react';
import api from '../api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

const ServicesManager = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', icon: '', order: 0 });

    const fetchServices = async () => {
        setLoading(true);
        try {
            const res = await api.get('/services');
            setServices(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleOpenModal = (service = null) => {
        if (service) {
            setFormData(service);
            setEditingId(service._id);
        } else {
            setFormData({ title: '', description: '', icon: '', order: services.length + 1 });
            setEditingId(null);
        }
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            try {
                await api.delete(`/services/${id}`);
                fetchServices();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/services/${editingId}`, formData);
            } else {
                await api.post('/services', formData);
            }
            setIsModalOpen(false);
            fetchServices();
        } catch (err) {
            console.error(err);
        }
    };

    const columns = [
        { header: 'Order', accessor: 'order', render: (row) => <span className="text-white/50">#{row.order}</span> },
        { header: 'Icon', accessor: 'icon', render: (row) => <span className="text-blue-400 text-xl">{row.icon}</span> },
        { header: 'Title', accessor: 'title', render: (row) => <span className="font-bold">{row.title}</span> },
        { header: 'Description', accessor: 'description', render: (row) => <span className="text-white/50 text-sm">{row.description.substring(0, 50)}...</span> },
    ];

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-sans font-black uppercase tracking-tight mb-2">Services</h2>
                    <p className="text-white/50">Manage the services displayed on the homepage.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
                    <Plus size={18} /> Add Service
                </button>
            </div>

            {loading ? (
                <div className="text-white/50 animate-pulse">Loading services...</div>
            ) : (
                <DataTable columns={columns} data={services} onEdit={handleOpenModal} onDelete={handleDelete} />
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Service' : 'Add New Service'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Title</label>
                        <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input-field" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Icon (Emoji or Symbol)</label>
                        <input type="text" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="input-field" placeholder="e.g. ◈" required />
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
                        <button type="submit" className="btn-primary">Save Service</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ServicesManager;
