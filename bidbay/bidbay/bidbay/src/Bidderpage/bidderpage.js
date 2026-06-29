import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore, auth } from '../firebase';
import { collection, getDocs, addDoc, query, where, orderBy, limit } from 'firebase/firestore';
import './bidderpage.css';

function BidderPage() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bidAmounts, setBidAmounts] = useState({});

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const itemsCollection = collection(firestore, 'items');
                const itemSnapshot = await getDocs(itemsCollection);
                const itemList = itemSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                for (let item of itemList) {
                    const bidsQuery = query(
                        collection(firestore, 'bids'),
                        where('auctionId', '==', item.id),
                        orderBy('amount', 'desc'),
                        limit(1)
                    );
                    const bidSnap = await getDocs(bidsQuery).catch(() => null);
                    item.highestBid = bidSnap && !bidSnap.empty ? bidSnap.docs[0].data().amount : item.initialPrice;
                    item.bidCount = bidSnap ? bidSnap.size : 0;
                }

                setItems(itemList);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching items:', err);
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    const handleBid = async (item) => {
        const amount = parseFloat(bidAmounts[item.id]);
        if (!amount || amount <= 0) {
            alert('Please enter a valid bid amount');
            return;
        }
        const minBid = (item.highestBid || item.initialPrice) + (item.minIncrement || 1);
        if (amount < minBid) {
            alert(`Bid must be at least $${minBid.toFixed(2)}`);
            return;
        }

        try {
            const user = auth.currentUser;
            await addDoc(collection(firestore, 'bids'), {
                auctionId: item.id,
                bidder: user ? user.email : 'Anonymous',
                amount: amount,
                timestamp: new Date(),
            });
            alert(`Bid of $${amount.toFixed(2)} placed on ${item.name}!`);
            item.highestBid = amount;
            setItems([...items]);
            setBidAmounts({ ...bidAmounts, [item.id]: '' });
        } catch (error) {
            console.error('Error placing bid:', error);
            alert('Failed to place bid.');
        }
    };

    if (loading) return <div className="loading">Loading auctions...</div>;

    return (
        <div className="bidder-page">
            <div className="bidder-header">
                <h1>Live Auctions</h1>
                <p>Browse items and place your bids</p>
            </div>

            <div className="auction-grid">
                {items.length > 0 ? items.map(item => (
                    <div key={item.id} className="auction-card">
                        {item.imageURL && <img src={item.imageURL} alt={item.name} className="auction-img" />}
                        <div className="auction-body">
                            <h3>{item.name}</h3>
                            <div className="auction-meta">
                                <div className="meta-row">
                                    <span className="meta-label">Starting Price</span>
                                    <span className="meta-val">${parseFloat(item.initialPrice).toFixed(2)}</span>
                                </div>
                                <div className="meta-row highlight">
                                    <span className="meta-label">Current Bid</span>
                                    <span className="meta-val">${parseFloat(item.highestBid || item.initialPrice).toFixed(2)}</span>
                                </div>
                                <div className="meta-row">
                                    <span className="meta-label">Min Increment</span>
                                    <span className="meta-val">+${parseFloat(item.minIncrement || 1).toFixed(2)}</span>
                                </div>
                                {item.day && <div className="meta-row"><span className="meta-label">Auction Day</span><span className="meta-val">{item.day}</span></div>}
                            </div>
                            <div className="bid-input-row">
                                <input
                                    type="number"
                                    placeholder={`Min $${((item.highestBid || item.initialPrice) + (item.minIncrement || 1)).toFixed(2)}`}
                                    value={bidAmounts[item.id] || ''}
                                    onChange={(e) => setBidAmounts({ ...bidAmounts, [item.id]: e.target.value })}
                                />
                                <button onClick={() => handleBid(item)}>Bid</button>
                            </div>
                        </div>
                    </div>
                )) : <p className="no-items">No items available for auction yet.</p>}
            </div>

            <div className="bidder-actions">
                <button className="btn-back" onClick={() => navigate(-1)}>Back</button>
            </div>
        </div>
    );
}

export default BidderPage;