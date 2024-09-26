import React, { useState } from 'react';
import { firestore } from '../firebase'; // Adjust the import path as necessary
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './registrationpage.css';
import { auth } from '../firebase'; // Import auth

const RegistrationPage2 = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const uid = auth.currentUser?.uid; // Get the UID of the currently authenticated user

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Check if the user is authenticated
        if (!uid) {
            setError("User not authenticated.");
            return;
        }

        try {
            // Save personal info to Firestore under the personalInfo subcollection
            await setDoc(doc(firestore, 'users', uid, 'personalInfo', 'personalData'), {
                firstName,
                lastName,
                gender,
                birthdate,
                address,
            });

            navigate('/login'); // Redirect to login or another page after successful registration

        } catch (error) {
            console.error("Error saving user info:", error);
            setError(error.message);
        }
    };

    return (
        <div className="registration-page">
            <h1>Complete Your Registration</h1>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                />
                <input
                    type="date"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default RegistrationPage2;
