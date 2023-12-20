import React from 'react';
import { CertifyingDocumentList } from "./CertifyingDocumentList";
import { CertifyingDocumentEdit } from "./CertifyingDocumentEdit";
import "../../styles/page.css"
import "../../styles/dialog.css"

export const CertifyingDocumentPage = () => {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
                <CertifyingDocumentEdit />
            </div>
            <CertifyingDocumentList />
        </div>
    );
}