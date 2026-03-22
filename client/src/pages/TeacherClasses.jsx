import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Plus, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const TeacherClasses = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form state
    const [className, setClassName] = useState('');
    const [subject, setSubject] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchClasses = async () => {
        try {
            if (!user?._id) return;
            setLoading(true);
            const { data } = await api.get(`/class/teacher/${user._id}`);
            setClasses(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch classes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, [user?._id]);

    const handleCreateClass = async (e) => {
        e.preventDefault();

        // Input validation
        if (!className || !subject) {
            alert('Please fill all fields');
            return;
        }

        console.log("Sending:", { className, subject });

        try {
            setSubmitting(true);
            const res = await api.post('/class/create', {
                name: className,
                subject,
            });
            console.log("Class created:", res.data);
            setIsModalOpen(false);
            setClassName('');
            setSubject('');
            fetchClasses();
        } catch (error) {
            console.error("Create class error:", error.response?.data || error.message);
            alert(error.response?.data?.message || 'Failed to create class. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-primary pl-64 text-secondary font-body overflow-x-hidden">
            <Sidebar role="teacher" />

            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="p-8 max-w-7xl mx-auto"
            >
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-extrabold text-white font-heading tracking-tight">My Classes</h1>
                        <p className="text-secondary mt-1 font-medium italic">Manage your classrooms and students</p>
                    </div>
                    <Button className="px-8 py-4 text-lg" onClick={() => setIsModalOpen(true)}>
                        <Plus size={20} className="mr-2" /> Create Class
                    </Button>
                </header>

                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-extrabold text-white font-heading">Active Classes</h2>
                    <div className="h-px bg-muted/20 flex-1 mx-6"></div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-10 opacity-30">
                        {[1, 2].map(i => <Card key={i} className="h-40 animate-pulse" />)}
                    </div>
                ) : classes.length === 0 ? (
                    <div className="text-center py-20 bg-accent/5 rounded-3xl border border-dashed border-muted/30">
                        <p className="text-secondary font-medium mb-6">You haven't created any classes yet.</p>
                        <Button variant="outline" className="mx-auto font-bold border-2 px-8" onClick={() => setIsModalOpen(true)}>
                            Create Your First Class
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {classes.map((cls) => (
                            <Card 
                                key={cls._id} 
                                hover={true} 
                                className="group relative overflow-hidden cursor-pointer"
                                onClick={() => {
                                    console.log("Clicked class ID:", cls._id);
                                    navigate(`/teacher/class/${cls._id}`);
                                }}
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Users size={80} />
                                </div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest border bg-highlight/10 text-highlight border-highlight/20">
                                                {cls.subject}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white group-hover:text-highlight transition-colors font-heading tracking-tight">{cls.name}</h3>
                                        <div className="inline-flex items-center gap-2 mt-1 py-1 px-3 bg-accent/10 rounded-lg border border-muted/20">
                                            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Class Code:</span>
                                            <span className="text-sm font-black text-white tracking-[0.2em]">{cls.classCode}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-black text-white font-heading">{cls.students?.length || 0}</p>
                                        <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Students</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </motion.main>

            {/* Create Class Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-surface border border-muted/30 rounded-3xl p-8 max-w-md w-full shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-black text-white font-heading">Create New Class</h2>
                            </div>
                            
                            <form onSubmit={handleCreateClass} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Class Name</label>
                                    <input 
                                        type="text"
                                        required
                                        value={className}
                                        onChange={(e) => setClassName(e.target.value)}
                                        placeholder="e.g. Physics 101"
                                        className="w-full bg-accent/5 border border-muted/30 rounded-xl px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Subject</label>
                                    <input 
                                        type="text"
                                        required
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="e.g. Science"
                                        className="w-full bg-accent/5 border border-muted/30 rounded-xl px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:border-highlight focus:ring-1 focus:ring-highlight transition-all"
                                    />
                                </div>
                                
                                <div className="flex gap-4 pt-4">
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        className="flex-1 border-muted/30 text-secondary hover:text-white"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        className="flex-1"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Creating...' : 'Create Class'}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeacherClasses;
