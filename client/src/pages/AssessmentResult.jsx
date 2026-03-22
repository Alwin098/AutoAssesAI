import React, { useState, useEffect } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../api/axios';

const AssessmentResult = () => {
    const { state } = useLocation();
    const { id } = useParams(); // Get submission ID from URL
    const [submission, setSubmission] = useState(state?.submission || null);
    const [assessment, setAssessment] = useState(state?.assessment || null);
    const [expanded, setExpanded] = useState({});
    const [loading, setLoading] = useState(!state?.submission);
    const [error, setError] = useState(null);

    useEffect(() => {
        // If we have data from navigation state, no need to fetch
        if (state?.submission && state?.assessment) {
            setLoading(false);
            return;
        }

        // Otherwise, fetch submission by ID
        const fetchSubmission = async () => {
            if (!id) {
                setError('No submission ID provided');
                setLoading(false);
                return;
            }

            try {
                const { data } = await api.get(`/submissions/${id}`);
                setSubmission(data);

                // Fetch assessment details if not populated
                if (data.assessmentId && typeof data.assessmentId === 'string') {
                    const assessmentResponse = await api.get(`/assessments/${data.assessmentId}`);
                    setAssessment(assessmentResponse.data);
                } else {
                    setAssessment(data.assessmentId);
                }
            } catch (err) {
                console.error('Failed to fetch submission:', err);
                setError('Failed to load submission details');
            } finally {
                setLoading(false);
            }
        };

        fetchSubmission();
    }, [id, state]);

    if (loading) {
        return (
            <div className="min-h-screen bg-primary pl-64 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-highlight mx-auto mb-4"></div>
                    <p className="text-secondary">Loading results...</p>
                </div>
            </div>
        );
    }

    if (error || !submission || !assessment) {
        return (
            <div className="min-h-screen bg-primary pl-64 flex items-center justify-center p-4">
                <Card className="max-w-md text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Unable to Load Results</h2>
                    <p className="text-secondary mb-6">{error || 'No result data found. Please complete an assessment first.'}</p>
                    <Link to="/student/results">
                        <Button>View All Results</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    const toggleExpand = (id) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const percentage = Math.round((submission.totalScore / submission.maxScore) * 100);
    const passed = percentage >= 40;

    return (
        <div className="min-h-screen bg-primary pl-64 text-text">
            <Sidebar role="student" />

            <main className="p-8">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Assessment Results</h1>
                        <p className="text-gray-400">{assessment.title} • {assessment.subject}</p>
                    </div>
                    <Link to="/student">
                        <Button variant="outline">Back to Dashboard</Button>
                    </Link>
                </div>

                {/* Score Card */}
                <Card className="mb-8 text-center py-10">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-accent mb-4 relative">
                        <span className="text-4xl font-bold text-white">{percentage}%</span>
                        {passed ? (
                            <div className="absolute -bottom-2 bg-green-500 text-primary text-xs font-bold px-2 py-1 rounded-full">PASSED</div>
                        ) : (
                            <div className="absolute -bottom-2 bg-red-500 text-primary text-xs font-bold px-2 py-1 rounded-full">FAILED</div>
                        )}
                    </div>
                    <p className="text-2xl text-white font-medium">You scored {submission.totalScore} out of {submission.maxScore}</p>
                    <p className="text-gray-400 mt-2">AI Grading Complete</p>
                </Card>

                <h2 className="text-xl font-bold text-white mb-6">Detailed Analysis</h2>

                <div className="space-y-4">
                    {submission.responses.map((resp, idx) => {
                        const question = assessment.questions.find(q => q._id === resp.questionId);
                        const isExpanded = expanded[resp.questionId];

                        return (
                            <Card key={resp.questionId} className="p-0 overflow-hidden">
                                <div
                                    className="p-6 cursor-pointer flex justify-between items-start hover:bg-white/5 transition"
                                    onClick={() => toggleExpand(resp.questionId)}
                                >
                                    <div className="flex gap-4">
                                        <span className="font-bold text-gray-500 flex-shrink-0">Q{idx + 1}</span>
                                        <div>
                                            <p className="text-white font-medium mb-2">{question?.questionText}</p>
                                            <div className="flex items-center gap-2">
                                                {resp.aiScore > 0 ? <CheckCircle size={16} className="text-green-400" /> : <XCircle size={16} className="text-red-400" />}
                                                <span className={`text-sm ${resp.aiScore > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                    Score: {resp.aiScore} / {question?.maxMarks || 5}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {isExpanded ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
                                </div>

                                {isExpanded && (
                                    <div className="px-6 pb-6 pt-0 bg-black/20 border-t border-white/5">
                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-red-500/5 p-4 rounded-lg border border-red-500/10">
                                                <p className="text-xs text-red-300 font-bold mb-1 uppercase">Your Answer</p>
                                                <p className="text-gray-300">{resp.studentAnswer}</p>
                                            </div>
                                            <div className="bg-green-500/5 p-4 rounded-lg border border-green-500/10">
                                                <p className="text-xs text-green-300 font-bold mb-1 uppercase">AI Feedback</p>
                                                <p className="text-gray-300">{resp.aiFeedback}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 bg-blue-500/5 p-4 rounded-lg border border-blue-500/10">
                                            <p className="text-xs text-blue-300 font-bold mb-1 uppercase">Correct Answer / Reference</p>
                                            <p className="text-gray-400 text-sm">{question?.correctAnswer || 'Reference provided in feedback'}</p>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default AssessmentResult;
