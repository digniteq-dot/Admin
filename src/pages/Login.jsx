import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Lock } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.post('/auth/login', { username, password });
            localStorage.setItem('digniteq_admin_token', res.data.token);
            if (res.data.refreshToken) {
                localStorage.setItem('digniteq_admin_refresh_token', res.data.refreshToken);
            }
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#030610] flex items-center justify-center p-6 relative overflow-hidden font-inter">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-blue-500/[0.03] blur-[150px] rounded-full pointer-events-none"></div>

            <div className="w-full max-w-md glass-card p-10 rounded-3xl relative z-10 border border-white/10 shadow-2xl">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 text-blue-500 mb-6 border border-blue-500/20">
                        <Lock size={28} />
                    </div>
                    <h1 className="font-sans font-black text-3xl text-white uppercase tracking-wider mb-2">Admin Portal</h1>
                    <p className="text-white/50 text-sm">Sign in to manage Digniteq content</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input-field"
                            placeholder="Enter username"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-primary w-full py-4 text-sm tracking-wider uppercase font-bold"
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
