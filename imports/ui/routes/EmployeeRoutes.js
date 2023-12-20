// EmployeeRoutes.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { EmployeePage } from "../components/employee/EmployeePage";

export const EmployeeRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<EmployeePage />} />
        </Routes>
    );
};
