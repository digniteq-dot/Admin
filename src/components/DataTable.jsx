import { Edit2, Trash2, MoreVertical } from 'lucide-react';
import { useState } from 'react';

const DataTable = ({ columns, data, onEdit, onDelete }) => {
    const [openMenuId, setOpenMenuId] = useState(null);

    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden md:block glass-card rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/[0.06]">
                                {columns.map((col, i) => (
                                    <th key={i} className="px-5 py-3.5 text-[10px] font-bold text-white/30 uppercase tracking-[0.12em]">
                                        {col.header}
                                    </th>
                                ))}
                                <th className="px-5 py-3.5 text-[10px] font-bold text-white/30 uppercase tracking-[0.12em] text-right w-24">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length + 1} className="px-5 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center text-white/15 mb-1">
                                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                                            </div>
                                            <p className="text-white/30 text-sm">No items found</p>
                                            <p className="text-white/15 text-xs">Add one to get started</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                data.map((row, i) => (
                                    <tr key={row._id || i} className="hover:bg-white/[0.015] transition-colors group">
                                        {columns.map((col, j) => (
                                            <td key={j} className="px-5 py-3.5 text-sm">
                                                {col.render ? col.render(row) : row[col.accessor]}
                                            </td>
                                        ))}
                                        <td className="px-5 py-3.5 text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                {onEdit && (
                                                    <button 
                                                        onClick={() => onEdit(row)} 
                                                        className="w-8 h-8 rounded-lg bg-blue-500/[0.08] hover:bg-blue-500/20 flex items-center justify-center text-blue-400 transition-all"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button 
                                                        onClick={() => onDelete(row._id)} 
                                                        className="w-8 h-8 rounded-lg bg-red-500/[0.06] hover:bg-red-500/15 flex items-center justify-center text-red-400/70 hover:text-red-400 transition-all"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
                {data.length === 0 ? (
                    <div className="glass-card rounded-2xl p-8 text-center">
                        <p className="text-white/30 text-sm">No items found</p>
                        <p className="text-white/15 text-xs mt-1">Add one to get started</p>
                    </div>
                ) : (
                    data.map((row, i) => (
                        <div key={row._id || i} className="glass-card rounded-xl p-4 relative">
                            {/* Mobile card content */}
                            <div className="flex justify-between items-start mb-3">
                                <div className="space-y-1.5 flex-1 min-w-0">
                                    {columns.slice(0, 2).map((col, j) => (
                                        <div key={j} className="text-sm">
                                            {col.render ? col.render(row) : row[col.accessor]}
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Mobile action menu */}
                                <div className="relative ml-2">
                                    <button 
                                        onClick={() => setOpenMenuId(openMenuId === (row._id || i) ? null : (row._id || i))}
                                        className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/40 hover:text-white/70 transition-all"
                                    >
                                        <MoreVertical size={16} />
                                    </button>
                                    
                                    {openMenuId === (row._id || i) && (
                                        <div className="absolute right-0 top-full mt-1 bg-[#0a0618] border border-white/10 rounded-xl shadow-xl shadow-black/50 py-1 z-50 min-w-[120px] animate-scale-in">
                                            {onEdit && (
                                                <button 
                                                    onClick={() => { onEdit(row); setOpenMenuId(null); }}
                                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-white/60 hover:text-blue-400 hover:bg-white/[0.03] transition-all"
                                                >
                                                    <Edit2 size={14} /> Edit
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button 
                                                    onClick={() => { onDelete(row._id); setOpenMenuId(null); }}
                                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-white/60 hover:text-red-400 hover:bg-white/[0.03] transition-all"
                                                >
                                                    <Trash2 size={14} /> Delete
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Additional columns as badges/meta */}
                            {columns.length > 2 && (
                                <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2 border-t border-white/[0.04]">
                                    {columns.slice(2).map((col, j) => (
                                        <div key={j} className="text-xs">
                                            <span className="text-white/20 mr-1">{col.header}:</span>
                                            <span className="text-white/50">{col.render ? col.render(row) : row[col.accessor]}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </>
    );
};

export default DataTable;
