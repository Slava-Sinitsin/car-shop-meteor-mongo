import React from 'react';
import { ClientBuyerEdit } from "./ClientBuyerEdit";
import { ClientBuyerList } from "./ClientBuyerList";
import "../../styles/page.css"
import "../../styles/dialog.css"

export const ClientBuyerPage = () => {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
                <ClientBuyerEdit />
            </div>
            <ClientBuyerList />
        </div>
    );
}