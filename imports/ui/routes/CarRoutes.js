// CarRoutes.js

import React from 'react';
import {Routes, Route} from 'react-router-dom';
import {CarPage} from "../components/car/CarPage";

export const CarRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<CarPage/>}/>
        </Routes>
    );
};
