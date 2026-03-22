import React, { useEffect, useState } from 'react';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Plus, Clock, FileText, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';

const TeacherDashboard = () => {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssessments = async () => {
            try {
                const { data } = await api.get('/assessments/teacher');
                setAssessments(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch assessments");
            } finally {
                setLoading(false);
            }
        };
        fetchAssessments();
    }, []);

    return (
        <div className="min-h-screen bg-primary pl-64 text-secondary font-body">
            <Sidebar role="teacher" />

            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="p-8 max-w-7xl mx-auto"
            >
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-extrabold text-white font-heading tracking-tight">Teacher Dashboard</h1>
                        <p className="text-secondary mt-1 font-medium italic">Empower students with intelligent assessments</p>
                    </div>
                    <Link to="/teacher/create">
                        <Button className="px-8 py-4 text-lg">
                            <Plus size={20} className="mr-2" /> New Assessment
                        </Button>
                    </Link>
                </header>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <Card>
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-highlight/10 rounded-2xl flex items-center justify-center text-highlight">
                                <FileText size={28} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-white font-heading">{assessments.length}</h3>
                                <p className="text-xs font-bold text-secondary uppercase tracking-widest">Total Created</p>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-blue-400/10 rounded-2xl flex items-center justify-center text-blue-400">
                                <Clock size={28} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-white font-heading">0</h3>
                                <p className="text-xs font-bold text-secondary uppercase tracking-widest">Pending Review</p>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-emerald-400/10 rounded-2xl flex items-center justify-center text-emerald-400">
                                <User size={28} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-white font-heading">0</h3>
                                <p className="text-xs font-bold text-secondary uppercase tracking-widest">Active Learners</p>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-extrabold text-white font-heading">Recent Assessments</h2>
                    <div className="h-px bg-muted/20 flex-1 mx-6"></div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-10 opacity-30">
                        {[1, 2].map(i => <Card key={i} className="h-40 animate-pulse" />)}
                    </div>
                ) : assessments.length === 0 ? (
                    <div className="text-center py-20 bg-accent/5 rounded-3xl border border-dashed border-muted/30">
                        <p className="text-secondary font-medium mb-6">You haven't generated any assessments yet.</p>
                        <Link to="/teacher/create">
                            <Button variant="outline" className="mx-auto font-bold border-2 px-8">Create First AI Assessment</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {assessments.map((assessment) => (
                            <Card key={assessment._id} hover={true} className="group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <FileText size={80} />
                                </div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest border
                                                ${assessment.difficulty === 'hard' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                    assessment.difficulty === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                        'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                                                {assessment.difficulty}
                                            </span>
                                            <span className="text-[10px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest border bg-highlight/10 text-highlight border-highlight/20">Grade {assessment.grade}</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white group-hover:text-highlight transition-colors font-heading tracking-tight">{assessment.title}</h3>
                                        <p className="text-sm font-bold text-secondary uppercase tracking-tighter">{assessment.subject}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-black text-white font-heading">{assessment.questions.length}</p>
                                        <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Items</p>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-muted/10 flex justify-between items-center">
                                    <span className="text-xs font-medium text-secondary italic">Topic: {assessment.topic}</span>
                                    <Link to={`/teacher/assessment/${assessment._id}`}>
                                        <Button variant="ghost" className="text-xs uppercase tracking-[0.2em] font-black px-4 hover:text-white">
                                            View Details
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </motion.main>
        </div>
    );
};

export default TeacherDashboard;
