import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Wrench, User, LogOut, Settings, LayoutDashboard, History, ChevronDown } from 'lucide-react';
import './Navbar.css';

import logo from '../assets/logo-kaamwala.png';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showBookingMenu, setShowBookingMenu] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkUser = () => {
            const userData = localStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            } else {
                setUser(null);
            }
        };

        checkUser();
        window.addEventListener('storage', checkUser);
        window.addEventListener('auth-change', checkUser);

        return () => {
            window.removeEventListener('storage', checkUser);
            window.removeEventListener('auth-change', checkUser);
        };
    }, []);

    // Close booking menu when clicking outside (optional but good UX, can be skipped if not strictly requested, but toggle is safer)
    useEffect(() => {
        const handleClickOutside = () => setShowBookingMenu(false);
        if (showBookingMenu) {
            window.addEventListener('click', handleClickOutside);
        }
        return () => window.removeEventListener('click', handleClickOutside);
    }, [showBookingMenu]);

    // Prevent closing when clicking inside the dropdown
    const handleBookingClick = (e) => {
        e.stopPropagation();
        setShowBookingMenu(!showBookingMenu);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setShowUserMenu(false);
        window.dispatchEvent(new Event('auth-change'));
        navigate('/login');
    };

    const navLinks = [
        { name: 'Home', path: '/home' },
        { name: 'Services', path: '/services' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    const getInitials = (user) => {
        const name = user.name || user.fullName;
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/home" className="nav-logo">
                    <img src={logo} alt="KaamWala Logo" className="logo-image" style={{ height: '90px', width: 'auto' }} />
                </Link>

                {/* Right Section Wrapper */}
                <div className="nav-right-section">

                    {/* Desktop Navigation Links */}
                    <div className="nav-links">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Booking Dropdown */}
                        <div
                            className="nav-item-dropdown"
                            onClick={handleBookingClick}
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                            <span className={`nav-link ${location.pathname.includes('booking') ? 'active' : ''}`}>
                                Booking
                            </span>
                            <ChevronDown size={16} color={location.pathname.includes('booking') ? '#07614A' : '#666'} />

                            {showBookingMenu && (
                                <div className="dropdown booking-dropdown">
                                    <Link to="/new-booking" className="dropdown-item">New Booking</Link>
                                    <Link to="/booking-history" className="dropdown-item">Booking History</Link>
                                    <Link to="/track-booking" className="dropdown-item">Track Booking</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Become a Worker Button - hide if worker is logged in */}
                    {(!user || user.role !== 'worker') && (
                        <Link to="/become-worker">
                            <button className="btn-become-worker">Become a Worker</button>
                        </Link>
                    )}

                    {/* Auth Section */}
                    <div className="nav-auth">
                        {user ? (
                            <div className="user-menu">
                                <div
                                    className="avatar"
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                >
                                    {getInitials(user)}
                                </div>

                                {showUserMenu && (
                                    <div className="dropdown user-dropdown-menu">
                                        <div className="dropdown-header">
                                            <p style={{ fontWeight: 600 }}>{user.name || user.fullName}</p>
                                            <p style={{ fontSize: '12px', color: '#666' }}>{user.email}</p>
                                        </div>
                                        {user.role === 'worker' ? (
                                            <Link to="/worker-profile" className="dropdown-item">
                                                <User size={14} style={{ marginRight: '8px' }} /> My Profile
                                            </Link>
                                        ) : (
                                            <Link to="/user-dashboard" className="dropdown-item">
                                                <LayoutDashboard size={14} style={{ marginRight: '8px' }} /> Dashboard
                                            </Link>
                                        )}
                                        <Link to="/booking-history" className="dropdown-item">
                                            <History size={14} style={{ marginRight: '8px' }} /> My Bookings
                                        </Link>
                                        <Link to="/settings" className="dropdown-item">
                                            <Settings size={14} style={{ marginRight: '8px' }} /> Settings
                                        </Link>
                                        <div style={{ borderTop: '1px solid #eee', marginTop: '5px' }}>
                                            <button
                                                onClick={handleLogout}
                                                className="dropdown-item btn-logout"
                                            >
                                                <LogOut size={14} style={{ marginRight: '8px' }} /> Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login">
                                    <button className="btn-login">Login</button>
                                </Link>
                                <Link to="/signup">
                                    <button className="btn-signup">Sign Up</button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="mobile-toggle"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="mobile-menu">
                    {user && (
                        <div className="mobile-user-info" style={{ padding: '10px', borderBottom: '1px solid #eee', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="avatar" style={{ width: '35px', height: '35px', fontSize: '14px' }}>{getInitials(user)}</div>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{user.name || user.fullName}</div>
                                <div style={{ fontSize: '12px', color: '#666' }}>{user.role === 'worker' ? 'Worker Account' : 'Customer Account'}</div>
                            </div>
                        </div>
                    )}
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={location.pathname === link.path ? 'active' : ''}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="mobile-dropdown-header">Booking</div>
                    <Link to="/new-booking" className="mobile-sublink" onClick={() => setIsOpen(false)}>New Booking</Link>
                    <Link to="/booking-history" className="mobile-sublink" onClick={() => setIsOpen(false)}>Booking History</Link>
                    <Link to="/track-booking" className="mobile-sublink" onClick={() => setIsOpen(false)}>Track Booking</Link>

                    {(!user || user.role !== 'worker') && (
                        <Link to="/become-worker" onClick={() => setIsOpen(false)}>
                            <button className="btn-become-worker mobile-btn">Become a Worker</button>
                        </Link>
                    )}

                    <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '10px' }}>
                        {user ? (
                            <button onClick={handleLogout} className="btn-logout" style={{ padding: '10px', width: '100%', textAlign: 'left' }}>Logout</button>
                        ) : (
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Link to="/login" onClick={() => setIsOpen(false)} style={{ flex: 1 }}>
                                    <button className="btn-login" style={{ width: '100%' }}>Login</button>
                                </Link>
                                <Link to="/signup" onClick={() => setIsOpen(false)} style={{ flex: 1 }}>
                                    <button className="btn-signup" style={{ width: '100%' }}>Sign Up</button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
