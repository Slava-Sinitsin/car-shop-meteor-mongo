import React from 'react';
import { EmployeeChangePos } from "./EmployeeChangePos";
import { EmployeeAdd } from "./EmployeeAdd";
import { EmployeeFire } from "./EmployeeFire";
import { EmployeeEdit } from "./EmployeeEdit";
import { EmployeeList } from "./EmployeeList";
import "../../styles/page.css"
import "../../styles/dialog.css"

export const EmployeePage = () => {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
                <EmployeeChangePos />
                <div style={{ marginLeft: '20px' }}></div>
                <EmployeeAdd />
                <div style={{ marginLeft: '20px' }}></div>
                <EmployeeFire />
                <div style={{ marginLeft: '20px' }}></div>
                <EmployeeEdit />
            </div>
            <EmployeeList />
        </div>
    );
}