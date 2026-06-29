import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import './roleselectionpage.css';

function RoleSelectionPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) navigate('/');
            setLoading(false);
        });
        return () => unsubscribe();
    }, [navigate]);

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="role-page">
            <div className="role-card">
                <h1>Choose Your Role</h1>
                <p className="role-sub">How would you like to use BidBay today?</p>
                <div className="role-options">
                    <div className="role-option" onClick={() => navigate('/seller')}>
                        <div className="role-icon">S</div>
                        <h3>Seller</h3>
                        <p>List items and manage your auctions</p>
                    </div>
                    <div className="role-option" onClick={() => navigate('/bidder')}>
                        <div className="role-icon">B</div>
                        <h3>Bidder</h3>
                        <p>Browse auctions and place bids</p>
                    </div>
                </div>
                <button className="btn-link" onClick={() => { auth.signOut(); navigate('/'); }}>Logout</button>
            </div>
        </div>
    );
}

export default RoleSelectionPage;