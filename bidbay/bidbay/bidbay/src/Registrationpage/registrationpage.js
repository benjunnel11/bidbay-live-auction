import React, { useState } from 'react';
import { auth, firestore } from '../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from "firebase/firestore";
import './registrationpage.css';

const RegistrationPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegistration = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(firestore, "users", user.uid), {
                username: username,
                email: email,
            });

            alert('Registration successful! Please log in.');
            navigate('/');
        } catch (error) {
            console.error("Error registering user:", error);
            setError(error.message);
        }
    };

    return (
        <div className="registration-page">
            <div className="reg-card">
                <h1>Create Account</h1>
                <p className="reg-sub">Join BidBay and start bidding</p>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleRegistration}>
                    <div className="field">
                        <label>Username</label>
                        <input type="text" placeholder="Choose a username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="field">
                        <label>Email</label>
                        <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="field">
                        <label>Password</label>
                        <input type="password" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn-primary">Register</button>
                </form>
                <button className="btn-link" onClick={() => navigate('/')}>Already have an account? Login</button>
            </div>
        </div>
    );
};

export default RegistrationPage;