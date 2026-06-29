import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore, auth } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import './sellerpage.css';

function SellerPage() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);

    useEffect(() => { fetchItems(); }, []);

    const fetchItems = async () => {
        try {
            const itemsCollection = collection(firestore, 'items');
            const itemSnapshot = await getDocs(itemsCollection);
            setItems(itemSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    return (
        <div className="seller-page">
            <div className="seller-header">
                <div>
                    <h1>Seller Dashboard</h1>
                    <p>Manage your auction items</p>
                </div>
                <div className="seller-actions">
                    <button className="btn-primary" onClick={() => navigate('/addnewitem')}>+ Add Item</button>
                    <button className="btn-ghost" onClick={() => navigate('/viewitem')}>View Items</button>
                    <button className="btn-ghost" onClick={() => navigate(-1)}>Back</button>
                </div>
            </div>

            <div className="items-grid">
                {items.length > 0 ? items.map(item => (
                    <div key={item.id} className="item-card" onClick={() => navigate(`/itemdetail/${item.id}`)}>
                        {item.imageURL && <img src={item.imageURL} alt={item.name} />}
                        <div className="item-info">
                            <h3>{item.name}</h3>
                            <span className="item-price">${parseFloat(item.initialPrice).toFixed(2)}</span>
                        </div>
                    </div>
                )) : (
                    <div className="empty-state">
                        <p>No items yet. Add your first auction item!</p>
                        <button className="btn-primary" onClick={() => navigate('/addnewitem')}>+ Add Item</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SellerPage;