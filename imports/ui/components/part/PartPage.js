import React from 'react';
import { PartList } from "./PartList";
import { PartRepair } from "./PartRepair";
import { PartEdit } from "./PartEdit";
import "../../styles/page.css"
import "../../styles/dialog.css"

export const PartPage = () => {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
                <PartRepair />
                <div style={{ marginLeft: '20px' }}></div>
                <PartEdit />
            </div>
            <PartList />
        </div>
    );
}