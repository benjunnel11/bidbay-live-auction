import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { firestore, storage, auth } from '../firebase'; 
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import './addnewitem.css'; 

function AddNewItem() {
    const navigate = useNavigate();
    const location = useLocation();
    const item = location.state?.item; // Get the item data from location state

    const [newItem, setNewItem] = useState(item ? item.name : '');
    const [initialPrice, setInitialPrice] = useState(item ? item.initialPrice : '');
    const [minIncrement, setMinIncrement] = useState(item ? item.minIncrement : '');
    const [imageFile, setImageFile] = useState(null);
    const [day, setDay] = useState(item ? item.day : '');
    const [startTime, setStartTime] = useState(item ? item.startTime : '');
    const [duration, setDuration] = useState(item ? item.duration : '');
    const [error, setError] = useState(''); 
    const [successMessage, setSuccessMessage] = useState(''); 

    // Replace this with the actual current user's seller ID
    const currentUserId = "sellerId"; 

    const handleAddOrEditItem = async () => {
        if (!newItem || !initialPrice || !minIncrement || !imageFile || !day || !startTime || !duration) {
            setError('All fields are required!');
            return;
        }
    
        try {
            let imageURL;
    
            // Upload the image if a new one is selected
            if (imageFile) {
                const storageRef = ref(storage, `items/${imageFile.name}`);
                await uploadBytes(storageRef, imageFile);
                imageURL = await getDownloadURL(storageRef);
            } else {
                imageURL = item.imageURL; // Use existing image URL for editing
            }
    
            if (item) {
                const itemRef = doc(firestore, 'items', item.id);
                await updateDoc(itemRef, {
                    name: newItem,
                    initialPrice: parseFloat(initialPrice),
                    minIncrement: parseFloat(minIncrement),
                    imageURL: imageURL,
                    day: day,
                    startTime: startTime,
                    duration: parseFloat(duration),
                });
            } else {
                // Save the item with seller ID
                await addDoc(collection(firestore, 'items'), {
                    name: newItem,
                    initialPrice: parseFloat(initialPrice),
                    minIncrement: parseFloat(minIncrement),
                    imageURL: imageURL,
                    day: day,
                    startTime: startTime,
                    duration: parseFloat(duration),
                    sellerId: auth.currentUser.uid, // Store the current user's ID
                });
            }
    
            setSuccessMessage('Item saved successfully');
            // Reset form fields...
        } catch (error) {
            console.error("Error saving item:", error);
            setError('Failed to save item. Please try again.');
        }
    };
    

    const handleBack = () => {
        navigate(-1); 
    };

    return (
        <div className="add-new-item">
            <h1>{item ? 'Edit Item' : 'Add New Item'}</h1>
            {error && <p className="error">{error}</p>} 
            {successMessage && <p className="success">{successMessage}</p>} 
            <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Enter new item name"
                required
            />
            <input
                type="number"
                value={initialPrice}
                onChange={(e) => setInitialPrice(e.target.value)}
                placeholder="Initial Price"
                required
            />
            <input
                type="number"
                value={minIncrement}
                onChange={(e) => setMinIncrement(e.target.value)}
                placeholder="Minimum Increment"
                required
            />
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
            />
            <input
                type="text"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                placeholder="Day of the Bid"
                required
            />
            <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
            />
            <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Duration (in hours)"
                required
            />
            <button className="action-button" onClick={handleAddOrEditItem}>
                {item ? 'Update Item' : 'Add New Item'}
            </button>
            <button className="action-button" onClick={handleBack}>Back</button>
        </div>
    );
}

export default AddNewItem;
