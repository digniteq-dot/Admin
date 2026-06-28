import { useState, useEffect } from 'react';
import api from '../api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const ContactsViewer = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/contact');
            setContacts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleDelete = (id) => {
        setDeleteConfirmId(id);
    };

    const columns = [
        { header: 'Date', accessor: 'createdAt', render: (row) => <span className="text-white/50 text-sm">{new Date(row.createdAt).toLocaleDateString()}</span> },
        { header: 'Name', accessor: 'name', render: (row) => <span className="font-bold">{row.name}</span> },
        { header: 'Email', accessor: 'email', render: (row) => <span className="text-blue-400">{row.email}</span> },
        { header: 'Source', accessor: 'leadSource', render: (row) => <span className="text-blue-400 font-semibold text-xs bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">{row.leadSource || 'N/A'}</span> },
        { header: 'Message', accessor: 'message', render: (row) => <span className="text-white/70 text-sm max-w-xs block truncate" title={row.message}>{row.message}</span> },
        { header: 'Status', accessor: 'status', render: (row) => (
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${row.status === 'new' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/50'}`}>
                {row.status}
            </span>
        )},
    ];

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-sans font-black uppercase tracking-tight mb-2">Contact Submissions</h2>
                <p className="text-white/50">View messages from the website contact form.</p>
            </div>

            {loading ? (
                <div className="text-white/50 animate-pulse">Loading messages...</div>
            ) : (
                <DataTable columns={columns} data={contacts} onDelete={handleDelete} />
            )}

            {/* Custom Delete Confirmation Modal */}
            <Modal 
                isOpen={!!deleteConfirmId} 
                onClose={() => setDeleteConfirmId(null)} 
                title="Confirm Deletion"
            >
                <div className="flex flex-col gap-5">
                    <p className="text-white/70 text-sm leading-relaxed">
                        Are you sure you want to delete this message? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 pt-2">
                        <button 
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/75 text-sm font-semibold transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={async () => {
                                try {
                                    await api.delete(`/contact/${deleteConfirmId}`);
                                    setDeleteConfirmId(null);
                                    fetchContacts();
                                } catch (err) {
                                    console.error(err);
                                }
                            }}
                            className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold shadow-lg shadow-red-500/20 transition-all"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ContactsViewer;
