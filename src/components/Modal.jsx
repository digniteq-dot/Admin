import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center animate-fade-in">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                onClick={onClose}
            />
            
            {/* Modal Panel */}
            <div className="relative bg-[#0a0618] border border-white/[0.08] w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh] animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-white/[0.015]">
                    <h3 className="font-sans font-bold text-base text-white">{title}</h3>
                    <button 
                        onClick={onClose} 
                        className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all"
                    >
                        <X size={16} />
                    </button>
                </div>
                
                {/* Body */}
                <div className="p-5 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
