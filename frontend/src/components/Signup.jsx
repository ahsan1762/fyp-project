import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Smartphone, Lock, Wrench, Eye, EyeOff, CheckCircle } from 'lucide-react';
import './Signup.css';
import './Login.css';

const Signup = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('user'); // 'user' or 'worker'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const getPasswordStrength = (password) => {
        if (!password) return 'none';
        if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return 'strong';
        if (password.length >= 6) return 'medium';
        return 'weak';
    };

    const passwordStrength = getPasswordStrength(formData.password);

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.name.trim()) newErrors.name = 'Full name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = 'Passwords do not match';
        if (!agreedToTerms) newErrors.terms = 'You must agree to the terms';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setLoading(true);
            setTimeout(() => {
                const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
                if (existingUsers.some(u => u.email === formData.email)) {
                    setErrors({ email: 'Account already exists' });
                    setLoading(false);
                    return;
                }
                const newUser = {
                    id: Date.now(),
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                    role: 'user',
                    loggedIn: true
                };
                localStorage.setItem('user', JSON.stringify(newUser));
                localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]));
                window.dispatchEvent(new Event('auth-change'));
                setLoading(false);
                navigate('/home');
            }, 1000);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    return (
        <div className="signup-container">
            <div className="login-bg-overlay"></div>
            <div className="signup-card">
                <div className="login-header">
                    <div className="login-icon"><Wrench size={40} color="#07614A" /></div>
                    <h1 className="login-title">Create Account</h1>
                    <p className="login-subtitle">Join KaamWala community</p>
                </div>

                <div className="role-tabs">
                    <button className={`role-tab ${role === 'user' ? 'active' : ''}`} onClick={() => setRole('user')}>Customer</button>
                    <button className={`role-tab ${role === 'worker' ? 'active' : ''}`} onClick={() => setRole('worker')}>Worker</button>
                </div>

                {role === 'worker' ? (
                    <div className="worker-signup-info animation-fade">
                        <div className="info-box" style={{ textAlign: 'center', padding: '20px' }}>
                            <div className="benefit-icon" style={{ background: '#e6f4ea', color: '#07614A', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                <CheckCircle size={30} />
                            </div>
                            <h3>Join as a Professional</h3>
                            <p style={{ color: '#666', margin: '15px 0' }}>Showcase your skills, get more bookings, and earn more with KaamWala.</p>
                            <Link to="/become-worker">
                                <button className="submit-btn">Start Worker Registration</button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={20} />
                                <input type="text" name="name" className="input-field" placeholder="Full Name" value={formData.name} onChange={handleChange} />
                            </div>
                            {errors.name && <p className="error-message">{errors.name}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={20} />
                                <input type="email" name="email" className="input-field" placeholder="Email Address" value={formData.email} onChange={handleChange} />
                            </div>
                            {errors.email && <p className="error-message">{errors.email}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <div className="input-wrapper">
                                <Smartphone className="input-icon" size={20} />
                                <input type="tel" name="phone" className="input-field" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
                            </div>
                            {errors.phone && <p className="error-message">{errors.phone}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={20} />
                                <input type={showPassword ? 'text' : 'password'} name="password" className="input-field" placeholder="Password" value={formData.password} onChange={handleChange} />
                                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                            </div>
                            {errors.password && <p className="error-message">{errors.password}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={20} />
                                <input type="password" name="confirmPassword" className="input-field" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
                            </div>
                            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                        </div>
                        <div className="form-group">
                            <label className="checkbox-group">
                                <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} />
                                <span>I agree to the <Link to="/terms" className="signup-link">Terms & Conditions</Link></span>
                            </label>
                            {errors.terms && <p className="error-message">{errors.terms}</p>}
                        </div>
                        <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'Creating account...' : 'Create Account'}</button>
                        <p className="signup-text" style={{ marginTop: '20px' }}>Already have account? <Link to="/login" className="signup-link">Login</Link></p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Signup;
