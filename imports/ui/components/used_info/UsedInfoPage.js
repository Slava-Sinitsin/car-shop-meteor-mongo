import React from 'react';
import { UsedInfoEdit } from "./UsedInfoEdit";
import { UsedInfoList } from "./UsedInfoList";
import "../../styles/page.css"
import "../../styles/dialog.css"

export const UsedInfoPage = () => {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
                <UsedInfoEdit />
            </div>
            <UsedInfoList />
        </div>
    );
}