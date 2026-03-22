import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Card from './ui/Card';
import { TrendingUp, TrendingDown, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const PerformanceInsights = ({ submissions }) => {
    // Calculate subject-wise performance
    const subjectPerformance = useMemo(() => {
        if (!submissions || submissions.length === 0) return [];

        const subjectMap = {};

        submissions.forEach(submission => {
            const subject = submission.assessmentId?.subject || 'Unknown';
            const percentage = Math.round((submission.totalScore / submission.maxScore) * 100);

            if (!subjectMap[subject]) {
                subjectMap[subject] = {
                    subject,
                    totalPercentage: 0,
                    count: 0,
                };
            }

            subjectMap[subject].totalPercentage += percentage;
            subjectMap[subject].count += 1;
        });

        // Calculate averages and sort by performance
        return Object.values(subjectMap)
            .map(item => ({
                subject: item.subject,
                average: Math.round(item.totalPercentage / item.count),
                count: item.count,
            }))
            .sort((a, b) => b.average - a.average);
    }, [submissions]);

    // Classify subjects into strengths and weaknesses
    const { strengths, weaknesses } = useMemo(() => {
        const strengths = subjectPerformance.filter(s => s.average >= 70);
        const weaknesses = subjectPerformance.filter(s => s.average < 50);
        return { strengths, weaknesses };
    }, [subjectPerformance]);

    // Get bar color based on performance
    const getBarColor = (average) => {
        if (average >= 70) return '#0C969C'; // highlight - strengths
        if (average >= 50) return '#6BA3BE'; // secondary - average
        return '#EF4444'; // red - weaknesses
    };

    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-surface border border-muted rounded-lg p-3 shadow-lg">
                    <p className="text-white font-semibold mb-1">{data.subject}</p>
                    <p className="text-secondary text-sm">Average: {data.average}%</p>
                    <p className="text-muted text-xs">Based on {data.count} assessment{data.count > 1 ? 's' : ''}</p>
                </div>
            );
        }
        return null;
    };

    // Empty state
    if (!submissions || submissions.length === 0) {
        return (
            <Card className="text-center py-12">
                <Award className="mx-auto mb-4 text-muted" size={48} />
                <h3 className="text-xl font-semibold text-white mb-2">No Performance Data Yet</h3>
                <p className="text-secondary">
                    Complete some assessments to see your performance insights here.
                </p>
            </Card>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-6"
        >
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths Card */}
                <Card className="p-6">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <TrendingUp className="text-green-400" size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-2">Strong Areas</h3>
                            {strengths.length > 0 ? (
                                <div className="space-y-2">
                                    {strengths.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center">
                                            <span className="text-secondary text-sm">{item.subject}</span>
                                            <span className="text-green-400 font-semibold text-sm">{item.average}%</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted text-sm">No subjects above 70% yet. Keep practicing!</p>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Weaknesses Card */}
                <Card className="p-6">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-500/10 rounded-lg">
                            <TrendingDown className="text-red-400" size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-2">Needs Improvement</h3>
                            {weaknesses.length > 0 ? (
                                <div className="space-y-2">
                                    {weaknesses.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center">
                                            <span className="text-secondary text-sm">{item.subject}</span>
                                            <span className="text-red-400 font-semibold text-sm">{item.average}%</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted text-sm">Great! No weak areas identified.</p>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Performance Chart */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Performance by Subject</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={subjectPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#274D60" opacity={0.3} />
                        <XAxis
                            dataKey="subject"
                            stroke="#6BA3BE"
                            tick={{ fill: '#6BA3BE', fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis
                            stroke="#6BA3BE"
                            tick={{ fill: '#6BA3BE', fontSize: 12 }}
                            domain={[0, 100]}
                            label={{ value: 'Average Score (%)', angle: -90, position: 'insideLeft', fill: '#6BA3BE', fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(12, 150, 156, 0.1)' }} />
                        <Bar dataKey="average" radius={[8, 8, 0, 0]}>
                            {subjectPerformance.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getBarColor(entry.average)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 flex items-center justify-center gap-6 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: '#0C969C' }}></div>
                        <span className="text-secondary">Strengths (≥70%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: '#6BA3BE' }}></div>
                        <span className="text-secondary">Average (50-69%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: '#EF4444' }}></div>
                        <span className="text-secondary">Needs Work (&lt;50%)</span>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

export default PerformanceInsights;
