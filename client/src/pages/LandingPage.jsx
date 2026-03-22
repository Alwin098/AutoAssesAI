import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Users, CheckCircle, ArrowRight, Sparkles, BookOpen, GraduationCap, Award } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-primary text-secondary overflow-hidden font-body">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-highlight/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[700px] h-[700px] bg-accent/20 rounded-full blur-[140px]"></div>
            </div>

            {/* Hero Section */}
            <div className="relative z-10 container mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[85vh]">
                    {/* Left Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-highlight/10 border border-highlight/20 rounded-full mb-8 shadow-[0_0_20px_rgba(12,150,156,0.1)]"
                        >
                            <Sparkles size={14} className="text-highlight" />
                            <span className="text-xs text-highlight font-bold uppercase tracking-widest">Empowering Next-Gen Learning</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[0.9] font-heading tracking-tighter"
                        >
                            AI That <br />
                            <span className="text-highlight">Understands</span> <br />
                            Education.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="text-xl text-secondary mb-10 leading-relaxed max-w-xl font-medium"
                        >
                            Professional assessment creation for teachers, personalized growth for students.
                            Built specifically for Indian institutions.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="flex flex-col sm:row gap-5"
                        >
                            <Link to="/register">
                                <Button className="px-10 py-5 text-xl font-bold rounded-2xl shadow-2xl shadow-highlight/20 transition-all hover:scale-105 active:scale-95">
                                    Get Started Free
                                    <ArrowRight size={22} className="ml-2" />
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="outline" className="px-10 py-5 text-xl font-bold rounded-2xl border-muted/50 hover:border-highlight hover:text-highlight transition-all">
                                    Login
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="mt-16 flex flex-wrap gap-8"
                        >
                            {[
                                { icon: CheckCircle, text: 'CBSE & ICSE Aligned' },
                                { icon: Brain, text: 'Dynamic AI Generation' },
                                { icon: GraduationCap, text: 'Instant Evaluation' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2.5">
                                    <item.icon size={18} className="text-highlight" />
                                    <span className="text-sm font-bold text-white uppercase tracking-widest">{item.text}</span>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right Column - Illustration Layer */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, delay: 0.3, ease: "circOut" }}
                        className="relative hidden lg:block"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-highlight/10 to-transparent rounded-full blur-[100px]"></div>
                        <div className="relative bg-surface/40 backdrop-blur-3xl rounded-[40px] p-16 border border-muted/20 shadow-2xl scale-110 translate-x-12">
                            <svg viewBox="0 0 400 400" className="w-full h-auto drop-shadow-2xl">
                                <defs>
                                    <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style={{ stopColor: '#0C969C', stopOpacity: 1 }} />
                                        <stop offset="100%" style={{ stopColor: '#0A7075', stopOpacity: 1 }} />
                                    </linearGradient>
                                </defs>
                                <circle cx="200" cy="200" r="150" fill="url(#heroGrad)" opacity="0.1" />
                                <rect x="80" y="80" width="240" height="240" rx="30" fill="#031716" stroke="#0C969C" strokeWidth="2" />
                                <rect x="110" y="120" width="100" height="10" rx="5" fill="#0C969C" />
                                <rect x="110" y="145" width="180" height="40" rx="10" fill="#032F30" />
                                <rect x="110" y="200" width="180" height="40" rx="10" fill="#032F30" />
                                <rect x="110" y="255" width="180" height="40" rx="10" fill="#032F30" />
                                <circle cx="270" cy="165" r="8" fill="#0C969C" />
                                <circle cx="270" cy="220" r="8" fill="#0C969C" />
                                <circle cx="200" cy="90" r="40" fill="#031716" stroke="#0C969C" strokeWidth="2" />
                                <path d="M 185,90 Q 200,75 215,90" fill="none" stroke="#0C969C" strokeWidth="3" />
                            </svg>
                        </div>
                    </motion.div>
                </div>

                {/* Performance Section */}
                <div className="mt-48">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-24"
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-white font-heading tracking-tight mb-4">Precision-Engineered Workflow</h2>
                        <p className="text-secondary text-xl font-medium italic">Intelligent tools designed for maximum efficiency</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { step: '01', icon: Brain, title: 'AI Generation', desc: 'Powerful Gemini engine creates domain-specific content in seconds.', color: 'text-highlight', bg: 'bg-highlight/10' },
                            { step: '02', icon: Users, title: 'Student Interaction', desc: 'Secure, clean testing environment optimized for any device.', color: 'text-blue-400', bg: 'bg-blue-400/10' },
                            { step: '03', icon: Award, title: 'Automated Grading', desc: 'Complex evaluation with constructive feedback and marking rubrics.', color: 'text-emerald-400', bg: 'bg-emerald-400/10' }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2, duration: 0.6 }}
                            >
                                <Card hover className="h-full border-muted/20 relative group overflow-hidden p-10">
                                    <div className="absolute top-4 right-6 text-6xl font-black text-muted/10 group-hover:text-highlight/10 transition-colors uppercase font-heading">{item.step}</div>
                                    <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mb-8 shadow-inner`}>
                                        <item.icon size={32} className={item.color} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4 font-heading">{item.title}</h3>
                                    <p className="text-secondary leading-relaxed font-medium">{item.desc}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Statistics / Trust Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-48 relative"
                >
                    <div className="absolute inset-0 bg-highlight/5 rounded-[50px] blur-[80px]"></div>
                    <Card className="bg-surface/50 backdrop-blur-2xl border-highlight/20 p-16 text-center border-2 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-highlight font-heading"></div>
                        <h3 className="text-3xl font-bold text-white mb-16 font-heading tracking-tight">The AutoAssesAI Difference</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-left">
                            {[
                                { title: 'Time Saved', stat: '90%', desc: 'Reduction in manual creation' },
                                { title: 'Feedback', stat: 'Instant', desc: 'Personalized student analytics' },
                                { title: 'Supported', stat: 'CBSE', desc: 'Aligned with Indian standards' },
                                { title: 'Accuracy', stat: 'AI-True', desc: 'Advanced prompt engineering' }
                            ].map((stat, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="text-4xl font-black text-highlight font-heading mb-1">{stat.stat}</div>
                                    <div className="text-lg font-bold text-white uppercase tracking-wider">{stat.title}</div>
                                    <p className="text-secondary font-medium">{stat.desc}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </motion.div>

                {/* Final Call to Action */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-48 mb-24 text-center max-w-4xl mx-auto"
                >
                    <h2 className="text-5xl md:text-6xl font-black text-white font-heading tracking-tight mb-8">Ready to Elevate <br />Your Classroom?</h2>
                    <p className="text-secondary text-xl mb-12 font-medium">Join hundreds of progressive educators who are reclaiming their time with AutoAssesAI.</p>
                    <Link to="/register">
                        <Button className="px-16 py-6 text-2xl font-black shadow-2xl shadow-highlight/40 group">
                            Start Your Journey
                            <ArrowRight size={28} className="ml-3 group-hover:translate-x-2 transition-transform" />
                        </Button>
                    </Link>
                </motion.div>
            </div>

            {/* Footer */}
            <footer className="relative z-10 border-t border-muted/20 py-16 bg-primary/80 backdrop-blur-lg">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-secondary">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="text-2xl font-black text-white font-heading">AutoAssesAI</div>
                        <p className="text-sm font-medium">Empowering the next generation with intelligence.</p>
                    </div>
                    <div className="text-sm font-bold tracking-[0.2em] uppercase opacity-40">
                        © 2026 Powered by Gemini AI
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
