import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { LayoutDashboard, PlusCircle, LogOut, BookOpen, User, FileText, Trophy, Users, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ role = 'teacher' }) => {
    const { logout, user } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const teacherLinks = [
        { name: 'Dashboard', path: '/teacher', icon: LayoutDashboard },
        { name: 'Create Assessment', path: '/teacher/create', icon: PlusCircle },
        { name: 'My Classes', path: '/teacher/classes', icon: Users },
        { name: 'Profile', path: '/teacher/profile', icon: User },
    ];

    const studentLinks = [
        { name: 'Dashboard', path: '/student', icon: LayoutDashboard },
        { name: 'Join Class', path: '/student/join', icon: UserPlus },
        { name: 'My Classes', path: '/student/classes', icon: Users },
        { name: 'Assessments', path: '/student/assessments', icon: FileText },
        { name: 'Leaderboard', path: '/student/leaderboard', icon: Trophy },
        { name: 'My Results', path: '/student/results', icon: BookOpen },
    ];

    const links = role === 'teacher' ? teacherLinks : studentLinks;

    return (
        <div className="h-screen w-64 bg-surface border-r border-muted flex flex-col fixed left-0 top-0 z-50">
            <div className="p-6">
                <h1 className="text-2xl font-black text-white font-heading">AutoAssesAI</h1>
                <p className="text-[10px] text-highlight mt-1 uppercase font-bold tracking-[0.2em]">{role} Portal</p>
            </div>

            <nav className="px-4 space-y-2 mt-4">
                {links.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.path);
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active ? 'bg-highlight text-primary font-bold shadow-lg shadow-highlight/10' : 'text-secondary hover:bg-accent/10 hover:text-white'}`}
                        >
                            <Icon size={18} />
                            <span className="text-sm tracking-wide">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-muted mt-auto">
                <div className="flex items-center gap-3 px-4 py-3 mb-4 bg-accent/5 rounded-2xl border border-muted/20">
                    <div className="w-10 h-10 rounded-xl bg-highlight/20 flex items-center justify-center text-highlight font-bold">
                        <User size={20} />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-xs font-bold text-white truncate uppercase tracking-wider">{user?.name}</p>
                        <p className="text-[10px] text-secondary truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors font-bold text-xs uppercase tracking-widest"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
