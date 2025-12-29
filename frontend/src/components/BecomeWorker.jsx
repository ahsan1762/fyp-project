import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { CheckCircle, Wrench, Clock, Briefcase, User, Mail, Phone, MapPin, Camera, Video, ArrowLeft, Lock } from 'lucide-react';
import './BecomeWorker.css';

const BecomeWorker = () => {
    const navigate = useNavigate();
    const regFormRef = useRef(null);
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        cnic: '',
        password: '',
        serviceType: '',
        experience: '',
        location: '',
        description: '',
        profilePic: null,
        cnicFront: null,
        cnicBack: null,
        showcaseVideo: null
    });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            if (user.role === 'worker' && user.loggedIn) {
                navigate('/worker-profile');
            }
        }
    }, [navigate]);

    const scrollToForm = () => {
        regFormRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validateStep = () => {
        if (step === 1) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^03\d{9}$/; // 03 followed by 9 digits
            const cnicRegex = /^\d{5}-\d{7}-\d{1}$/; // xxxxx-xxxxxxx-x

            if (!formData.fullName || !formData.email || !formData.phone || !formData.cnic ||
                !formData.password || !formData.serviceType || !formData.experience ||
                !formData.location || !formData.description) {
                alert('Please fill in all required fields.');
                return false;
            }

            if (!emailRegex.test(formData.email)) {
                alert('Please enter a valid email address.');
                return false;
            }

            if (!phoneRegex.test(formData.phone)) {
                alert('Please enter a valid Pakistani phone number (e.g., 03123456789).');
                return false;
            }

            if (!cnicRegex.test(formData.cnic)) {
                alert('Please enter a valid CNIC number (Format: xxxxx-xxxxxxx-x).');
                return false;
            }

            if (formData.password.length < 6) {
                alert('Password must be at least 6 characters long.');
                return false;
            }

            return true;
        } else if (step === 2) {
            if (!formData.profilePic || !formData.cnicFront || !formData.cnicBack) {
                alert('Please upload all required identity documents.');
                return false;
            }
            return true;
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep()) {
            window.scrollTo({ top: regFormRef.current.offsetTop - 100, behavior: 'smooth' });
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        window.scrollTo({ top: regFormRef.current.offsetTop - 100, behavior: 'smooth' });
        setStep(step - 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.serviceVideo) {
            alert('Please upload a showcase video to complete your registration.');
            return;
        }
        setSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            const workers = JSON.parse(localStorage.getItem('workers') || '[]');

            // Check if worker already exists
            if (workers.find(w => w.email === formData.email)) {
                alert('An account with this email already exists.');
                setSubmitting(false);
                return;
            }

            const newWorker = {
                ...formData,
                id: Date.now(),
                role: 'worker',
                // For simulator, we just save filenames instead of file objects which can't be JSON stringified easily
                profilePic: formData.profilePic?.name || 'default-profile.png',
                cnicFront: formData.cnicFront?.name,
                cnicBack: formData.cnicBack?.name,
                serviceVideo: formData.serviceVideo?.name
            };

            workers.push(newWorker);
            localStorage.setItem('workers', JSON.stringify(workers));

            setSubmitting(false);
            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 2000);
    };

    const islamabadAreas = [
        "F-6 (Super Market)", "F-7 (Jinnah Super)", "F-8", "F-10", "F-11",
        "G-6", "G-9", "G-10", "G-11", "I-8"
    ];

    const services = [
        "Plumber", "Electrician", "Carpenter", "Mason", "AC & Repair", "General"
    ];

    return (
        <div className="become-worker-page">
            <Navbar />

            {/* Hero Section */}
            <div className="worker-hero">
                <div className="worker-hero-overlay"></div>
                <div className="worker-hero-content">
                    <h1>Join KaamWala as a Service Partner</h1>
                    <p>Verified experts earn more. Complete our 3-step registration and start getting bookings in Islamabad.</p>
                    <button className="btn-start-reg" onClick={scrollToForm}>
                        Start Registration
                    </button>
                </div>
            </div>

            {/* Benefits section is brief here to keep focus on form */}
            <section className="worker-benefits-mini">
                <div className="benefits-grid">
                    <div className="benefit-card">
                        <div className="benefit-icon"><Briefcase size={24} /></div>
                        <h3>Regular Work</h3>
                        <p>No marketing costs.</p>
                    </div>
                    <div className="benefit-card">
                        <div className="benefit-icon"><Clock size={24} /></div>
                        <h3>Flexibility</h3>
                        <p>Work your way.</p>
                    </div>
                </div>
            </section>

            <div className="registration-section" ref={regFormRef}>
                {submitted ? (
                    <div className="registration-card success-message">
                        <div className="success-icon">
                            <CheckCircle size={48} />
                        </div>
                        <h2>Application Under Review</h2>
                        <p>Excellent! We've received your documents and video, <strong>{formData.fullName}</strong>. Our verification team will review your profile shortly.</p>
                        <div style={{ display: 'flex', gap: '15px', marginTop: '20px', justifyContent: 'center' }}>
                            <Link to="/login">
                                <button className="submit-worker-btn" style={{ background: '#07614A' }}>Login to Account</button>
                            </Link>
                            <button className="submit-worker-btn" style={{ background: '#666' }} onClick={() => { setStep(1); setSubmitted(false); }}>
                                Register New Profile
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="registration-card">
                        {/* Progress Bar */}
                        <div className="step-progress-wrapper">
                            <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
                                <div className="step-num">1</div>
                                <span>Details</span>
                            </div>
                            <div className="step-connector">
                                <div className="connector-fill" style={{ width: step > 1 ? (step === 2 ? '50%' : '100%') : '0%' }}></div>
                            </div>
                            <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
                                <div className="step-num">2</div>
                                <span>Identity</span>
                            </div>
                            <div className="step-connector">
                                <div className="connector-fill" style={{ width: step > 2 ? '100%' : '0%' }}></div>
                            </div>
                            <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
                                <div className="step-num">3</div>
                                <span>Showcase</span>
                            </div>
                        </div>

                        <div className="step-header">
                            <h2>{step === 1 ? 'Personal Details' : step === 2 ? 'Document Verification' : 'Work Video Upload'}</h2>
                            <p>Step {step} of 3</p>
                        </div>

                        <form className="worker-form" onSubmit={handleSubmit}>

                            {/* STEP 1: Details */}
                            {step === 1 && (
                                <div className="form-step-content animation-fade">
                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <div className="input-wrapper">
                                            <User className="input-icon" size={20} />
                                            <input type="text" name="fullName" required className="input-field" placeholder="Enter your full name" value={formData.fullName} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Email</label>
                                            <div className="input-wrapper">
                                                <Mail className="input-icon" size={20} />
                                                <input type="email" name="email" required className="input-field" placeholder="email@example.com" value={formData.email} onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Phone Number</label>
                                            <div className="input-wrapper">
                                                <Phone className="input-icon" size={20} />
                                                <input type="tel" name="phone" required className="input-field" placeholder="03xx xxxxxxx" value={formData.phone} onChange={handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">CNIC Number</label>
                                        <div className="input-wrapper">
                                            <Briefcase className="input-icon" size={20} />
                                            <input type="text" name="cnic" required className="input-field" placeholder="xxxxx-xxxxxxx-x" value={formData.cnic} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Set Password</label>
                                        <div className="input-wrapper">
                                            <Lock size={20} className="input-icon" />
                                            <input type="password" name="password" required className="input-field" placeholder="Create a password" value={formData.password} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Service Type</label>
                                            <select name="serviceType" required className="input-field" value={formData.serviceType} onChange={handleChange}>
                                                <option value="">Select Service</option>
                                                {services.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Experience (Years)</label>
                                            <input type="number" name="experience" required className="input-field" placeholder="e.g. 5" value={formData.experience} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Primary Area (Islamabad)</label>
                                        <select name="location" required className="input-field" value={formData.location} onChange={handleChange}>
                                            <option value="">Select Area</option>
                                            {islamabadAreas.map(area => <option key={area} value={area}>{area}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Brief Description</label>
                                        <textarea name="description" rows="3" className="input-field" style={{ padding: '12px' }} placeholder="Tell us about your work..." value={formData.description} onChange={handleChange}></textarea>
                                    </div>
                                    <button type="button" className="submit-worker-btn" onClick={nextStep}>Next: Verification</button>
                                </div>
                            )}

                            {/* STEP 2: Identity Documents */}
                            {step === 2 && (
                                <div className="form-step-content animation-fade">
                                    <div className="file-upload-group">
                                        <label className="form-label">Profile Picture (Passport Size)</label>
                                        <div className="file-input-box">
                                            <Camera size={24} />
                                            <input type="file" name="profilePic" accept="image/*" required onChange={handleChange} />
                                            <span>{formData.profilePic ? formData.profilePic.name : 'Click to upload photo'}</span>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="file-upload-group">
                                            <label className="form-label">CNIC Front Side</label>
                                            <div className="file-input-box">
                                                <Briefcase size={20} />
                                                <input type="file" name="cnicFront" accept="image/*" required onChange={handleChange} />
                                                <span>{formData.cnicFront ? formData.cnicFront.name : 'Upload Front'}</span>
                                            </div>
                                        </div>
                                        <div className="file-upload-group">
                                            <label className="form-label">CNIC Back Side</label>
                                            <div className="file-input-box">
                                                <Briefcase size={20} />
                                                <input type="file" name="cnicBack" accept="image/*" required onChange={handleChange} />
                                                <span>{formData.cnicBack ? formData.cnicBack.name : 'Upload Back'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-navigation-btns">
                                        <button type="button" className="btn-back" onClick={prevStep}><ArrowLeft size={18} /> Back</button>
                                        <button type="button" className="submit-worker-btn" onClick={nextStep}>Next: Video Upload</button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: Video Showcase */}
                            {step === 3 && (
                                <div className="form-step-content animation-fade">
                                    <div className="file-upload-group">
                                        <label className="form-label">Short Work Video</label>
                                        <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>Upload a 30-60 second video of yourself working or explaining your expertise for customer trust.</p>
                                        <div className="file-input-box video-box">
                                            <Video size={32} />
                                            <input type="file" name="serviceVideo" accept="video/*" required onChange={handleChange} />
                                            <span>{formData.serviceVideo ? formData.serviceVideo.name : 'Select video file'}</span>
                                        </div>
                                    </div>
                                    <div className="form-navigation-btns">
                                        <button type="button" className="btn-back" onClick={prevStep}><ArrowLeft size={18} /> Back</button>
                                        <button type="submit" className="submit-worker-btn" disabled={submitting}>
                                            {submitting ? 'Submitting Application...' : 'Complete Registration'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default BecomeWorker;
