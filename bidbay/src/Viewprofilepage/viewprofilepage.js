import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase'; // Adjust this path as necessary
import { doc, getDoc } from 'firebase/firestore';
import './viewprofilepage.css';

const ViewProfilePage = () => {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const user = auth.currentUser; // Get the current authenticated user
                if (user) {
                    const userDoc = doc(firestore, 'users', user.uid); // Reference to the user's document
                    const userSnap = await getDoc(userDoc); // Fetch the document

                    if (userSnap.exists()) {
                        setUsername(userSnap.data().username); // Set username from Firestore
                    } else {
                        setError('No user profile found.');
                    }
                } else {
                    setError('No user is logged in.');
                }
            } catch (err) {
                console.error("Error fetching user profile:", err);
                setError('Error fetching user profile');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    return (
        <div className="profile-window">
            <h2>User Profile</h2>
            {error && <p className="error-message">{error}</p>}
            <p>Username: {username}</p>
        </div>
    );
};

export default ViewProfilePage;
