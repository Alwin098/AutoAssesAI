import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Login = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (userData?.role === 'teacher') {
                navigate('/teacher');
            } else {
                navigate('/student');
            }
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary text-text relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                {/* Floating Blob 1 */}
                <div
                    className="absolute w-[600px] h-[600px] rounded-full blur-[120px]"
                    style={{
                        background: '#032F30',
                        opacity: 0.08,
                        top: '-10%',
                        right: '-5%',
                        animation: 'float1 30s ease-in-out infinite'
                    }}
                ></div>

                {/* Floating Blob 2 */}
                <div
                    className="absolute w-[500px] h-[500px] rounded-full blur-[100px]"
                    style={{
                        background: '#0A7075',
                        opacity: 0.1,
                        bottom: '-15%',
                        left: '-10%',
                        animation: 'float2 35s ease-in-out infinite'
                    }}
                ></div>

                {/* Floating Blob 3 */}
                <div
                    className="absolute w-[400px] h-[400px] rounded-full blur-[90px]"
                    style={{
                        background: '#0C969C',
                        opacity: 0.06,
                        top: '40%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        animation: 'float3 40s ease-in-out infinite'
                    }}
                ></div>

                {/* Floating Blob 4 */}
                <div
                    className="absolute w-[350px] h-[350px] rounded-full blur-[80px]"
                    style={{
                        background: '#032F30',
                        opacity: 0.12,
                        top: '20%',
                        left: '10%',
                        animation: 'float4 25s ease-in-out infinite'
                    }}
                ></div>
            </div>

            {/* Keyframe Animations */}
            <style>{`
                @keyframes float1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -30px) scale(1.05); }
                    66% { transform: translate(-20px, 20px) scale(0.95); }
                }
                
                @keyframes float2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(-40px, 30px) scale(1.08); }
                    66% { transform: translate(25px, -25px) scale(0.92); }
                }
                
                @keyframes float3 {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); }
                    50% { transform: translate(-50%, -50%) translate(40px, 40px) scale(1.1); }
                }
                
                @keyframes float4 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(20px, -40px) scale(1.06); }
                }
            `}</style>

            <Card className="w-full max-w-md relative z-10 bg-surface/80 backdrop-blur-xl border border-muted/30">
                <h2 className="text-4xl font-extrabold mb-2 text-white font-heading tracking-tight text-center">Welcome Back</h2>
                <p className="text-secondary mb-8 text-center font-medium">Log in to your AutoAssesAI dashboard</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-secondary ml-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-4 rounded-xl bg-primary/50 border border-muted/50 focus:border-highlight focus:ring-1 focus:ring-highlight outline-none transition-all text-white font-medium"
                            placeholder="you@school.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-secondary ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-4 rounded-xl bg-primary/50 border border-muted/50 focus:border-highlight focus:ring-1 focus:ring-highlight outline-none transition-all text-white font-medium"
                            placeholder="••••••••"
                        />
                    </div>
                    <Button type="submit" className="w-full py-4 text-lg font-bold shadow-highlight/30 mt-4">
                        Sign In
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-secondary text-sm font-medium">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-highlight hover:text-white transition-colors font-bold underline underline-offset-4 decoration-highlight/30">
                            Create Account
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default Login;
