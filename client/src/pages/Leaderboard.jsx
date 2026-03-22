import React, { useEffect, useState, useContext } from 'react';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const { data } = await api.get('/submissions/leaderboard');
                setLeaderboard(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch leaderboard");
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    const getRankIcon = (rank) => {
        if (rank === 1) return <Trophy className="text-yellow-400" size={24} />;
        if (rank === 2) return <Medal className="text-gray-300" size={24} />;
        if (rank === 3) return <Medal className="text-orange-400" size={24} />;
        return null;
    };

    const getRankColor = (rank) => {
        if (rank === 1) return 'bg-yellow-500/10 border-yellow-500/30';
        if (rank === 2) return 'bg-gray-400/10 border-gray-400/30';
        if (rank === 3) return 'bg-orange-500/10 border-orange-500/30';
        return 'bg-accent/5 border-muted/20';
    };

    const getScoreColor = (score) => {
        if (score >= 90) return 'text-green-400';
        if (score >= 75) return 'text-highlight';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
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
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-2">
                        <Trophy className="text-highlight" size={36} />
                        <h1 className="text-4xl font-extrabold text-white font-heading tracking-tight">Leaderboard</h1>
                    </div>
                    <p className="text-secondary mt-1 font-medium italic">Top performing students</p>
                </header>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-highlight"></div>
                    </div>
                ) : leaderboard.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center py-20 text-center">
                        <TrendingUp className="text-muted mb-4 opacity-50" size={64} />
                        <p className="text-white font-black text-xl uppercase tracking-widest">No Rankings Yet</p>
                        <p className="text-secondary font-medium mt-2">Complete assessments to appear on the leaderboard.</p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {leaderboard.map((entry, index) => {
                            const rank = index + 1;
                            const isCurrentUser = entry.studentId === user?._id;
                            const rankColor = getRankColor(rank);
                            const scoreColor = getScoreColor(entry.averageScore);

                            return (
                                <motion.div
                                    key={entry.studentId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <Card
                                        className={`p-6 ${rankColor} ${isCurrentUser ? 'ring-2 ring-highlight shadow-lg shadow-highlight/20' : ''} transition-all duration-200`}
                                        hover={true}
                                    >
                                        <div className="flex items-center gap-6">
                                            {/* Rank */}
                                            <div className="flex-shrink-0 w-16 text-center">
                                                {getRankIcon(rank) || (
                                                    <div className="text-3xl font-black text-muted">
                                                        #{rank}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Student Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-xl font-bold text-white">
                                                        {entry.studentName}
                                                    </h3>
                                                    {isCurrentUser && (
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-highlight/20 text-highlight font-bold uppercase tracking-wider">
                                                            You
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-secondary">
                                                    {entry.totalAttempts} assessment{entry.totalAttempts !== 1 ? 's' : ''} completed
                                                </p>
                                            </div>

                                            {/* Score */}
                                            <div className="flex-shrink-0 text-right">
                                                <div className={`text-3xl font-black ${scoreColor}`}>
                                                    {entry.averageScore}%
                                                </div>
                                                <p className="text-xs text-muted uppercase tracking-wider mt-1">
                                                    Average Score
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Legend */}
                {!loading && leaderboard.length > 0 && (
                    <div className="mt-12 flex items-center justify-center gap-8 text-xs">
                        <div className="flex items-center gap-2">
                            <Trophy className="text-yellow-400" size={16} />
                            <span className="text-secondary">1st Place</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Medal className="text-gray-300" size={16} />
                            <span className="text-secondary">2nd Place</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Medal className="text-orange-400" size={16} />
                            <span className="text-secondary">3rd Place</span>
                        </div>
                    </div>
                )}
            </motion.main>
        </div>
    );
};

export default Leaderboard;
