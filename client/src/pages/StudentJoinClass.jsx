import React, { useState } from 'react';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { LogIn, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

const StudentJoinClass = () => {
    const [classCode, setClassCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleJoinClass = async (e) => {
        e.preventDefault();
        
        if (!classCode.trim()) {
            setMessage({ text: 'Please enter a valid class code.', type: 'error' });
            return;
        }

        try {
            setLoading(true);
            setMessage({ text: '', type: '' });
            
            const { data } = await api.post('/class/join', { classCode: classCode.trim().toUpperCase() });
            
            setMessage({ text: `Success! You have joined ${data.class?.name || 'the class'}.`, type: 'success' });
            setClassCode('');
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to join class. Please check the code and try again.';
            setMessage({ text: errorMsg, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-primary pl-64 text-secondary font-body overflow-x-hidden">
            <Sidebar role="student" />

            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="p-8 max-w-7xl mx-auto"
            >
                <header className="mb-12">
                    <h1 className="text-4xl font-extrabold text-white font-heading tracking-tight">Join a Class</h1>
                    <p className="text-secondary mt-1 font-medium italic">Enter the unique code provided by your instructor</p>
                </header>

                <div className="max-w-2xl mt-12">
                    <Card className="p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                            <LogIn size={120} />
                        </div>
                        
                        <h2 className="text-2xl font-bold text-white font-heading mb-6 tracking-tight">Enter Class Code</h2>
                        
                        <form onSubmit={handleJoinClass} className="space-y-6 relative z-10">
                            <div>
                                <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-3">
                                    Class Code
                                </label>
                                <input 
                                    type="text"
                                    required
                                    value={classCode}
                                    onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                                    placeholder="e.g. A1B2C3D"
                                    className="w-full bg-accent/5 border-2 border-muted/30 rounded-2xl px-6 py-4 text-white text-xl uppercase tracking-widest placeholder:tracking-normal placeholder:lowercase placeholder:text-muted focus:outline-none focus:border-highlight focus:ring-4 focus:ring-highlight/20 transition-all font-black"
                                    maxLength={8}
                                />
                            </div>

                            <AnimatePresence mode="wait">
                                {message.text && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, height: 0 }}
                                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                                        exit={{ opacity: 0, y: -10, height: 0 }}
                                        className={`flex items-start gap-3 p-4 rounded-xl border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}
                                    >
                                        {message.type === 'success' ? <CheckCircle size={20} className="shrink-0 mt-0.5" /> : <AlertCircle size={20} className="shrink-0 mt-0.5" />}
                                        <p className="text-sm font-bold leading-relaxed">{message.text}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            
                            <div className="pt-4">
                                <Button 
                                    type="submit" 
                                    className="w-full py-4 text-lg font-black shadow-highlight/30 hover:shadow-highlight/50 active:scale-[0.98]"
                                    disabled={loading || !classCode.trim()}
                                >
                                    {loading ? 'Joining...' : 'Join Class'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </motion.main>
        </div>
    );
};

export default StudentJoinClass;
