import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase'; 
import { doc, getDoc } from 'firebase/firestore'; 
import { useParams, useNavigate } from 'react-router-dom';
import './ItemDetailsPage.css'; // Make sure to import the CSS file

function ItemDetailsPage() {
    const { id } = useParams(); // Get item ID from URL parameters
    const [item, setItem] = useState(null); // State to hold item details
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItemDetails = async () => {
            const docRef = doc(firestore, 'items', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setItem({ id: docSnap.id, ...docSnap.data() });
            } else {
                console.error("No such document!");
            }
        };

        fetchItemDetails(); // Fetch item details when component mounts
    }, [id]);

    const handleEditItem = () => {
        navigate('/addnewitem', { state: { item } }); // Pass item data to AddNewItem
    };

    const handleBack = () => {
        navigate(-1); // Navigate to the previous page
    };

    return (
        <div className="item-details-page">
            {item ? (
                <>
                    <h1>{item.name}</h1>
                    <img src={item.imageURL} alt={item.name} />
                    <p>Initial Price: ${item.initialPrice}</p>
                    <p>Minimum Increment: ${item.minIncrement}</p>
                    <p>Day of the Bid: {item.day}</p>
                    <p>Start Time: {item.startTime}</p>
                    <p>Duration: {item.duration} hours</p>
                    <button onClick={handleEditItem}>Edit Item</button>
                    {/* Back Button */}
                    <button className="back-button" onClick={handleBack}>
                        Back
                    </button>
                </>
            ) : (
                <p>Loading item details...</p>
            )}
        </div>
    );
}

export default ItemDetailsPage;
