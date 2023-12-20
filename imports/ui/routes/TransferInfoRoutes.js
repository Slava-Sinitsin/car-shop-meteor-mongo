// TransferInfoRoutes.js

import React from 'react';
import {Routes, Route} from 'react-router-dom';
import {TransferInfoPage} from "../components/transfer_info/TransferInfoPage";

export const TransferInfoRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<TransferInfoPage/>}/>
        </Routes>
    );
};
