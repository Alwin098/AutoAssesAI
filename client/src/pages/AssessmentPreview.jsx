import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeft, Plus, Trash2, Save, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

// ─── Helpers ───────────────────────────────────────────────────────────────────

const BLANK_QUESTION = () => ({
    type: 'short_answer',
    questionText: '',
    options: [],
    correctAnswer: '',
    markingScheme: '',
    maxMarks: 2,
    _id: `new_${Date.now()}_${Math.random()}`,
});

// ─── Sub-component: Question Editor Card ──────────────────────────────────────

const QuestionCard = ({ question, index, onChange, onDelete }) => {
    const isMcq = question.type === 'mcq';

    const updateField = (field, value) => {
        onChange(index, { ...question, [field]: value });
    };

    const updateOption = (optIdx, value) => {
        const opts = [...(question.options || [])];
        opts[optIdx] = value;
        onChange(index, { ...question, options: opts });
    };

    const inputCls = "w-full px-3 py-2 rounded-lg bg-[#051F1D] border border-white/10 text-white placeholder:text-muted/50 text-sm focus:outline-none focus:border-highlight transition-colors";
    const labelCls = "block text-[10px] font-bold text-muted uppercase tracking-widest mb-1";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            layout
        >
            <Card className="border-l-4 border-highlight/40 relative group">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-highlight/20 text-highlight text-sm font-black flex items-center justify-center">
                            {index + 1}
                        </span>
                        {/* Type selector */}
                        <select
                            value={question.type}
                            onChange={e => updateField('type', e.target.value)}
                            className="text-xs px-2 py-1 rounded-md bg-accent/10 border border-muted/20 text-highlight font-bold uppercase tracking-wider focus:outline-none focus:border-highlight"
                        >
                            <option value="mcq">MCQ</option>
                            <option value="short_answer">Short Answer</option>
                            <option value="math">Math</option>
                        </select>
                        <span className="text-xs text-muted">
                            <input
                                type="number"
                                min={1} max={10}
                                value={question.maxMarks || 2}
                                onChange={e => updateField('maxMarks', Number(e.target.value))}
                                className="w-12 px-1 py-0.5 rounded bg-accent/10 border border-muted/20 text-white text-center text-xs focus:outline-none"
                            /> marks
                        </span>
                    </div>
                    <button
                        onClick={() => onDelete(index)}
                        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-all"
                        title="Delete question"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                {/* Question text */}
                <div className="mb-4">
                    <label className={labelCls}>Question</label>
                    <textarea
                        rows={2}
                        placeholder="Enter question text..."
                        value={question.questionText || ''}
                        onChange={e => updateField('questionText', e.target.value)}
                        className={`${inputCls} resize-none`}
                    />
                </div>

                {/* MCQ Options */}
                {isMcq && (
                    <div className="mb-4">
                        <label className={labelCls}>Options (mark correct one)</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {(question.options || ['', '', '', '']).map((opt, oi) => {
                                const letter = String.fromCharCode(65 + oi);
                                const isCorrect = question.correctAnswer === opt || question.correctAnswer === letter;
                                return (
                                    <div key={oi} className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => updateField('correctAnswer', opt || letter)}
                                            title="Set as correct answer"
                                            className={`w-7 h-7 rounded-md text-xs font-bold flex items-center justify-center shrink-0 transition-all border ${
                                                isCorrect
                                                    ? 'bg-highlight text-primary border-highlight'
                                                    : 'bg-accent/10 text-muted border-muted/20 hover:border-highlight/50'
                                            }`}
                                        >
                                            {letter}
                                        </button>
                                        <input
                                            type="text"
                                            placeholder={`Option ${letter}`}
                                            value={opt}
                                            onChange={e => updateOption(oi, e.target.value)}
                                            className={inputCls}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Correct Answer (non-MCQ) */}
                {!isMcq && (
                    <div className="mb-4">
                        <label className={labelCls}>Correct Answer / Model Response</label>
                        <input
                            type="text"
                            placeholder="Ideal answer..."
                            value={question.correctAnswer || ''}
                            onChange={e => updateField('correctAnswer', e.target.value)}
                            className={inputCls}
                        />
                    </div>
                )}

                {/* Marking Scheme */}
                <div>
                    <label className={labelCls}>Marking Scheme / Key Points</label>
                    <input
                        type="text"
                        placeholder="Key points for grading..."
                        value={question.markingScheme || ''}
                        onChange={e => updateField('markingScheme', e.target.value)}
                        className={inputCls}
                    />
                </div>
            </Card>
        </motion.div>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────

const AssessmentPreview = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const initialQuestions = location.state?.questions || [];
    const formData = location.state?.formData || {};

    const [questions, setQuestions] = useState(initialQuestions.map((q, i) => ({ ...q, _id: q._id || `q_${i}` })));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // Redirect if landed without data
    if (!location.state?.questions) {
        return (
            <div className="min-h-screen bg-primary pl-64 text-secondary font-body">
                <Sidebar role="teacher" />
                <main className="p-8 text-center py-20">
                    <p className="text-secondary mb-4">No preview data found. Please generate an assessment first.</p>
                    <Button onClick={() => navigate('/teacher/create')}>Back to Creator</Button>
                </main>
            </div>
        );
    }

    const handleQuestionChange = (index, updated) => {
        setQuestions(prev => prev.map((q, i) => i === index ? updated : q));
    };

    const handleDelete = (index) => {
        setQuestions(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddQuestion = () => {
        setQuestions(prev => [...prev, BLANK_QUESTION()]);
    };

    const handleSave = async () => {
        setError('');

        // Validation
        if (questions.length === 0) {
            setError('You must have at least one question before saving.');
            return;
        }
        const emptyQ = questions.findIndex(q => !q.questionText?.trim());
        if (emptyQ !== -1) {
            setError(`Question ${emptyQ + 1} has empty question text. Please fill it in before saving.`);
            return;
        }

        setSaving(true);
        try {
            await api.post('/assessments/save', {
                ...formData,
                questions: questions.map(({ _id, ...rest }) => rest), // strip client-side IDs
            });
            navigate('/teacher', { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save assessment. Please try again.');
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-primary pl-64 text-secondary font-body overflow-x-hidden">
            <Sidebar role="teacher" />

            <main className="p-8 max-w-4xl mx-auto">
                {/* Back */}
                <button
                    onClick={() => navigate('/teacher/create')}
                    className="flex items-center gap-2 text-secondary hover:text-highlight transition-all mb-8 group font-semibold"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Creator
                </button>

                {/* Header */}
                <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="text-highlight" size={20} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-highlight">Preview & Edit</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-white font-heading tracking-tight">
                            {formData.title || 'Assessment Preview'}
                        </h1>
                        <p className="text-secondary mt-1 font-medium">
                            {formData.subject} · {formData.grade} · <span className="capitalize">{formData.difficulty}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm font-bold text-muted">{questions.length} Questions</span>
                        <Button onClick={handleAddQuestion} variant="outline" className="border-highlight/30 text-highlight hover:bg-highlight/10 text-sm px-4 py-2">
                            <Plus size={16} className="mr-1" /> Add Question
                        </Button>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium mb-6"
                    >
                        <AlertCircle size={18} className="shrink-0" />
                        {error}
                    </motion.div>
                )}

                {/* Questions */}
                {questions.length === 0 ? (
                    <div className="text-center py-16 bg-accent/5 rounded-3xl border border-dashed border-muted/30 mb-8">
                        <p className="text-secondary font-medium mb-4">No questions yet. Add your first question!</p>
                        <Button onClick={handleAddQuestion} variant="outline" className="mx-auto">
                            <Plus size={16} className="mr-2" /> Add Question
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6 mb-8">
                        <AnimatePresence mode="popLayout">
                            {questions.map((q, i) => (
                                <QuestionCard
                                    key={q._id || i}
                                    question={q}
                                    index={i}
                                    onChange={handleQuestionChange}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Bottom toolbar */}
                <div className="sticky bottom-6 flex justify-between items-center p-5 bg-surface/90 backdrop-blur border border-muted/20 rounded-2xl shadow-2xl">
                    <Button onClick={handleAddQuestion} variant="outline" className="border-muted/30 text-secondary hover:text-white text-sm">
                        <Plus size={16} className="mr-2" /> Add Question
                    </Button>
                    <Button onClick={handleSave} disabled={saving} className="px-8 py-3 shadow-highlight/20">
                        <Save size={16} className="mr-2" />
                        {saving ? 'Saving...' : 'Save Assessment'}
                    </Button>
                </div>
            </main>
        </div>
    );
};

export default AssessmentPreview;
