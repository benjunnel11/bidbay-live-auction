// ViewItemsPage.js
import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './ViewItemPage.css'; // Import the CSS file for styling

function ViewItemsPage() {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();
    const handleBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const itemsCollection = collection(firestore, 'items');
                const itemSnapshot = await getDocs(itemsCollection);
                const itemList = itemSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setItems(itemList);
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        fetchItems();
    }, []);

    const handleItemClick = (itemId) => {
        navigate(`/itemdetail/${itemId}`);
    };

    return (
        <div className="view-items-page">
            <h1>My Items</h1>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {items.map(item => (
                    <li key={item.id} style={{ margin: '20px 0', cursor: 'pointer' }}>
                        <img 
                            src={item.imageURL} 
                            alt={item.name} 
                            style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
                            onClick={() => handleItemClick(item.id)}
                        />
                        <div>{item.name}</div>
                    </li>
                ))}
            </ul>
            <button className='back-button' onClick={handleBack}>Back</button>
        </div>
    );
}

export default ViewItemsPage;
