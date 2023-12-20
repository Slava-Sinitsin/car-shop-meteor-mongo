// ClientSellerRoutes.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ClientSellerPage } from "../components/client_seller/ClientSellerPage";

export const ClientSellerRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<ClientSellerPage />} />
        </Routes>
    );
};
