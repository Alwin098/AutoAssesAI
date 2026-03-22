import React, { useEffect, useState } from 'react';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FileText, Calendar, Award, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';

const StudentResults = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const { data } = await api.get('/submissions/my-results');
                setSubmissions(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Failed to fetch results:', err);
                setError('Failed to load your results. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const calculatePercentage = (score, max) => {
        if (!max || max === 0) return 0;
        return Math.round((score / max) * 100);
    };

    return (
        <div className="min-h-screen bg-primary pl-64 text-secondary font-body">
            <Sidebar role="student" />

            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="p-8 max-w-7xl mx-auto"
            >
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2 font-heading">My Results</h1>
                    <p className="text-secondary">View your assessment performance and detailed feedback</p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-highlight mx-auto mb-4"></div>
                            <p className="text-secondary">Loading your results...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <Card className="text-center py-12">
                        <p className="text-red-400 mb-4">{error}</p>
                        <Button onClick={() => window.location.reload()}>Retry</Button>
                    </Card>
                )}

                {/* Empty State */}
                {!loading && !error && submissions.length === 0 && (
                    <Card className="text-center py-16">
                        <FileText className="mx-auto mb-4 text-muted" size={64} />
                        <h3 className="text-xl font-semibold text-white mb-2">No Results Yet</h3>
                        <p className="text-secondary mb-6">
                            You haven't completed any assessments yet. Start taking assessments to see your results here.
                        </p>
                        <Link to="/student">
                            <Button>Browse Assessments</Button>
                        </Link>
                    </Card>
                )}

                {/* Results List */}
                {!loading && !error && submissions.length > 0 && (
                    <div className="space-y-4">
                        {submissions.map((submission, index) => {
                            const percentage = calculatePercentage(submission.totalScore, submission.maxScore);
                            const assessmentTitle = submission.assessmentId?.title || 'Untitled Assessment';
                            const assessmentSubject = submission.assessmentId?.subject || 'N/A';

                            return (
                                <motion.div
                                    key={submission._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
                                >
                                    <Card hover className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-start gap-4">
                                                    {/* Score Badge */}
                                                    <div className="flex-shrink-0">
                                                        <div className={`w-20 h-20 rounded-lg flex flex-col items-center justify-center ${percentage >= 75 ? 'bg-green-500/20 border border-green-500/30' :
                                                                percentage >= 50 ? 'bg-yellow-500/20 border border-yellow-500/30' :
                                                                    'bg-red-500/20 border border-red-500/30'
                                                            }`}>
                                                            <span className={`text-2xl font-bold ${percentage >= 75 ? 'text-green-400' :
                                                                    percentage >= 50 ? 'text-yellow-400' :
                                                                        'text-red-400'
                                                                }`}>
                                                                {percentage}%
                                                            </span>
                                                            <span className="text-xs text-secondary">
                                                                {submission.totalScore}/{submission.maxScore}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Assessment Info */}
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-semibold text-white mb-1">
                                                            {assessmentTitle}
                                                        </h3>
                                                        <div className="flex items-center gap-4 text-sm text-secondary">
                                                            <span className="flex items-center gap-1">
                                                                <FileText size={14} />
                                                                {assessmentSubject}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Calendar size={14} />
                                                                {formatDate(submission.createdAt)}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Award size={14} />
                                                                {submission.responses?.length || 0} Questions
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* View Details Button */}
                                            <Link to={`/student/result/${submission._id}`}>
                                                <Button variant="outline" className="flex items-center gap-2">
                                                    View Details
                                                    <ChevronRight size={16} />
                                                </Button>
                                            </Link>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </motion.main>
        </div>
    );
};

export default StudentResults;
