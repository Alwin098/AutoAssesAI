import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { User, Mail, Phone, BookOpen, Briefcase, Save, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const Field = ({ label, icon: Icon, name, value, onChange, disabled = false, placeholder = '' }) => (
    <div>
        <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">
            {label}
        </label>
        <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                <Icon size={16} />
            </div>
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                className={`w-full pl-11 pr-4 py-3 rounded-xl border text-white focus:outline-none focus:ring-1 transition-all
                    ${disabled
                        ? 'bg-accent/5 border-muted/20 text-muted cursor-not-allowed'
                        : 'bg-accent/5 border-muted/30 focus:border-highlight focus:ring-highlight'
                    }`}
            />
        </div>
    </div>
);

const TeacherProfile = () => {
    const navigate = useNavigate();
    const { user: authUser } = useContext(AuthContext);

    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        experience: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/user/profile');
                setProfile({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    subject: data.subject || '',
                    experience: data.experience || '',
                });
            } catch (err) {
                setError('Failed to load profile. Please try again.');
                console.error('Profile fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
        setSuccess(false);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess(false);
        try {
            const { data } = await api.put('/user/profile', {
                name: profile.name,
                phone: profile.phone,
                subject: profile.subject,
                experience: profile.experience,
            });
            setProfile(prev => ({ ...prev, ...data }));
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-primary pl-64 text-secondary font-body">
                <Sidebar role="teacher" />
                <main className="p-8 flex items-center justify-center h-full">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-highlight border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-highlight font-bold">Loading profile...</p>
                    </div>
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
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="p-8 max-w-4xl mx-auto"
            >
                {/* Back Button */}
                <button
                    onClick={() => navigate('/teacher')}
                    className="flex items-center gap-2 text-secondary hover:text-highlight transition-all mb-8 group font-semibold"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </button>

                {/* Header */}
                <header className="mb-10">
                    <h1 className="text-4xl font-extrabold text-white font-heading tracking-tight">My Profile</h1>
                    <p className="text-secondary mt-1 font-medium italic">Manage your personal information</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Avatar Card */}
                    <Card className="flex flex-col items-center text-center py-8 gap-4">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-highlight/30 to-highlight/5 border border-highlight/30 flex items-center justify-center">
                            <span className="text-4xl font-black text-highlight">
                                {profile.name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-white">{profile.name}</p>
                            <p className="text-xs text-highlight uppercase tracking-widest font-bold mt-1">Teacher</p>
                        </div>
                        {profile.subject && (
                            <span className="text-xs px-3 py-1 rounded-full font-bold border bg-highlight/10 text-highlight border-highlight/20">
                                {profile.subject}
                            </span>
                        )}
                        {profile.experience && (
                            <p className="text-xs text-muted">{profile.experience} experience</p>
                        )}
                    </Card>

                    {/* Edit Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <h2 className="text-xl font-bold text-white font-heading mb-6 flex items-center gap-2">
                                <div className="w-1 h-6 bg-highlight rounded-full"></div>
                                Edit Information
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <Field label="Full Name" icon={User} name="name" value={profile.name} onChange={handleChange} placeholder="Your full name" />
                                <Field label="Email Address" icon={Mail} name="email" value={profile.email} onChange={handleChange} disabled />
                                <Field label="Phone Number" icon={Phone} name="phone" value={profile.phone} onChange={handleChange} placeholder="e.g. +91 98765 43210" />
                                <Field label="Subject Specialization" icon={BookOpen} name="subject" value={profile.subject} onChange={handleChange} placeholder="e.g. Physics, Mathematics" />
                                <Field label="Teaching Experience" icon={Briefcase} name="experience" value={profile.experience} onChange={handleChange} placeholder="e.g. 5 years" />

                                {/* Feedback messages */}
                                {success && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm font-medium"
                                    >
                                        <CheckCircle size={16} />
                                        Profile updated successfully!
                                    </motion.div>
                                )}
                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium">
                                        {error}
                                    </div>
                                )}

                                <div className="pt-2">
                                    <Button type="submit" className="w-full py-3" disabled={saving}>
                                        <Save size={16} className="mr-2" />
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>
            </motion.main>
        </div>
    );
};

export default TeacherProfile;
