// UsedInfoRoutes.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { UsedInfoPage } from "../components/used_info/UsedInfoPage";

export const UsedInfoRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<UsedInfoPage />} />
        </Routes>
    );
};
