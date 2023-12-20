import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { CertifyingDocumentCollection } from '../../../api/collections/CertifyingDocumentCollection';

export const CertifyingDocumentList = () => {
    const { isLoading, certifyingDocuments } = useTracker(() => {
        const handleCertifyingDocuments = Meteor.subscribe('certifying_document');
        const isLoading = !handleCertifyingDocuments.ready();
        const certifyingDocuments = CertifyingDocumentCollection.find().fetch();
        return { isLoading, certifyingDocuments };
    });
    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <h2>List of certifying documents</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Certifying document ID</th>
                        <th>Name</th>
                        <th>Issue Date</th>
                        <th>Issuer</th>
                    </tr>
                </thead>
                <tbody>
                    {certifyingDocuments.map((document) => (
                        <tr key={document._id}>
                            <td>{document._id}</td>
                            <td>{document.name}</td>
                            <td>{document.issue_date}</td>
                            <td>{document.issuer}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};