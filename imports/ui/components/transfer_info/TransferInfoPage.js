import React from 'react';
import { TransferInfoList } from "./TransferInfoList";
import { TransferInfoEdit } from "./TransferInfoEdit";
import "../../styles/page.css"
import "../../styles/dialog.css"

export const TransferInfoPage = () => {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
                <TransferInfoEdit />
            </div>
            <TransferInfoList />
        </div>
    );
}