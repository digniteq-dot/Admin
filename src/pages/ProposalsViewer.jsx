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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="relative w-full max-w-[850px] bg-slate-100 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                        
                        {/* Header Controls */}
                        <div className="bg-white border-b border-slate-200 p-4 md:p-6 flex justify-between items-center shrink-0 z-10">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Proposal Document</h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-slate-500 text-xs font-medium">Status:</span>
                                    <select
                                        value={selectedProposal.status}
                                        onChange={(e) => handleStatusChange(selectedProposal._id, e.target.value)}
                                        className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 font-bold focus:outline-none"
                                    >
                                        <option value="new">New</option>
                                        <option value="contacted">Contacted</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center">
                                <button
                                    onClick={() => handlePrint(selectedProposal)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                                >
                                    <Printer size={14} /> Print PDF
                                </button>
                                <button 
                                    className="text-slate-400 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                                    onClick={() => setSelectedProposal(null)}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Proposal Document Body */}
                        <div className="overflow-y-auto p-4 md:p-8 font-sans text-slate-800 pb-20">
                            <div className="max-w-[794px] mx-auto flex flex-col gap-10">
                                
                                {/* Page 1 equivalent */}
                                <div className="bg-white shadow-xl border border-slate-200 relative overflow-hidden min-h-[1123px] flex flex-col">
                                    <div className="h-4 bg-blue-600 w-full shrink-0"></div>
                                    <div className="p-10 md:p-14 flex-1">
                                        <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-slate-100 pb-10 mb-10 gap-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg">D</div>
                                                <div>
                                                    <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Digniteq</h2>
                                                    <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mt-0.5">Premium Digital Agency</p>
                                                    <p className="text-slate-500 text-xs mt-1 font-medium">digniteq.in &nbsp;&bull;&nbsp; contact@digniteq.in</p>
                                                </div>
                                            </div>
                                            <div className="text-left md:text-right bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Document Type</span>
                                                <p className="text-slate-900 font-black text-lg uppercase tracking-tight mb-2">Service Proposal</p>
                                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm md:text-right">
                                                    <span className="text-slate-500">Ref No:</span>
                                                    <span className="text-slate-900 font-bold">#PRO-{selectedProposal._id?.slice(-6).toUpperCase()}</span>
                                                    <span className="text-slate-500">Date:</span>
                                                    <span className="text-slate-900 font-bold">{new Date(selectedProposal.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12 bg-slate-50 p-8 rounded-2xl border border-slate-100">
                                            <div>
                                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4 block">Prepared For</span>
                                                <h3 className="text-2xl font-black text-slate-900 mb-1">{selectedProposal.clientName}</h3>
                                                <p className="text-slate-600 font-bold text-sm uppercase tracking-wider mb-3">{selectedProposal.businessName}</p>
                                                <div className="space-y-1">
                                                    <p className="text-slate-500 text-sm">{selectedProposal.email}</p>
                                                    {selectedProposal.phone && <p className="text-slate-500 text-sm">{selectedProposal.phone}</p>}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4 block">Project Outline</span>
                                                <p className="text-slate-600 text-sm leading-relaxed bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                                    {selectedProposal.description || "Custom business growth and optimization strategy designed for digital enhancement and lead generation targeting specific market goals."}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-10">
                                            <section>
                                                <h3 className="text-xl font-bold text-slate-900 mb-3">Investment details</h3>
                                                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                                                    <table className="w-full text-left border-collapse">
                                                        <thead>
                                                            <tr className="bg-slate-50 border-b border-slate-200">
                                                                <th className="p-3 font-bold text-slate-900">#</th>
                                                                <th className="p-3 font-bold text-slate-900">Service Area</th>
                                                                <th className="p-3 font-bold text-slate-900 text-right">Pricing</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100">
                                                            {selectedProposal.selectedServices?.map((service, idx) => (
                                                                <tr key={idx}>
                                                                    <td className="p-3 text-slate-600">{idx + 1}</td>
                                                                    <td className="p-3">
                                                                        <div className="font-bold text-slate-800">{service.serviceType}</div>
                                                                        <div className="text-sm text-blue-600 font-bold">{service.planName}</div>
                                                                        {service.features && (
                                                                            <div className="mt-2 grid grid-cols-1 gap-1 text-xs text-slate-500">
                                                                                {service.features.map((feat, fIdx) => (
                                                                                    <span key={fIdx}>✦ {feat}</span>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                    <td className="p-3 font-bold text-right text-slate-800 align-top">{service.price}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                        <tfoot>
                                                            <tr className="bg-slate-50 border-t-2 border-slate-300">
                                                                <td colSpan="2" className="p-4 text-right font-black uppercase tracking-widest text-slate-600 text-xs">Total Investment</td>
                                                                <td className="p-4 font-black text-slate-900 text-xl text-right">{selectedProposal.totalPrice}</td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                            </section>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProposalsViewer;
