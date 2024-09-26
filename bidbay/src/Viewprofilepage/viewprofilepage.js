import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './viewprofile.css';

const ViewProfilePage = ({ user }) => {
    const [profileData, setProfileData] = useState(null);
    
    useEffect(() => {
        const fetchProfileData = async () => {
            const docRef = doc(firestore, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setProfileData(docSnap.data());
            } else {
                console.log("No such document!");
            }
        };

        fetchProfileData();
    }, [user.uid]);

    return (
        <div className="profile-window">
            <h2>Profile Details</h2>
            {profileData ? (
                <div>
                    <p><strong>Username:</strong> {profileData.username}</p>
                    <p><strong>First Name:</strong> {profileData.firstName}</p>
                    <p><strong>Last Name:</strong> {profileData.lastName}</p>
                    <p><strong>Gender:</strong> {profileData.gender}</p>
                    <p><strong>Birthdate:</strong> {profileData.birthdate}</p>
                    <p><strong>Address:</strong> {profileData.address}</p>
                </div>
            ) : (
                <p>Loading profile...</p>
            )}
        </div>
    );
};

export default ViewProfilePage;
