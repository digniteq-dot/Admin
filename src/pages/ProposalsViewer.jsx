import { useState, useEffect } from 'react';
import api from '../api';
import axios from 'axios';
import DataTable from '../components/DataTable';
import { Eye, Printer, Trash2 } from 'lucide-react';

const ProposalsViewer = () => {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProposal, setSelectedProposal] = useState(null);

    const fetchProposals = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('digniteq_admin_token');
            const res = await axios.get('http://localhost:5000/api/proposal', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProposals(res.data);
        } catch (err) {
            console.error('Fetch Proposals Error:', err);
            alert('Failed to fetch from localhost:5000/api/proposal - ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProposals();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this proposal submission?')) {
            try {
                await api.delete(`/proposal/${id}`);
                fetchProposals();
            } catch (err) {
                console.error(err);
            }
        }
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

    const handlePrint = (proposal) => {
        // Create an iframe to print the specific proposal styled nicely
        const printWindow = window.open('', '_blank');
        const dateStr = new Date(proposal.createdAt).toLocaleDateString();
        
        const html = `
            <html>
            <head>
                <title>Proposal - ${proposal.businessName}</title>
                <style>
                    body {
                        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                        color: #1a1a1a;
                        padding: 40px;
                        line-height: 1.6;
                    }
                    .header {
                        border-bottom: 2px solid #eaeaea;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                        display: flex;
                        justify-content: space-between;
                    }
                    .logo-section {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                    .logo-icon {
                        width: 32px;
                        height: 32px;
                        background: #2563eb;
                        color: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        border-radius: 8px;
                    }
                    .logo-text {
                        font-weight: bold;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        font-size: 18px;
                    }
                    .doc-title {
                        font-size: 10px;
                        font-weight: bold;
                        color: #2563eb;
                        letter-spacing: 2px;
                    }
                    .info-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 40px;
                        margin-bottom: 40px;
                    }
                    .info-title {
                        font-size: 10px;
                        font-weight: bold;
                        color: #888;
                        letter-spacing: 1px;
                        margin-bottom: 5px;
                        text-transform: uppercase;
                    }
                    .info-val {
                        font-size: 14px;
                    }
                    .service-card {
                        border: 1px solid #eaeaea;
                        border-radius: 12px;
                        padding: 20px;
                        margin-bottom: 15px;
                    }
                    .service-header {
                        display: flex;
                        justify-content: space-between;
                        font-weight: bold;
                        margin-bottom: 10px;
                    }
                    .service-title {
                        text-transform: uppercase;
                        font-size: 14px;
                    }
                    .service-plan {
                        color: #2563eb;
                        font-size: 12px;
                    }
                    .feature-list {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 8px;
                        margin-top: 15px;
                        padding-top: 15px;
                        border-top: 1px solid #f3f4f6;
                    }
                    .feature-item {
                        font-size: 11px;
                        color: #555;
                    }
                    .total-box {
                        border: 1px solid #2563eb;
                        background: #f0f5ff;
                        padding: 15px 30px;
                        border-radius: 12px;
                        text-align: right;
                        align-self: flex-end;
                        margin-top: 20px;
                    }
                    .total-title {
                        font-size: 10px;
                        font-weight: bold;
                        color: #2563eb;
                        letter-spacing: 1px;
                        margin-bottom: 2px;
                    }
                    .total-price {
                        font-size: 24px;
                        font-weight: 900;
                    }
                    .sig-section {
                        margin-top: 50px;
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 50px;
                    }
                    .sig-line {
                        border-bottom: 1px solid #ccc;
                        height: 40px;
                        margin-bottom: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <div class="logo-section">
                            <div class="logo-icon">D</div>
                            <span class="logo-text">Digniteq</span>
                        </div>
                        <p style="margin: 5px 0 0 0; font-size: 11px; color: #666;">Premium Digital Development & SMM Agency</p>
                    </div>
                    <div style="text-align: right;">
                        <span class="doc-title">PROPOSAL DOCUMENT</span>
                        <p style="margin: 5px 0 0 0; font-weight: bold;">Proposal ID: #PRO-${proposal._id?.slice(-6).toUpperCase()}</p>
                        <p style="margin: 2px 0 0 0; font-size: 11px; color: #666;">Date: ${dateStr}</p>
                    </div>
                </div>

                <div class="info-grid">
                    <div>
                        <div class="info-title">Prepared For</div>
                        <div class="info-val" style="font-weight: bold; font-size: 16px;">${proposal.clientName}</div>
                        <div class="info-val" style="color: #444;">${proposal.businessName}</div>
                        <div class="info-val" style="color: #666; font-size: 12px;">${proposal.email} | ${proposal.phone || 'N/A'}</div>
                    </div>
                    <div>
                        <div class="info-title">Project Scope</div>
                        <div class="info-val" style="font-size: 12px; color: #555;">
                            ${proposal.description || "Custom business growth and optimization strategy designed for digital enhancement and lead generation targeting local markets."}
                        </div>
                    </div>
                </div>

                <div class="info-title" style="margin-bottom: 15px;">Selected Services</div>
                <div>
                    ${proposal.selectedServices.map(service => `
                        <div class="service-card">
                            <div class="service-header">
                                <div class="service-title">
                                    ${service.serviceType}
                                    <div class="service-plan">${service.planName}</div>
                                </div>
                                <div style="font-size: 16px; font-weight: 800;">${service.price}</div>
                            </div>
                            <div class="feature-list">
                                ${service.features.map(feat => `<div class="feature-item">✦ ${feat}</div>`).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div style="display: flex; flex-direction: column; align-items: flex-end; margin-top: 30px;">
                    <div class="total-box">
                        <div class="total-title">TOTAL INVESTMENT</div>
                        <div class="total-price">${proposal.totalPrice}</div>
                    </div>
                </div>

                <div class="sig-section">
                    <div>
                        <div class="info-title">PREPARED BY</div>
                        <div class="sig-line"></div>
                        <div class="info-val" style="font-size: 12px; color: #666;">Digniteq Team Representative</div>
                    </div>
                    <div>
                        <div class="info-title">ACCEPTED BY</div>
                        <div class="sig-line"></div>
                        <div class="info-val" style="font-size: 12px; color: #666;">${proposal.clientName}</div>
                    </div>
                </div>

                <script>
                    window.onload = function() {
                        window.print();
                    }
                </script>
            </body>
            </html>
        `;
        
        printWindow.document.write(html);
        printWindow.document.close();
    };

    const columns = [
        { header: 'Date', accessor: 'createdAt', render: (row) => <span className="text-white/50 text-sm">{new Date(row.createdAt).toLocaleDateString()}</span> },
        { header: 'Client', accessor: 'clientName', render: (row) => <span className="font-bold">{row.clientName}</span> },
        { header: 'Business', accessor: 'businessName', render: (row) => <span className="text-white/70">{row.businessName}</span> },
        { header: 'Services Count', accessor: 'selectedServices', render: (row) => <span className="text-blue-400 font-bold">{row.selectedServices?.length || 0}</span> },
        { header: 'Total Price', accessor: 'totalPrice', render: (row) => <span className="text-white font-bold">{row.totalPrice}</span> },
        { header: 'Status', accessor: 'status', render: (row) => (
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                row.status === 'new' ? 'bg-green-500/20 text-green-400' :
                row.status === 'contacted' ? 'bg-blue-500/20 text-blue-400' :
                'bg-white/10 text-white/50'
            }`}>
                {row.status}
            </span>
        )},
        { header: 'Proposal Details', accessor: '_id', render: (row) => (
            <div className="flex gap-2">
                <button
                    onClick={() => setSelectedProposal(row)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold hover:bg-blue-500/20 transition-all"
                >
                    <Eye size={12} /> View
                </button>
                <button
                    onClick={() => handlePrint(row)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-white/70 text-xs font-bold hover:bg-white/10 transition-all"
                >
                    <Printer size={12} /> Print
                </button>
            </div>
        )}
    ];

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-sans font-black uppercase tracking-tight mb-2">Client Proposals</h2>
                <p className="text-white/50">Manage dynamic client proposals, download printable versions, and track status.</p>
            </div>

            {loading ? (
                <div className="text-white/50 animate-pulse">Loading proposals...</div>
            ) : (
                <DataTable columns={columns} data={proposals} onDelete={handleDelete} />
            )}

            {/* Proposal Detail Modal */}
            {selectedProposal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
                    <div className="relative w-full max-w-4xl bg-[#060212] border border-white/10 rounded-[30px] shadow-2xl overflow-y-auto max-h-[90vh] p-8 md:p-12">
                        
                        {/* Close button */}
                        <button 
                            className="absolute top-6 right-6 text-white/40 hover:text-white text-lg font-bold"
                            onClick={() => setSelectedProposal(null)}
                        >
                            ✕
                        </button>

                        <div className="mb-8 border-b border-white/10 pb-6 flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-sans font-black text-white uppercase tracking-tight">Proposal Overview</h3>
                                <p className="text-white/40 text-xs mt-1">Submitted: {new Date(selectedProposal.createdAt).toLocaleString()}</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handlePrint(selectedProposal)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-xs font-bold hover:scale-105 transition-transform"
                                >
                                    <Printer size={14} /> Download / Print PDF
                                </button>
                            </div>
                        </div>

                        {/* Proposal Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-4">
                                <div>
                                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block">Client Name</span>
                                    <p className="text-white text-base font-bold">{selectedProposal.clientName}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block">Business Name</span>
                                    <p className="text-white/80 text-sm font-medium">{selectedProposal.businessName}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block">Email & Phone</span>
                                    <p className="text-blue-400 text-sm">{selectedProposal.email} {selectedProposal.phone && `| ${selectedProposal.phone}`}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block">Proposal Status</span>
                                    <select
                                        value={selectedProposal.status}
                                        onChange={(e) => handleStatusChange(selectedProposal._id, e.target.value)}
                                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white mt-1.5 focus:outline-none"
                                    >
                                        <option value="new">New</option>
                                        <option value="contacted">Contacted</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block">Requirements Description</span>
                                <p className="text-white/60 text-sm leading-relaxed mt-1.5 bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                                    {selectedProposal.description || "No description provided."}
                                </p>
                            </div>
                        </div>

                        {/* Selected services list */}
                        <div className="mb-8">
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-4">Scope of Work</span>
                            <div className="space-y-4">
                                {selectedProposal.selectedServices?.map((service, sIdx) => (
                                    <div key={sIdx} className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="text-sm font-bold text-white uppercase">{service.serviceType}</h4>
                                                <span className="text-xs text-blue-400 font-bold">{service.planName}</span>
                                            </div>
                                            <span className="text-sm font-black text-white">{service.price}</span>
                                        </div>
                                        {service.features && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-3 pt-3 border-t border-white/5">
                                                {service.features.map((feat, fIdx) => (
                                                    <span key={fIdx} className="text-white/40 text-[10px] uppercase">
                                                        ✦ {feat}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-6 flex justify-between items-center">
                            <span className="text-white/40 text-xs uppercase">Estimated Investment</span>
                            <div className="bg-blue-600/10 border border-blue-500/20 px-6 py-3 rounded-xl text-right">
                                <span className="text-xs text-blue-400 font-bold uppercase tracking-wider block">Total</span>
                                <span className="text-xl font-black text-white">{selectedProposal.totalPrice}</span>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default ProposalsViewer;
