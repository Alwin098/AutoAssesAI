import React, { useEffect, useState } from 'react';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';

const StudentAssessments = () => {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssessments = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const studentId = user._id;

                if (!studentId) {
                    setLoading(false);
                    return;
                }

                const { data } = await api.get(`/assessments/student/${studentId}`);
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
            <Sidebar role="student" />

            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="p-8 max-w-7xl mx-auto"
            >
                <header className="mb-12">
                    <h1 className="text-4xl font-extrabold text-white font-heading tracking-tight">Available Assessments</h1>
                    <p className="text-secondary mt-1 font-medium italic">Choose an assessment to begin</p>
                </header>

                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-10 opacity-30">
                        {[1, 2].map(i => <Card key={i} className="h-44 animate-pulse" />)}
                    </div>
                ) : assessments.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center py-20 text-center border-dashed border-2 border-muted/50 bg-transparent rounded-3xl">
                        <CheckCircle className="text-muted mb-4 opacity-50" size={64} />
                        <p className="text-white font-black text-xl uppercase tracking-widest">All Assessments Completed</p>
                        <p className="text-secondary font-medium mt-2">Check back soon for new assignments.</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {assessments.map((assessment) => (
                            <Card key={assessment._id} hover={true} className="group overflow-hidden relative p-10">
                                <div className="absolute top-0 left-0 w-2 h-full bg-highlight opacity-30 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex justify-between items-start mb-8 pl-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest border bg-highlight/10 text-highlight border-highlight/20">
                                                {assessment.subject}
                                            </span>
                                            <span className="text-[10px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest border border-muted/30 text-secondary">
                                                {assessment.grade}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white group-hover:text-highlight transition-colors font-heading leading-tight tracking-tight">{assessment.title}</h3>
                                        <p className="text-sm font-medium text-secondary italic">Instructed by <span className="text-white font-bold not-italic">{assessment.createdBy?.name || 'Faculty'}</span></p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-2 justify-end text-highlight font-black text-xs uppercase tracking-widest mb-2 px-3 py-1 bg-highlight/5 rounded-lg border border-highlight/10">
                                            <Clock size={14} />
                                            <span>20m</span>
                                        </div>
                                        <p className="text-[10px] text-muted font-bold uppercase tracking-[0.2em]">{assessment.questions?.length || 0} Items</p>
                                    </div>
                                </div>

                                <div className="mt-8 pl-4">
                                    <Link to={`/student/take/${assessment._id}`} className="w-full">
                                        <Button className="w-full py-4 text-lg font-black shadow-highlight/30 hover:shadow-highlight/50 active:scale-[0.98]">
                                            Start Assessment
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

export default StudentAssessments;
