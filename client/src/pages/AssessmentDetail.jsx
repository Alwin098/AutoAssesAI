import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeft, FileText, Calendar, User as UserIcon, Users, Award, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';

const AssessmentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [assessment, setAssessment] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [assessRes, subRes] = await Promise.all([
                    api.get(`/assessments/${id}`),
                    api.get(`/submissions/assessment/${id}`),
                ]);
                setAssessment(assessRes.data);
                setSubmissions(Array.isArray(subRes.data) ? subRes.data : []);
            } catch (error) {
                console.error("Failed to fetch assessment details");
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-primary pl-64 text-text">
                <Sidebar role="teacher" />
                <main className="p-8">
                    <div className="text-center py-20 text-gray-500">Loading assessment...</div>
                </main>
            </div>
        );
    }

    if (!assessment) {
        return (
            <div className="min-h-screen bg-primary pl-64 text-text">
                <Sidebar role="teacher" />
                <main className="p-8">
                    <div className="text-center py-20">
                        <p className="text-gray-400 mb-4">Assessment not found</p>
                        <Link to="/teacher">
                            <Button variant="outline">Back to Dashboard</Button>
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary pl-64 text-secondary font-body">
            <Sidebar role="teacher" />

            <main className="p-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <button
                        onClick={() => navigate('/teacher')}
                        className="flex items-center gap-2 text-secondary hover:text-highlight transition-all mb-6 group font-semibold"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </button>

                    <div className="flex justify-between items-end">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border
                                    ${assessment.difficulty === 'hard' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                        assessment.difficulty === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                            'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                                    {assessment.difficulty}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border bg-highlight/10 text-highlight border-highlight/20">Grade {assessment.grade}</span>
                            </div>
                            <h1 className="text-4xl font-extrabold text-white font-heading tracking-tight">{assessment.title}</h1>
                            <p className="text-secondary font-medium tracking-wide">{assessment.subject} • Assessment ID: {id.slice(-6).toUpperCase()}</p>
                        </div>
                    </div>
                </div>

                {/* Assessment Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">{assessment.questions?.length || 0}</h3>
                                <p className="text-sm text-gray-400">Total Questions</p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">
                                    {new Date(assessment.createdAt).toLocaleDateString()}
                                </h3>
                                <p className="text-sm text-gray-400">Created On</p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
                                <Users size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">{submissions.length}</h3>
                                <p className="text-sm text-gray-400">Student Attempts</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Topic */}
                <Card className="mb-12 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-highlight/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <h2 className="text-xl font-bold text-white mb-3 font-heading flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-highlight rounded-full"></div>
                        Description & Topic
                    </h2>
                    <p className="text-secondary leading-relaxed font-medium">{assessment.topic}</p>
                </Card>

                {/* Questions */}
                <div>
                    <h2 className="text-3xl font-extrabold text-white mb-8 font-heading flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-highlight rounded-full"></div>
                        Assessment Structure
                    </h2>
                    <div className="space-y-8">
                        {assessment.questions?.map((question, index) => (
                            <motion.div
                                key={question._id || index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="border-l-4 border-highlight hover:shadow-highlight/5 transition-all p-8 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-highlight/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-highlight/10 transition-colors"></div>
                                    <div className="mb-6 relative">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-black text-white font-heading">
                                                Question {index + 1}
                                            </h3>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] px-2 py-1 bg-highlight/10 border border-highlight/20 rounded-md text-highlight font-bold uppercase tracking-widest">
                                                    {question.type}
                                                </span>
                                                <span className="text-xs font-bold text-secondary uppercase tracking-tighter">
                                                    {question.maxMarks || 5} Marks
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-white text-lg font-medium leading-relaxed">{question.questionText}</p>
                                    </div>

                                    {/* MCQ Options */}
                                    {question.type === 'mcq' && question.options && question.options.length > 0 && (
                                        <div className="mb-8">
                                            <p className="text-xs font-bold text-muted uppercase tracking-widest mb-4">Multiple Choice Options</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {question.options.map((option, optIndex) => {
                                                    const isCorrect = question.correctAnswer === option ||
                                                        question.correctAnswer === String.fromCharCode(65 + optIndex);
                                                    return (
                                                        <div
                                                            key={optIndex}
                                                            className={`p-4 rounded-xl border-2 transition-all font-medium flex items-center gap-4 ${isCorrect ? 'bg-highlight/10 border-highlight/40 text-highlight' : 'bg-primary/30 border-muted/20 text-secondary'}`}
                                                        >
                                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${isCorrect ? 'bg-highlight text-primary' : 'bg-muted/20 text-muted'}`}>
                                                                {String.fromCharCode(65 + optIndex)}
                                                            </div>
                                                            {option}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Correct Answer / Guidance */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-muted/10">
                                        {question.correctAnswer && question.type !== 'mcq' && (
                                            <div>
                                                <p className="text-xs font-bold text-muted uppercase tracking-widest mb-2">Ideal Response</p>
                                                <div className="p-4 bg-highlight/5 border border-highlight/20 rounded-xl text-highlight font-medium leading-relaxed">
                                                    {question.correctAnswer}
                                                </div>
                                            </div>
                                        )}

                                        {question.markingScheme && (
                                            <div>
                                                <p className="text-xs font-bold text-muted uppercase tracking-widest mb-2">Scoring Rubric</p>
                                                <div className="p-4 bg-surface/50 border border-muted/20 rounded-xl text-secondary text-sm font-medium leading-relaxed italic">
                                                    {question.markingScheme}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Student Performance Section */}
                <div className="mt-16">
                    <h2 className="text-3xl font-extrabold text-white mb-8 font-heading flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-highlight rounded-full"></div>
                        Student Attempts
                        <span className="text-sm font-bold bg-highlight/20 text-highlight px-3 py-1 rounded-full ml-2">
                            {submissions.length}
                        </span>
                    </h2>

                    {submissions.length === 0 ? (
                        <div className="text-center py-16 bg-accent/5 rounded-3xl border border-dashed border-muted/30">
                            <Users size={48} className="mx-auto text-muted mb-4 opacity-50" />
                            <p className="text-secondary font-medium">No students have attempted this assessment yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {submissions.map((sub, index) => {
                                const pct = sub.maxScore > 0 ? Math.round((sub.totalScore / sub.maxScore) * 100) : 0;
                                const scoreColor = pct >= 75 ? 'text-emerald-400' : pct >= 50 ? 'text-yellow-400' : 'text-red-400';
                                const barColor = pct >= 75 ? 'bg-emerald-400' : pct >= 50 ? 'bg-yellow-400' : 'bg-red-400';
                                return (
                                    <motion.div
                                        key={sub._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-highlight/20 to-highlight/5 border border-highlight/20 flex items-center justify-center shrink-0">
                                                    <span className="text-highlight font-bold text-sm">
                                                        {sub.studentId?.name?.charAt(0).toUpperCase() || '?'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white">{sub.studentId?.name || 'Unknown Student'}</p>
                                                    <p className="text-xs text-muted">{sub.studentId?.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6 sm:ml-auto">
                                                <div className="w-32">
                                                    <div className="flex justify-between text-xs text-muted mb-1">
                                                        <span>Score</span>
                                                        <span>{pct}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-muted/20 rounded-full overflow-hidden">
                                                        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }}></div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-2xl font-black font-heading ${scoreColor}`}>
                                                        {sub.totalScore}<span className="text-sm font-bold text-muted">/{sub.maxScore}</span>
                                                    </p>
                                                </div>
                                                <div className="text-xs text-muted whitespace-nowrap">
                                                    {new Date(sub.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AssessmentDetail;
