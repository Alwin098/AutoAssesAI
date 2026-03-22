                            import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Sparkles, ArrowLeft } from 'lucide-react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const CreateAssessment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [loadingClasses, setLoadingClasses] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        grade: '',
        topic: '',
        difficulty: 'medium',
        questionCount: 5,
        numQuestions: 5,
        classId: ''
    });

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                if (!user?._id) return;
                const { data } = await api.get(`/class/teacher/${user._id}`);
                setClasses(Array.isArray(data) ? data : []);
                if (data && data.length > 0) {
                    setFormData(prev => ({ 
                        ...prev, 
                        classId: location.state?.predefinedClassId || data[0]._id 
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch classes", error);
            } finally {
                setLoadingClasses(false);
            }
        };
        fetchClasses();
    }, [user?._id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.classId) {
            alert('Please select a class first.');
            return;
        }
        setLoading(true);
        try {
            // Call Backend API to Generate Questions via Gemini (without saving)
            const { data } = await api.post('/assessments/generate-preview', {
                ...formData,
                numQuestions: Number(formData.numQuestions) || 5,
            });
            // Navigate to preview page, passing generated questions + form data
            navigate('/teacher/assessment-preview', {
                state: {
                    questions: data.questions,
                    formData: formData,
                }
            });
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to generate questions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-primary pl-64 text-secondary font-body">
            <Sidebar role="teacher" />

            <main className="p-8 max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-secondary hover:text-highlight transition-all mb-8 group font-semibold"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </button>

                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold text-white font-heading tracking-tight flex items-center gap-3">
                        <Sparkles className="text-highlight" size={32} />
                        AI Assessment Creator
                    </h1>
                    <p className="text-secondary mt-2 font-medium">Define your requirements and let our AI engine generate a high-quality assessment instantly.</p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <Input
                                label="Assessment Title"
                                name="title"
                                placeholder="e.g. Thermodynamics Quiz 1"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Subject"
                                name="subject"
                                placeholder="e.g. Physics"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <Input
                                label="Grade / Class"
                                name="grade"
                                placeholder="e.g. Grade 10"
                                value={formData.grade}
                                onChange={handleChange}
                                required
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Difficulty</label>
                                <select
                                    name="difficulty"
                                    value={formData.difficulty}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-[#051F1D] border border-white/10 text-white focus:outline-none focus:border-accent"
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <Input
                                label="Topic / Concepts"
                                name="topic"
                                placeholder="e.g. Laws of Thermodynamics, Entropy, Heat Engines"
                                value={formData.topic}
                                onChange={handleChange}
                                required
                                className="w-full"
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Number of Questions</label>
                                <select
                                    name="numQuestions"
                                    value={formData.numQuestions}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-[#051F1D] border border-white/10 text-white focus:outline-none focus:border-accent"
                                >
                                    <option value={5}>5 Questions</option>
                                    <option value={10}>10 Questions</option>
                                    <option value={15}>15 Questions</option>
                                    <option value={20}>20 Questions</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Assign to Class</label>
                                <select
                                    name="classId"
                                    value={formData.classId}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-[#051F1D] border border-white/10 text-white focus:outline-none focus:border-accent"
                                    disabled={loadingClasses || classes.length === 0}
                                >
                                    {loadingClasses ? (
                                        <option value="">Loading classes...</option>
                                    ) : classes.length === 0 ? (
                                        <option value="">No classes found. Create one first.</option>
                                    ) : (
                                        classes.map(cls => (
                                            <option key={cls._id} value={cls._id}>
                                                {cls.name} ({cls.subject})
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-5 bg-highlight/5 border border-highlight/20 rounded-2xl">
                            <div className="p-2 bg-highlight/10 rounded-lg">
                                <Sparkles className="text-highlight shrink-0" size={20} />
                            </div>
                            <p className="text-sm text-secondary font-medium leading-relaxed">
                                AI will generate <strong className="text-highlight">{formData.numQuestions}</strong> curriculum-aligned questions. You can edit, delete, or add questions on the next screen before saving.
                            </p>
                        </div>

                        <div className="border-t border-muted/20 pt-8 flex justify-end">
                            <Button type="submit" loading={loading} className="w-64 py-4 shadow-highlight/30 font-bold text-lg">
                                {loading ? 'Generating...' : 'Generate & Preview →'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </main>
        </div>
    );
};

export default CreateAssessment;
