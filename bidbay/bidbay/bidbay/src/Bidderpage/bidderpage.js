import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../firebase'; // Import Firestore from your Firebase setup
import { collection, getDocs, addDoc } from 'firebase/firestore';
import './bidderpage.css';

function BidderPage() {
    const navigate = useNavigate();
    const [auctions, setAuctions] = useState([]); // State to store auctions data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(''); // Error state

    // Fetch auctions from Firestore when the page loads
    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const auctionsCollection = collection(firestore, 'auctions'); // Firestore collection 'auctions'
                const auctionSnapshot = await getDocs(auctionsCollection); // Get all docs from the collection
                const auctionList = auctionSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })); // Map the auction data
                setAuctions(auctionList); // Set auctions data to state
                setLoading(false);
            } catch (err) {
                setError('Failed to load auctions');
                setLoading(false);
            }
        };

        fetchAuctions(); // Call the function on component mount
    }, []);

    const handleBid = async (auctionId) => {
        try {
            const bidData = {
                auctionId: auctionId,
                bidder: 'Your Bidder Name', // You can get the bidder info from auth
                amount: 100, // Hardcoded bid amount for demonstration
                timestamp: new Date(),
            };
            await addDoc(collection(firestore, 'bids'), bidData); // Save the bid in 'bids' collection
            alert('Bid successfully placed!');
        } catch (error) {
            console.error('Error placing bid:', error);
            alert('Failed to place bid.');
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (loading) {
        return <div>Loading auctions...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="bidder-page">
            <h1>Welcome to the Bidder Page</h1>
            <p>Here you can view and manage your auctions and bids.</p>

            <div className="auction-list">
                <h2>Available Auctions</h2>
                {auctions.length > 0 ? (
                    auctions.map((auction) => (
                        <div key={auction.id} className="auction-item">
                            <h3>{auction.itemName}</h3>
                            <p>Starting Price: ${auction.startingPrice}</p>
                            <button onClick={() => handleBid(auction.id)}>Place Bid</button>
                        </div>
                    ))
                ) : (
                    <p>No auctions available.</p>
                )}
            </div>

            <div className="bidder-actions">
                <button className="action-button" onClick={handleBack}>Back</button>
            </div>
        </div>
    );
}

export default BidderPage;
