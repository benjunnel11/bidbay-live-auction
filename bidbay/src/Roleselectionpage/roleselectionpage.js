import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // Adjust this path as necessary
import ViewProfilePage from '../Viewprofilepage/viewprofilepage'; // Import the profile page
import './roleselectionpage.css';

function RoleSelectionPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [showProfile, setShowProfile] = useState(false); // State to control profile visibility

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                console.log('Authenticated user:', user); // Log authenticated user
            } else {
                console.log('No user authenticated'); // Log if no user is authenticated
                navigate('/'); // Redirect to login if not authenticated
            }
            setLoading(false);
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>; // Optional loading state
    }

    return (
        <div className="role-selection-page">
            <h1>Role Selection Page</h1>
            <p>Please select your role:</p>
            <button onClick={() => navigate('/seller')}>Seller</button>
            <button onClick={() => navigate('/bidder')}>Bidder</button>
            <button onClick={() => setShowProfile(true)}>View Profile Details</button> {/* New button */}
            <button onClick={() => navigate('/')}>Back to Login</button>

            {/* Render the ViewProfilePage if showProfile is true */}
            {showProfile && <ViewProfilePage user={user} />}
        </div>
    );
}

export default RoleSelectionPage;
