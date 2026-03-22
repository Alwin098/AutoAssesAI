import React, { useEffect, useState, useContext } from 'react';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const StudentClasses = () => {
    const { user } = useContext(AuthContext);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                if (!user?._id) return;
                setLoading(true);
                const { data } = await api.get(`/class/student/${user._id}`);
                setClasses(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch classes");
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, [user?._id]);

    return (
        <div className="min-h-screen bg-primary pl-64 text-secondary font-body overflow-x-hidden">
            <Sidebar role="student" />

            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="p-8 max-w-7xl mx-auto"
            >
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-extrabold text-white font-heading tracking-tight">My Classes</h1>
                        <p className="text-secondary mt-1 font-medium italic">Classes you have successfully joined</p>
                    </div>
                    <Link to="/student/join">
                        <Button className="px-8 py-4 text-lg">
                            Join New Class
                        </Button>
                    </Link>
                </header>

                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-extrabold text-white font-heading">Enrolled Classes</h2>
                    <div className="h-px bg-muted/20 flex-1 mx-6"></div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-10 opacity-30">
                        {[1, 2].map(i => <Card key={i} className="h-40 animate-pulse" />)}
                    </div>
                ) : classes.length === 0 ? (
                    <div className="text-center py-20 bg-accent/5 rounded-3xl border border-dashed border-muted/30">
                        <p className="text-secondary font-medium mb-6">You aren't enrolled in any classes yet.</p>
                        <Link to="/student/join">
                            <Button variant="outline" className="mx-auto font-bold border-2 px-8">
                                Enter a Class Code
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {classes.map((cls) => (
                            <Card key={cls._id} hover={true} className="group relative overflow-hidden">
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
                                        <p className="text-sm font-bold text-secondary italic">Instructor: <span className="text-white font-bold not-italic">{cls.teacherId?.name || 'Faculty'}</span></p>
                                    </div>
                                    <div className="text-right">
                                        <div className="inline-flex items-center gap-1 mt-1 py-1 px-2 bg-accent/10 rounded-lg border border-muted/20">
                                            <Users size={12} className="text-secondary" />
                                            <span className="text-xs font-black text-white tracking-widest">{cls.students?.length || 0}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-muted/10 flex justify-between items-center">
                                    <span className="text-xs font-medium text-secondary italic">Code: <span className="font-bold text-white tracking-[0.2em]">{cls.classCode}</span></span>
                                    <Link to={`/student/assessments`}>
                                        <Button variant="ghost" className="text-xs uppercase tracking-[0.2em] font-black px-4 hover:text-white">
                                            View Assessments
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

export default StudentClasses;
