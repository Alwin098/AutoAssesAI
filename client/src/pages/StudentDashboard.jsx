import React, { useEffect, useState } from 'react';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import PerformanceInsights from '../components/PerformanceInsights';
import { Pencil, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';

const StudentDashboard = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loadingSubmissions, setLoadingSubmissions] = useState(true);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const { data } = await api.get('/submissions/my-results');
                setSubmissions(data);
            } catch (error) {
                console.error("Failed to fetch submissions");
            } finally {
                setLoadingSubmissions(false);
            }
        };

        fetchSubmissions();
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
                    <h1 className="text-4xl font-extrabold text-white font-heading tracking-tight">Student Dashboard</h1>
                    <p className="text-secondary mt-1 font-medium italic">Your personalized learning path</p>
                </header>

                {/* Performance Insights Section - MOVED TO TOP */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-extrabold text-white font-heading">Performance Insights</h2>
                        <div className="h-px bg-muted/20 flex-1 mx-6"></div>
                    </div>

                    {loadingSubmissions ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-highlight"></div>
                        </div>
                    ) : (
                        <PerformanceInsights submissions={submissions} />
                    )}
                </div>
            </motion.main>
        </div>
    );
};

export default StudentDashboard;
