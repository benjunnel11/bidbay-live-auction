import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loginpage from './Loginpage/loginpage';
import Registrationpage from './Registrationpage/registrationpage'; 
import RoleSelectionPage from './Roleselectionpage/roleselectionpage';
import SellerPage from './Sellerpage/sellerpage';
import BidderPage from './Bidderpage/bidderpage';
import ViewItemsPage from './Viewitempage/ViewItemPage';
import AddNewItem from './AddNewItem/addnewitem';
import ItemDetailsPage from './ItemDetailsPage/ItemDetailsPage';
import './App.css';
import './firebase';

function App() {
    return (
        <React.StrictMode>
            <Router>
                <Routes>
                    <Route path='/' element={<Loginpage />} />
                    <Route path='/registration' element={<Registrationpage />} />
                    <Route path='/roleselection' element={<RoleSelectionPage />} /> 
                    <Route path='/seller' element={<SellerPage />} />
                    <Route path='/bidder' element={<BidderPage />} />
                    <Route path='/viewitem' element={<ViewItemsPage />} />
                    <Route path='/addnewitem' element={<AddNewItem />} />
                    <Route path='/itemdetail/:id' element={<ItemDetailsPage />} /> {/* Updated Route */}
                    <Route path='*' element={<Loginpage />} />
                </Routes>
            </Router>
        </React.StrictMode>
    );
}

export default App;
