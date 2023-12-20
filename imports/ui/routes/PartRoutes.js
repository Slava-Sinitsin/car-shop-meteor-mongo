// PartRoutes.js

import React from 'react';
import {Routes, Route} from 'react-router-dom';
import {PartPage} from "../components/part/PartPage";

export const PartRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<PartPage/>}/>
        </Routes>
    );
};
