import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Timer, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const TakeAssessment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [assessment, setAssessment] = useState(null);
    const [currentInfo, setCurrentInfo] = useState(true); // Show info screen first
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionId: answer }
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchAssessment = async () => {
            try {
                const { data } = await api.get(`/assessments/${id}`);
                setAssessment(data);
            } catch (error) {
                alert('Assessment not found');
                navigate('/student');
            }
        };
        fetchAssessment();
    }, [id, navigate]);

    const handleAnswer = (val) => {
        if (!assessment) return;
        const qId = assessment.questions[currentQuestion]._id;
        setAnswers({ ...answers, [qId]: val });
    };

    const nextQuestion = () => {
        if (currentQuestion < assessment.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const prevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const submitTest = async () => {
        if (!window.confirm("Are you sure you want to submit?")) return;

        setSubmitting(true);
        // Transform answers to API format
        const formattedResponses = Object.keys(answers).map(qId => ({
            questionId: qId,
            studentAnswer: answers[qId]
        }));

        try {
            const { data } = await api.post('/assessments/submit', {
                assessmentId: id,
                responses: formattedResponses
            });
            // Redirect to results with state
            navigate('/student/results', { state: { submission: data, assessment } });
        } catch (error) {
            console.error(error);
            alert('Submission failed.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!assessment) return <div className="p-10 text-white">Loading Test...</div>;

    if (currentInfo) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center p-4">
                <Card className="max-w-xl text-center">
                    <h1 className="text-3xl font-bold text-white mb-4">{assessment.title}</h1>
                    <div className="text-gray-400 space-y-2 mb-8">
                        <p>Subject: {assessment.subject}</p>
                        <p>Questions: {assessment.questions.length}</p>
                        <p>Please do not switch tabs during the test.</p>
                    </div>
                    <Button onClick={() => setCurrentInfo(false)} className="w-full">Start Test</Button>
                </Card>
            </div>
        )
    }

    const question = assessment.questions[currentQuestion];
    const isLast = currentQuestion === assessment.questions.length - 1;

    return (
        <div className="min-h-screen bg-primary text-text flex flex-col">
            {/* Header */}
            <div className="bg-secondary px-8 py-4 flex justify-between items-center border-b border-white/5">
                <div>
                    <h2 className="font-bold text-white">{assessment.title}</h2>
                    <p className="text-xs text-gray-500">Question {currentQuestion + 1} of {assessment.questions.length}</p>
                </div>
                <div className="flex items-center gap-2 text-accent bg-accent/10 px-3 py-1 rounded-full">
                    <Timer size={16} />
                    <span className="text-sm font-mono font-bold">Live</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-6">
                <Card className="w-full max-w-3xl min-h-[400px] flex flex-col">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentQuestion}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="flex-1"
                        >
                            <span className="inline-block px-2 py-1 bg-white/5 rounded text-xs text-gray-400 mb-4 uppercase">
                                {question.type === 'mcq' ? 'Multiple Choice' : question.type}
                            </span>
                            <h3 className="text-xl font-medium text-white mb-6 leading-relaxed">
                                {question.questionText}
                            </h3>

                            {question.type === 'mcq' ? (
                                <div className="space-y-3">
                                    {question.options.map((opt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswer(opt)}
                                            className={`w-full text-left p-4 rounded-lg border transition-all ${answers[question._id] === opt
                                                    ? 'bg-accent/20 border-accent text-white'
                                                    : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'
                                                }`}
                                        >
                                            <span className="font-bold mr-3 text-gray-500">{String.fromCharCode(65 + idx)}.</span>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <textarea
                                    className="w-full h-48 bg-[#051F1D] border border-white/10 rounded-lg p-4 text-white focus:border-accent outline-none font-mono"
                                    placeholder="Type your answer here..."
                                    value={answers[question._id] || ''}
                                    onChange={(e) => handleAnswer(e.target.value)}
                                ></textarea>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-between items-center pt-8 mt-4 border-t border-white/5">
                        <Button variant="ghost" onClick={prevQuestion} disabled={currentQuestion === 0}>
                            Previous
                        </Button>

                        {isLast ? (
                            <Button onClick={submitTest} loading={submitting}>
                                Submit Assessment
                            </Button>
                        ) : (
                            <Button onClick={nextQuestion}>
                                Next Question
                            </Button>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default TakeAssessment;
