import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { firestore } from '../firebase'; 
import { collection, getDocs } from 'firebase/firestore'; 
import './sellerpage.css'; 

function SellerPage() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchItems();
    }, []);

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

    const handleAddNewItem = () => {
        navigate('/addnewitem'); // Navigate to the Add New Item page
    };

    const handleViewMyItems = () => {
        navigate('/viewitem'); // Navigate to the View My Items page
    };

    const handleManageAuctions = () => {
        navigate('/manage-auctions'); // Navigate to Manage Auctions page
    };
    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="seller-page">
            <h1>Welcome to the Seller Page</h1>
            <p>This is where sellers can manage their items for auction.</p>
            <div className="seller-actions">
                <button className="action-button" onClick={handleAddNewItem}>Add New Item</button>
                <button className="action-button" onClick={handleViewMyItems}>View My Items</button>
                <button className="action-button" onClick={handleManageAuctions}>Manage Auctions</button>
                <button className="action-button" onClick={handleBack}>Back</button>
            </div>

            <div className="item-list">
                <h2>My Items</h2>
                <ul>
                    {items.length > 0 ? (
                        items.map(item => (
                            <li key={item.id}>{item.name}</li>
                        ))
                    ) : (
                        <li>No items available.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default SellerPage;
