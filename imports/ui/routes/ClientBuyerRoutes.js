// ClientBuyerRoutes.js

import React from 'react';
import {Routes, Route} from 'react-router-dom';
import {ClientBuyerPage} from "../components/client_buyer/ClientBuyerPage";

export const ClientBuyerRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<ClientBuyerPage/>}/>
        </Routes>
    );
};
