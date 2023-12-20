// PassportRoutes.js

import React from 'react';
import {Routes, Route} from 'react-router-dom';
import {PassportPage} from "../components/passport/PassportPage";

export const PassportRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<PassportPage/>}/>
        </Routes>
    );
};
