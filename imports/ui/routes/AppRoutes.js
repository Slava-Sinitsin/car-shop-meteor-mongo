// AppRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TransferInfoRoutes } from "./TransferInfoRoutes";
import { EmployeeRoutes } from "./EmployeeRoutes";
import { UsedInfoRoutes } from "./UsedInfoRoutes";
import { CarRoutes } from "./CarRoutes";
import { PartRoutes } from "./PartRoutes";
import { PassportRoutes } from "./PassportRoutes";
import { ClientBuyerRoutes } from "./ClientBuyerRoutes";
import { CertifyingDocumentRoutes } from "./CertifyingDocumentRoutes";
import { ClientSellerRoutes } from "./ClientSellerRoutes";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="transfer-info/*" element={<TransferInfoRoutes />} />
            <Route path="employee/*" element={<EmployeeRoutes />} />
            <Route path="used-info/*" element={<UsedInfoRoutes />} />
            <Route path="car/*" element={<CarRoutes />} />
            <Route path="part/*" element={<PartRoutes />} />
            <Route path="passport/*" element={<PassportRoutes />} />
            <Route path="client-buyer/*" element={<ClientBuyerRoutes />} />
            <Route path="certifying-document/*" element={<CertifyingDocumentRoutes />} />
            <Route path="client-seller/*" element={<ClientSellerRoutes />} />
        </Routes>
    );
};

export default AppRoutes;