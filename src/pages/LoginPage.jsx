import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, AtSign, Eye, EyeOff } from 'lucide-react';
import { loginUser, registerUser } from '../api/auth';
import { useApp } from '../context/AppContext';
import './LoginPage.css';

export default function LoginPage() {
    const { login } = useApp();
    const [isLogin, setIsLogin] = useState(true);
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });

    const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = isLogin ? await loginUser(form) : await registerUser(form);
            login(res.data.token);
        } catch (err) {
            setError(err.response?.data?.error || 'something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-root">
            {/* Grain overlay */}
            <div className="login-grain" />

            {/* Gradient blobs */}
            <div className="login-blob login-blob-1" />
            <div className="login-blob login-blob-2" />

            <motion.div
                className="login-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
                {/* Brand — centered */}
                <div className="login-brand">
                    <div className="login-logo-box">
                        <div className="login-logo-inner" />
                    </div>
                    <h1 className="login-brand-name">
                        discipline<span className="login-brand-accent">-os</span>
                    </h1>
                    <p className="login-brand-sub">
                        {isLogin ? 'welcome back. keep the streak alive.' : 'build your system. own your day.'}
                    </p>
                </div>

                {/* Tab switcher */}
                <div className="login-tab-row">
                    <button
                        className={`login-tab ${isLogin ? 'active' : ''}`}
                        onClick={() => { setIsLogin(true); setError(''); }}
                    >
                        sign in
                    </button>
                    <button
                        className={`login-tab ${!isLogin ? 'active' : ''}`}
                        onClick={() => { setIsLogin(false); setError(''); }}
                    >
                        register
                    </button>
                </div>

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <motion.p
                            className="login-error"
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>

                {/* Form */}
                <form className="login-form" onSubmit={handleSubmit}>
                    <AnimatePresence>
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '10px' }}
                            >
                                <div className="login-field">
                                    <User size={14} className="login-field-icon" />
                                    <input
                                        className="login-input"
                                        placeholder="full name"
                                        value={form.name}
                                        onChange={set('name')}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="login-field">
                                    <AtSign size={14} className="login-field-icon" />
                                    <input
                                        className="login-input"
                                        placeholder="username"
                                        value={form.username}
                                        onChange={set('username')}
                                        autoComplete="off"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="login-field">
                        <Mail size={14} className="login-field-icon" />
                        <input
                            className="login-input"
                            type="email"
                            placeholder="email address"
                            value={form.email}
                            onChange={set('email')}
                            autoComplete="off"
                        />
                    </div>

                    <div className="login-field">
                        <Lock size={14} className="login-field-icon" />
                        <input
                            className="login-input"
                            type={showPass ? 'text' : 'password'}
                            placeholder="password"
                            value={form.password}
                            onChange={set('password')}
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            className="login-eye"
                            onClick={() => setShowPass(!showPass)}
                        >
                            {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="login-submit"
                        disabled={loading}
                    >
                        {loading
                            ? <span className="login-spinner" />
                            : isLogin ? 'sign in' : 'create account'
                        }
                    </button>
                </form>

                <p className="login-switch">
                    {isLogin ? "don't have an account?" : 'already have one?'}{' '}
                    <span
                        className="login-switch-link"
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                    >
                        {isLogin ? 'register' : 'sign in'}
                    </span>
                </p>
            </motion.div>
        </div>
    );
}