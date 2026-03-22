import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { motion } from 'framer-motion';

const Register = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const result = await register(formData.name, formData.email, formData.password, formData.role);
        setLoading(false);

        if (result.success) {
            if (formData.role === 'teacher') {
                navigate('/teacher');
            } else {
                navigate('/student');
            }
        } else {
            setError(result.message);
        }
    };

    return (
        <>
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

            <div className="min-h-screen flex items-center justify-center bg-primary relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    {/* Floating Blob 1 */}
                    <div
                        className="absolute w-[600px] h-[600px] rounded-full blur-[120px]"
                        style={{
                            background: '#032F30',
                            opacity: 0.2,
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
                            opacity: 0.25,
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
                            opacity: 0.15,
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
                            opacity: 0.22,
                            top: '20%',
                            left: '10%',
                            animation: 'float4 25s ease-in-out infinite'
                        }}
                    ></div>
                </div>

                <Card className="w-full max-w-md relative z-10 bg-surface/80 backdrop-blur-xl border border-muted/30">
                    <div className="text-center mb-10">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-extrabold text-white mb-2 font-heading tracking-tight"
                        >
                            Get Started
                        </motion.h1>
                        <p className="text-secondary font-medium italic">Join the future of AI assessments</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center font-medium animate-shake">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <Input
                                label="Full Name"
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="name@school.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-xs font-bold uppercase tracking-widest text-secondary ml-1">Account Type</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'student' })}
                                    className={`py-4 rounded-xl border-2 transition-all font-bold tracking-wide ${formData.role === 'student' ? 'bg-highlight border-highlight text-primary shadow-lg shadow-highlight/20 scale-[1.02]' : 'bg-primary/30 border-muted/30 text-secondary hover:bg-white/5 hover:border-muted'}`}
                                >
                                    Student
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'teacher' })}
                                    className={`py-4 rounded-xl border-2 transition-all font-bold tracking-wide ${formData.role === 'teacher' ? 'bg-highlight border-highlight text-primary shadow-lg shadow-highlight/20 scale-[1.02]' : 'bg-primary/30 border-muted/30 text-secondary hover:bg-white/5 hover:border-muted'}`}
                                >
                                    Teacher
                                </button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full py-4 text-lg font-bold shadow-highlight/30 mt-4" loading={loading}>
                            {loading ? 'Generating Account...' : 'Create Account'}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-secondary text-sm font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="text-highlight hover:text-white transition-colors font-bold underline underline-offset-4 decoration-highlight/30">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </>
    );
};

export default Register;
