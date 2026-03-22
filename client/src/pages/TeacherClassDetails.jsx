import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeft, Users, FileText, Plus, BookOpen, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const TeacherClassDetails = () => {
    const { classId } = useParams();
    console.log("URL classId:", classId);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [classDetails, setClassDetails] = useState(null);
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                // Fetch class details (populated with students)
                const classRes = await api.get(`/class/${classId}`);
                setClassDetails(classRes.data);

                // Fetch class-specific assessments
                const assRes = await api.get(`/assessments/class/${classId}`);
                setAssessments(assRes.data);
            } catch (error) {
                console.error("Failed to fetch class details", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?._id) {
            fetchDetails();
        }
    }, [classId, user?._id]);

    const handleCreateAssessment = () => {
        navigate('/teacher/create', { state: { predefinedClassId: classId } });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-primary pl-64 text-secondary font-body overflow-x-hidden">
                <Sidebar role="teacher" />
                <main className="p-8 max-w-7xl mx-auto h-full flex justify-center items-center">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-highlight border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-highlight font-bold">Loading class details...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (!classDetails) {
        return (
            <div className="min-h-screen bg-primary pl-64 text-secondary font-body overflow-x-hidden">
                <Sidebar role="teacher" />
                <main className="p-8 max-w-7xl mx-auto text-center py-20">
                    <h2 className="text-3xl font-bold text-white mb-4">Class Not Found</h2>
                    <Button onClick={() => navigate('/teacher/classes')}>Back to My Classes</Button>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary pl-64 text-secondary font-body overflow-x-hidden">
            <Sidebar role="teacher" />

            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="p-8 max-w-7xl mx-auto"
            >
                {/* Back Button */}
                <button
                    onClick={() => navigate('/teacher/classes')}
                    className="flex items-center gap-2 text-secondary hover:text-highlight transition-all mb-8 group font-semibold"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Classes
                </button>

                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs px-3 py-1 rounded-md font-black uppercase tracking-widest border bg-highlight/10 text-highlight border-highlight/20">
                                {classDetails.subject}
                            </span>
                            <div className="inline-flex items-center gap-2 py-1 px-3 bg-accent/10 rounded-lg border border-muted/20">
                                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Class Code:</span>
                                <span className="text-xs font-black text-white tracking-[0.2em]">{classDetails.classCode}</span>
                            </div>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-white font-heading tracking-tight">
                            {classDetails.name}
                        </h1>
                    </div>
                    <Button onClick={handleCreateAssessment} className="px-6 py-4 shadow-highlight/20">
                        <Plus size={20} className="mr-2" /> Create Assessment
                    </Button>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                    {/* Main Content (Assessments) */}
                    <div className="xl:col-span-2 space-y-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-extrabold text-white font-heading flex items-center gap-3">
                                <FileText className="text-highlight" size={24} />
                                Assessments
                            </h2>
                            <div className="h-px bg-muted/20 flex-1 mx-6"></div>
                        </div>

                        {assessments.length === 0 ? (
                            <div className="text-center py-16 bg-accent/5 rounded-3xl border border-dashed border-muted/30">
                                <FileText size={48} className="mx-auto text-muted mb-4 opacity-50" />
                                <p className="text-secondary font-medium mb-4">No assessments created for this class yet.</p>
                                <Button variant="outline" className="mx-auto" onClick={handleCreateAssessment}>
                                    Create First Assessment
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {assessments.map(assessment => (
                                    <Card key={assessment._id} hover className="border-highlight/10 cursor-pointer" onClick={() => navigate(`/teacher/assessment/${assessment._id}`)}>
                                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{assessment.title}</h3>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-xs font-bold text-muted uppercase tracking-wider">{assessment.difficulty}</span>
                                            <span className="w-1 h-1 rounded-full bg-muted"></span>
                                            <span className="text-xs font-bold text-muted">{assessment.questions?.length || 0} QM</span>
                                        </div>
                                        <p className="text-sm text-secondary line-clamp-2">{assessment.topic}</p>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar Content (Students) */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-extrabold text-white font-heading flex items-center gap-3">
                                <Users className="text-highlight" size={24} />
                                Students
                                <span className="text-sm font-bold bg-highlight/20 text-highlight px-3 py-1 rounded-full ml-auto">
                                    {classDetails.students?.length || 0}
                                </span>
                            </h2>
                        </div>

                        <Card className="p-0 overflow-hidden bg-surface/50 border-muted/20">
                            {classDetails.students?.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Users size={32} className="mx-auto text-muted mb-3 opacity-50" />
                                    <p className="text-sm text-secondary">No students have joined this class yet.</p>
                                    <p className="text-xs text-muted mt-2">Share the class code: <strong className="text-white">{classDetails.classCode}</strong></p>
                                </div>
                            ) : (
                                <div className="divide-y divide-muted/10 max-h-[500px] overflow-y-auto custom-scrollbar">
                                    {classDetails.students.map(student => (
                                        <div key={student._id} className="p-4 flex items-center gap-4 hover:bg-accent/5 transition-colors">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-highlight/20 to-highlight/5 border border-highlight/20 flex items-center justify-center shrink-0">
                                                <span className="text-highlight font-bold">{student.name.charAt(0).toUpperCase()}</span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-white font-bold truncate">{student.name}</p>
                                                <div className="flex items-center gap-1.5 text-muted text-xs mt-0.5">
                                                    <Mail size={12} />
                                                    <span className="truncate">{student.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>

                </div>
            </motion.main>
        </div>
    );
};

export default TeacherClassDetails;
