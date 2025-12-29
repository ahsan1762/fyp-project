import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Star, MapPin, Wrench, Zap, Hammer, HardHat, Wind, Settings } from 'lucide-react';
import './Services.css';

const Services = () => {
    const [searchParams] = useSearchParams();
    const serviceType = searchParams.get('type');
    const locationSearch = searchParams.get('location');
    const [providers, setProviders] = useState([]);

    const serviceCategories = [
        { name: 'Plumber', icon: Wrench, desc: ['Pipe Repair', 'Leak Fixing', 'Bathroom Fitting'] },
        { name: 'Electrician', icon: Zap, desc: ['Wiring', 'Fan Installation', 'Light Fitting'] },
        { name: 'Carpenter', icon: Hammer, desc: ['Furniture Assembly', 'Door Repair', 'Custom Work'] },
        { name: 'Mason', icon: HardHat, desc: ['Brickwork', 'Plastering', 'Tiling'] },
        { name: 'AC & Repair', icon: Wind, desc: ['AC Installation', 'Repair', 'Gas Charging'] },
        { name: 'General', icon: Settings, desc: ['Furniture Assembly', 'TV Mounting', 'Painting'] },
    ];

    useEffect(() => {
        // Islamabad Areas
        const areas = [
            "F-6 (Super Market)", "F-7 (Jinnah Super)", "F-8", "F-10", "F-11",
            "G-6", "G-9", "G-10", "G-11", "I-8"
        ];

        // Generate a larger set of mock data to ensure more combinations
        const providerNames = [
            "Ahmed Ali", "Muhammad Usman", "Bilal Khan", "Kamran Sheikh",
            "Hassan Raza", "Omer Farooq", "Zain Malik", "Yasir Ahmed",
            "Rizwan Shah", "Fahad Mustafa", "Saad Ullah", "Waqas Chaudhry",
            "Zeeshan Ali", "Hamza Khan", "Arsalan Malik", "Imran Khan",
            "Adeel Ahmed", "Salman Shah", "Faisal Qureshi", "Umair Jadoon"
        ];

        const mockProviders = Array.from({ length: 40 }).map((_, i) => {
            const type = serviceCategories[i % serviceCategories.length].name;
            const area = areas[Math.floor(Math.random() * areas.length)];
            const name = providerNames[i % providerNames.length];

            return {
                id: i,
                name: name,
                specialty: type,
                location: area,
                rating: (4.0 + (Math.random() * 1.0)).toFixed(1),
                reviews: Math.floor(Math.random() * 150) + 5,
                price: (Math.floor(Math.random() * 25) + 8) * 100, // PKR range
                image: `https://i.pravatar.cc/300?img=${(i % 50) + 1}`,
                bio: `Professional ${type} with extensive experience serving the ${area} community. Committed to providing reliable and high-quality work at fair prices.`
            };
        });

        // Strict Filter: Only show the exact service and location requested
        if (serviceType || locationSearch) {
            const filtered = mockProviders.filter(p => {
                const matchType = serviceType ? p.specialty.toLowerCase() === serviceType.toLowerCase() : true;
                const matchLoc = locationSearch ? p.location.toLowerCase() === locationSearch.toLowerCase() : true;
                return matchType && matchLoc;
            });
            setProviders(filtered);
        } else {
            setProviders(mockProviders);
        }
    }, [serviceType, locationSearch]);

    const reviews = [
        { name: "Fatima Noor", location: "F-10 Islamabad", rating: 5, text: "Excellent plumbing service! The professional arrived on time and fixed the leakage issue perfectly. Highly recommended!" },
        { name: "Abdullah Khan", location: "G-11 Islamabad", rating: 5, text: "Very satisfied with the electrician. He installed the ceiling fans very neatly. Fair pricing in PKR too." },
        { name: "Sana Ahmed", location: "I-8 Islamabad", rating: 4, text: "Good carpenter service for furniture repair. Professional behavior and efficient work." }
    ];

    return (
        <div className="services-page">
            <Navbar />

            {/* Hero Section */}
            <div className="services-hero">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1>Professional Home Services in Islamabad</h1>
                    <p>Verified experts for all your home maintenance needs. Book Instantly.</p>
                </div>
            </div>

            {/* Providers Listing */}
            <section className="section bg-light">
                <div className="services-header" style={{ backgroundColor: 'transparent', color: '#333', padding: '0 20px 40px' }}>
                    {serviceType ? (
                        <>
                            <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>{serviceType}s {locationSearch ? `in ${locationSearch}` : 'Available'}</h2>
                            <p style={{ color: '#666' }}>Top rated professionals ready to help</p>
                        </>
                    ) : (
                        <>
                            <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>All Available Professionals</h2>
                            <p style={{ color: '#666' }}>Browse our top rated experts across Islamabad</p>
                        </>
                    )}
                </div>

                <div className="services-container">
                    {providers.length > 0 ? (
                        providers.map((provider) => (
                            <div key={provider.id} className="provider-card">
                                <img src={provider.image} alt={provider.name} className="provider-image" />
                                <div className="provider-details">
                                    <div className="provider-header">
                                        <h3 className="provider-name">{provider.name}</h3>
                                        <div className="provider-rating">
                                            <Star size={16} fill="#eab308" stroke="#eab308" />
                                            <span>{provider.rating}</span>
                                            <span style={{ color: '#999', fontSize: '12px', fontWeight: 'normal' }}>({provider.reviews})</span>
                                        </div>
                                    </div>

                                    <p className="provider-specialty">{provider.specialty}</p>
                                    <div className="provider-location">
                                        <MapPin size={14} />
                                        <span>{provider.location}</span>
                                    </div>

                                    <p className="provider-bio">{provider.bio}</p>
                                    <p className="provider-price">Starting from <span className="currency">PKR</span> {provider.price}</p>

                                    <button className="book-provider-btn">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            <h2>No professionals found</h2>
                            <p>Try searching for a different service or location.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Service Categories (Our Services) */}
            <section className="section bg-white">
                <div className="section-header">
                    <h2 className="section-title">Our Services</h2>
                    <p className="section-subtitle">Comprehensive solutions for your home</p>
                </div>
                <div className="services-grid">
                    {serviceCategories.map((service) => (
                        <div key={service.name} className="service-category-card">
                            <div className="service-icon-wrapper">
                                <service.icon size={32} />
                            </div>
                            <h3 className="category-title">{service.name}</h3>
                            <ul className="category-features">
                                {service.desc.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Customer Reviews */}
            <section className="section bg-white">
                <div className="section-header">
                    <h2 className="section-title">Customer Reviews</h2>
                    <p className="section-subtitle">What people in Islamabad are saying</p>
                </div>
                <div className="reviews-grid">
                    {reviews.map((review, i) => (
                        <div key={i} className="review-card">
                            <div className="review-header">
                                <div className="initial-circle">{review.name.charAt(0)}</div>
                                <div className="reviewer-info">
                                    <h4>{review.name}</h4>
                                    <span>{review.location}</span>
                                </div>
                            </div>
                            <div className="review-rating">
                                {[...Array(5)].map((_, idx) => (
                                    <Star key={idx} size={16} fill={idx < review.rating ? "#eab308" : "none"} stroke="#eab308" />
                                ))}
                            </div>
                            <p className="review-text">"{review.text}"</p>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Services;
