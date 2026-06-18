import { useState, useEffect } from 'react';
import api from '../api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

const CATEGORIES = ["Web Design", "SEO Strategy", "SMM Strategy", "Branding"];

const PortfolioManager = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ title: '', cat: 'Web Design', desc: '', img: '', order: 0 });

    const [uploading, setUploading] = useState(false);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await api.get('/portfolio');
            setProjects(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataPayload = new FormData();
        formDataPayload.append('image', file);

        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await api.post('/upload', formDataPayload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });
            setFormData(prev => ({ ...prev, img: res.data.url }));
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Image upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleOpenModal = (project = null) => {
        if (project) {
            setFormData({
                title: project.title || '',
                cat: project.cat || 'Web Design',
                desc: project.desc || '',
                img: project.img || '',
                order: project.order || 0
            });
            setEditingId(project._id);
        } else {
            setFormData({ title: '', cat: 'Web Design', desc: '', img: '', order: projects.length + 1 });
            setEditingId(null);
        }
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this portfolio project?')) {
            try {
                await api.delete(`/portfolio/${id}`);
                fetchProjects();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/portfolio/${editingId}`, formData);
            } else {
                await api.post('/portfolio', formData);
            }
            setIsModalOpen(false);
            fetchProjects();
        } catch (err) {
            console.error(err);
        }
    };

    const columns = [
        { header: 'Order', accessor: 'order', render: (row) => <span className="text-white/50">#{row.order}</span> },
        { 
            header: 'Image', 
            accessor: 'img', 
            render: (row) => {
                const imgUrl = row.img?.startsWith('/') ? `http://localhost:3000${row.img}` : row.img;
                return (
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 border border-white/10">
                        {row.img ? (
                            <img src={imgUrl} alt={row.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-white/30">No img</div>
                        )}
                    </div>
                );
            }
        },
        { header: 'Title', accessor: 'title', render: (row) => <span className="font-bold">{row.title}</span> },
        { header: 'Category', accessor: 'cat', render: (row) => <span className="bg-blue-500/10 text-blue-400 px-2.5 py-0.5 rounded-full text-xs font-medium">{row.cat}</span> },
        { header: 'Description', accessor: 'desc', render: (row) => <span className="text-white/50 text-sm">{row.desc?.substring(0, 50)}...</span> },
    ];

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-sans font-black uppercase tracking-tight mb-2">Portfolio</h2>
                    <p className="text-white/50">Manage the projects displayed in the portfolio section.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
                    <Plus size={18} /> Add Project
                </button>
            </div>

            {loading ? (
                <div className="text-white/50 animate-pulse">Loading portfolio...</div>
            ) : (
                <DataTable columns={columns} data={projects} onEdit={handleOpenModal} onDelete={handleDelete} />
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Project' : 'Add New Project'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Title</label>
                        <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input-field" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Category</label>
                        <select 
                            value={formData.cat} 
                            onChange={e => setFormData({...formData, cat: e.target.value})} 
                            className="input-field bg-[#0c1020]"
                            required
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Project Image</label>
                        <div className="flex gap-4 items-center mb-2">
                            {formData.img && (
                                <img 
                                    src={formData.img.startsWith('/') ? `http://localhost:3000${formData.img}` : formData.img} 
                                    alt="Preview" 
                                    className="w-16 h-16 rounded-xl object-cover border border-white/10" 
                                />
                            )}
                            <input 
                                type="file" 
                                onChange={handleImageUpload} 
                                className="text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20 cursor-pointer"
                                accept="image/*"
                            />
                        </div>
                        {uploading && <p className="text-xs text-blue-400 animate-pulse">Uploading to Cloudinary...</p>}
                        <input 
                            type="text" 
                            value={formData.img} 
                            onChange={e => setFormData({...formData, img: e.target.value})} 
                            className="input-field mt-2" 
                            placeholder="Or enter image URL directly..." 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Description</label>
                        <textarea value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="input-field resize-none" rows="3" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Display Order</label>
                        <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} className="input-field" required />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary">Save Project</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default PortfolioManager;
