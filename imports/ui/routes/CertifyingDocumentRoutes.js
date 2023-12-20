// CertifyingDocumentRoutes.js

import React from 'react';
import {Routes, Route} from 'react-router-dom';
import {CertifyingDocumentPage} from "../components/certifying_document/CertifyingDocumentPage";

export const CertifyingDocumentRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<CertifyingDocumentPage/>}/>
        </Routes>
    );
};
