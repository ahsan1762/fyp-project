import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { User, Mail, Phone, MapPin, Briefcase, Clock, FileText, CheckCircle, Star } from 'lucide-react';
import './WorkerProfile.css';

const WorkerProfile = () => {
    const [worker, setWorker] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            if (user.role === 'worker') {
                setWorker(user);
            }
        }
    }, []);

    if (!worker) {
        return (
            <div className="worker-profile-page">
                <Navbar />
                <div className="section" style={{ textAlign: 'center', padding: '100px 20px' }}>
                    <h2>Please login as a worker to view this page.</h2>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="worker-profile-page">
            <Navbar />

            <div className="worker-profile-container">
                <div className="profile-sidebar">
                    <div className="profile-card">
                        <div className="profile-avatar">
                            {worker.fullName.charAt(0)}
                        </div>
                        <h2>{worker.fullName}</h2>
                        <p className="profile-role">{worker.serviceType} Specialist</p>
                        <div className="status-badge">
                            <CheckCircle size={14} /> Verified Professional
                        </div>
                    </div>

                    <div className="contact-info-card">
                        <h3>Contact Information</h3>
                        <div className="info-item">
                            <Mail size={18} />
                            <span>{worker.email}</span>
                        </div>
                        <div className="info-item">
                            <Phone size={18} />
                            <span>{worker.phone}</span>
                        </div>
                        <div className="info-item">
                            <MapPin size={18} />
                            <span>{worker.location}</span>
                        </div>
                    </div>
                </div>

                <div className="profile-main">
                    <div className="stats-grid">
                        <div className="stat-box">
                            <Star className="stat-icon" size={24} />
                            <div className="stat-content">
                                <h4>4.9</h4>
                                <p>Rating</p>
                            </div>
                        </div>
                        <div className="stat-box">
                            <Briefcase className="stat-icon" size={24} />
                            <div className="stat-content">
                                <h4>12</h4>
                                <p>Bookings</p>
                            </div>
                        </div>
                        <div className="stat-box">
                            <Clock className="stat-icon" size={24} />
                            <div className="stat-content">
                                <h4>{worker.experience} yrs</h4>
                                <p>Experience</p>
                            </div>
                        </div>
                    </div>

                    <div className="profile-section">
                        <h3>About Me</h3>
                        <p className="description-text">
                            {worker.description || `Hi, I am ${worker.fullName}, a professional ${worker.serviceType} with ${worker.experience} years of experience in the industry. I am dedicated to providing high-quality service to all my customers in ${worker.location}.`}
                        </p>
                    </div>

                    <div className="profile-section">
                        <h3>My Documentation</h3>
                        <div className="docs-grid">
                            <div className="doc-item">
                                <FileText size={24} />
                                <div>
                                    <h5>CNIC Front</h5>
                                    <span>Verified</span>
                                </div>
                            </div>
                            <div className="doc-item">
                                <FileText size={24} />
                                <div>
                                    <h5>CNIC Back</h5>
                                    <span>Verified</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button className="btn-edit-profile">Edit Profile</button>
                        <button className="btn-manage-bookings">Manage Bookings</button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default WorkerProfile;
