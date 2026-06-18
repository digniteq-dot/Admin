import { useState, useEffect } from 'react';
import api from '../api';
import DataTable from '../components/DataTable';

const ContactsViewer = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                await api.delete(`/contact/${id}`);
                fetchContacts();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const columns = [
        { header: 'Date', accessor: 'createdAt', render: (row) => <span className="text-white/50 text-sm">{new Date(row.createdAt).toLocaleDateString()}</span> },
        { header: 'Name', accessor: 'name', render: (row) => <span className="font-bold">{row.name}</span> },
        { header: 'Email', accessor: 'email', render: (row) => <span className="text-blue-400">{row.email}</span> },
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
        </div>
    );
};

export default ContactsViewer;
