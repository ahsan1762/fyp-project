import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Wrench, Eye, EyeOff, CreditCard } from 'lucide-react';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('user'); // 'user' or 'worker'
    const [formData, setFormData] = useState({
        email: '',
        cnic: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;

        if (role === 'user') {
            if (!formData.email) {
                newErrors.email = 'Email is required';
            } else if (!emailRegex.test(formData.email)) {
                newErrors.email = 'Please enter a valid email';
            }
        } else {
            if (!formData.cnic) {
                newErrors.cnic = 'CNIC is required';
            } else if (!cnicRegex.test(formData.cnic)) {
                newErrors.cnic = 'Please enter valid CNIC (xxxxx-xxxxxxx-x)';
            }
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setLoading(true);

            setTimeout(() => {
                if (role === 'user') {
                    const users = JSON.parse(localStorage.getItem('users') || '[]');
                    const user = users.find(u => u.email === formData.email);

                    if (!user) {
                        setErrors({ email: 'User account does not exist.' });
                        setLoading(false);
                        return;
                    }

                    if (user.password !== formData.password) {
                        setErrors({ password: 'Incorrect password' });
                        setLoading(false);
                        return;
                    }

                    localStorage.setItem('user', JSON.stringify({ ...user, loggedIn: true, role: 'user' }));
                    window.dispatchEvent(new Event('auth-change'));
                    setLoading(false);
                    navigate('/home');
                } else {
                    const workers = JSON.parse(localStorage.getItem('workers') || '[]');
                    const worker = workers.find(w => w.cnic === formData.cnic);

                    if (!worker) {
                        setErrors({ cnic: 'Worker account does not exist.' });
                        setLoading(false);
                        return;
                    }

                    if (worker.password !== formData.password) {
                        setErrors({ password: 'Incorrect password' });
                        setLoading(false);
                        return;
                    }

                    localStorage.setItem('user', JSON.stringify({ ...worker, loggedIn: true, role: 'worker' }));
                    window.dispatchEvent(new Event('auth-change'));
                    setLoading(false);
                    navigate('/worker-profile');
                }
            }, 1000);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    return (
        <div className="login-container">
            <div className="login-bg-overlay"></div>

            <div className="login-card">
                <div className="login-header">
                    <div className="login-icon">
                        <Wrench size={40} color="#07614A" />
                    </div>
                    <h1 className="login-title">Welcome to KaamWala</h1>
                    <p className="login-subtitle">Login to your account</p>
                </div>

                {/* Role Tabs */}
                <div className="role-tabs">
                    <button
                        className={`role-tab ${role === 'user' ? 'active' : ''}`}
                        onClick={() => { setRole('user'); setErrors({}); }}
                    >
                        Customer
                    </button>
                    <button
                        className={`role-tab ${role === 'worker' ? 'active' : ''}`}
                        onClick={() => { setRole('worker'); setErrors({}); }}
                    >
                        Worker
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {role === 'user' ? (
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    className={`input-field ${errors.email ? 'error' : ''}`}
                                    placeholder="email@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            {errors.email && <p className="error-message">{errors.email}</p>}
                        </div>
                    ) : (
                        <div className="form-group">
                            <label className="form-label">CNIC Number</label>
                            <div className="input-wrapper">
                                <CreditCard className="input-icon" size={20} />
                                <input
                                    type="text"
                                    name="cnic"
                                    className={`input-field ${errors.cnic ? 'error' : ''}`}
                                    placeholder="xxxxx-xxxxxxx-x"
                                    value={formData.cnic}
                                    onChange={handleChange}
                                />
                            </div>
                            {errors.cnic && <p className="error-message">{errors.cnic}</p>}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={20} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                className={`input-field ${errors.password ? 'error' : ''}`}
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && <p className="error-message">{errors.password}</p>}
                    </div>

                    <div className="form-footer">
                        <label className="checkbox-group">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            Remember me
                        </label>
                        <Link to="/forgot-password" class="forgot-link">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <div className="divider">
                        <span>or</span>
                    </div>

                    <p className="signup-text">
                        Don't have an account?
                        <Link to="/signup" className="signup-link">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
