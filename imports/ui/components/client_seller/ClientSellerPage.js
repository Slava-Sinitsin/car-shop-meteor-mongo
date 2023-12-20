import React from 'react';
import { ClientSellerList } from "./ClientSellerList";
import { ClientSellerEdit } from "./ClientSellerEdit";
import "../../styles/page.css"
import "../../styles/dialog.css"

export const ClientSellerPage = () => {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
                <ClientSellerEdit />
            </div>
            <ClientSellerList />
        </div>
    );
}