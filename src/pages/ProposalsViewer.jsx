import { useState, useEffect } from 'react';
import api from '../api';
import DataTable from '../components/DataTable';
import { Eye, Trash2, X } from 'lucide-react';
import Modal from '../components/Modal';

const ProposalsViewer = () => {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProposal, setSelectedProposal] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    const fetchProposals = async () => {
        setLoading(true);
        try {
            const res = await api.get('/proposal');
            setProposals(res.data);
        } catch (err) {
            console.error('Fetch Proposals Error:', err);
            alert('Failed to fetch proposals - ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProposals();
    }, []);

    const handleDelete = (id) => {
        setDeleteConfirmId(id);
    };

    const handleStatusChange = async (id, status) => {
        try {
            await api.put(`/proposal/${id}`, { status });
            fetchProposals();
            if (selectedProposal && selectedProposal._id === id) {
                setSelectedProposal(prev => ({ ...prev, status }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const columns = [
        { header: 'ID', accessor: 'proposalId', render: (row) => <span className="text-white/50 text-xs font-mono">{row.proposalId || 'N/A'}</span> },
        { header: 'Date', accessor: 'createdAt', render: (row) => <span className="text-white/50 text-sm">{new Date(row.createdAt).toLocaleDateString()}</span> },
        { header: 'Client', accessor: 'clientName', render: (row) => <span className="font-bold">{row.clientName}</span> },
        { header: 'Business', accessor: 'businessName', render: (row) => <span className="text-white/70">{row.businessName}</span> },
        { header: 'Budget', accessor: 'budget', render: (row) => <span className="text-white font-bold">{row.budget || 'N/A'}</span> },
        { header: 'Source', accessor: 'leadSource', render: (row) => <span className="text-blue-400 font-semibold text-xs bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">{row.leadSource || 'N/A'}</span> },
        { header: 'Status', accessor: 'status', render: (row) => (
            <select
                value={row.status}
                onChange={(e) => handleStatusChange(row._id, e.target.value)}
                className={`text-[10px] uppercase font-bold px-2 py-1 rounded border-none outline-none cursor-pointer ${
                    row.status === 'new' ? 'bg-green-500/20 text-green-400' :
                    row.status === 'contacted' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-white/10 text-white/50'
                }`}
            >
                <option value="new" className="bg-[#0f172a] text-white">NEW</option>
                <option value="contacted" className="bg-[#0f172a] text-white">CONTACTED</option>
                <option value="resolved" className="bg-[#0f172a] text-white">RESOLVED</option>
            </select>
        )},
        { header: 'Details', accessor: '_id', render: (row) => (
            <button
                onClick={() => setSelectedProposal(row)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-bold hover:bg-blue-500/30 transition-all"
            >
                <Eye size={12} /> View
            </button>
        )}
    ];

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-sans font-black uppercase tracking-tight mb-2">Service Requests</h2>
                <p className="text-white/50">Manage client service requests, view details, and track status.</p>
            </div>

            {loading ? (
                <div className="text-white/50 animate-pulse">Loading requests...</div>
            ) : (
                <DataTable columns={columns} data={proposals} onDelete={handleDelete} />
            )}

            {selectedProposal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#0f172a] rounded-3xl p-8 max-w-2xl w-full border border-white/10 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                            <div>
                                <h3 className="text-2xl font-black text-white">{selectedProposal.clientName}</h3>
                                <p className="text-white/50 text-sm mt-1">{selectedProposal.businessName}</p>
                            </div>
                            <button onClick={() => setSelectedProposal(null)} className="p-2 text-white/50 hover:text-white bg-white/5 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div>
                                <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1">Email</p>
                                <p className="text-white">{selectedProposal.email || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1">Phone</p>
                                <p className="text-white">{selectedProposal.phone || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1">Budget</p>
                                <p className="text-white font-bold">{selectedProposal.budget || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1">Address</p>
                                <p className="text-white">{selectedProposal.address || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1">Lead Source</p>
                                <p className="text-white text-blue-400 font-semibold">{selectedProposal.leadSource || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Project Brief</p>
                            <div className="bg-white/5 rounded-xl p-4 text-white/80">
                                {selectedProposal.description || 'No description provided.'}
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Requested Services</p>
                            <div className="flex flex-col gap-3">
                                {selectedProposal.selectedServices?.map((service, idx) => (
                                    <div key={idx} className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-white">{service.serviceType}</p>
                                            <p className="text-white/50 text-sm">{service.planName || service.details}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            <Modal 
                isOpen={!!deleteConfirmId} 
                onClose={() => setDeleteConfirmId(null)} 
                title="Confirm Deletion"
            >
                <div className="flex flex-col gap-5">
                    <p className="text-white/70 text-sm leading-relaxed">
                        Are you sure you want to delete this proposal submission? This action cannot be undone.
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
                                    await api.delete(`/proposal/${deleteConfirmId}`);
                                    setDeleteConfirmId(null);
                                    fetchProposals();
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

export default ProposalsViewer;
