import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // Import the Firebase auth instance
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import signIn method
import './loginpage.css';

function Loginpage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Add error state
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setError(''); // Clear previous errors

        console.log("Attempting to log in with:", email, password); // Log email and password

        try {
            // Use Firebase to sign in
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Login successful!"); // Log on successful login
            navigate('/roleselection'); // Redirect to the Role Selection page
        } catch (error) {
            console.error("Error logging in:", error);
            setError(error.message); // Set error message
            alert('Invalid email or password'); // Notify the user
        }
    };

    const handleRegister = () => {
        navigate('/registration'); // Redirect to the Registration page
    };

    return (
        <div className="login-page">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>} {/* Display error message */}
            <form onSubmit={handleLogin}> {/* Form submission handler */}
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
                <button type="submit">Login</button>
            </form>
            <button onClick={handleRegister}>Register</button>
        </div>
    );
}

export default Loginpage;
