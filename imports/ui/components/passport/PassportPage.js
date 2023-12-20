import React from 'react';
import { PassportList } from "./PassportList";
import { PassportEdit } from "./PassportEdit";
import "../../styles/page.css"
import "../../styles/dialog.css"

export const PassportPage = () => {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
                <PassportEdit />
            </div>
            <PassportList />
        </div>
    );
}