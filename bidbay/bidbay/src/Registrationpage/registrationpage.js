import React, { useState, useRef } from 'react'; // Import useRef
import { auth, firestore } from '../firebase'; // Import Firestore and Auth
import { collection, addDoc } from "firebase/firestore"; // Import Firestore methods
import { createUserWithEmailAndPassword } from "firebase/auth"; 
import { useNavigate } from 'react-router-dom'; 
import { doc, setDoc } from "firebase/firestore";
import './registrationpage.css';

const RegistrationPage = () => {
    const messageRef = useRef(); // Initialize useRef
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegistration = async (e) => {
        e.preventDefault();
        console.log(messageRef.current?.value); // Use optional chaining

        setError('');

        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save additional user info to Firestore
            await setDoc(doc(firestore, "users", user.uid), {
                username: username,
                email: email,
            });

            // Redirect to login page after successful registration
            navigate('/login');

        } catch (error) {
            console.error("Error registering user:", error);
            setError(error.message); // Display the error message
        }
    };

    return (
        <div className="registration-page">
            <h1>Register</h1>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleRegistration}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Register</button>
            </form>
            <button onClick={() => navigate('/login')}>Back to Login</button>
        </div>
    );
};

export default RegistrationPage;
