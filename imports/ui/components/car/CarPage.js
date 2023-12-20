import React from 'react';
import { CarCreateNew } from "./CarCreateNew";
import { CarCreateUsed } from "./CarCreateUsed";
import { CarSell } from "./CarSell";
import { CarList } from "./CarList";
import { CarEdit } from "./CarEdit";
import "../../styles/page.css"
import "../../styles/dialog.css"

export const CarPage = () => {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
                <CarCreateNew />
                <div style={{ marginLeft: '20px' }}></div>
                <CarCreateUsed />
                <div style={{ marginLeft: '20px' }}></div>
                <CarSell />
                <div style={{ marginLeft: '20px' }}></div>
                <CarEdit />
            </div>
            <CarList />
        </div>
    );
}