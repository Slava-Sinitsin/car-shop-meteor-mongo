import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { ClientSellerCollection } from '../../../api/collections/ClientSellerCollection';
import { PassportCollection } from '../../../api/collections/PassportCollection';
import { CarCollection } from '../../../api/collections/CarCollection';
import { CertifyingDocumentCollection } from '../../../api/collections/CertifyingDocumentCollection';

export const ClientSellerList = () => {
    const { isLoading, clientSellersWithDetails } = useTracker(() => {
        const handleClientSellers = Meteor.subscribe('client_seller');
        const handlePassports = Meteor.subscribe('passport');
        const handleCars = Meteor.subscribe('car');
        const handleCertifyingDocuments = Meteor.subscribe('certifying_document');
        const isLoading =
            !handleClientSellers.ready() ||
            !handlePassports.ready() ||
            !handleCars.ready() ||
            !handleCertifyingDocuments.ready();

        const clientSellers = ClientSellerCollection.find().fetch();
        const passports = PassportCollection.find().fetch();
        const cars = CarCollection.find().fetch();
        const certifyingDocuments = CertifyingDocumentCollection.find().fetch();
        const clientSellersWithDetails = clientSellers.map(clientSeller => {
            const passport = passports.find(p => p._id === clientSeller.passport_id);
            const car = cars.find(c => c._id === clientSeller.car_id);
            const certifyingDocument = certifyingDocuments.find(d => d._id === clientSeller.certifying_document_id);
            return {
                ...clientSeller,
                passport,
                car,
                certifyingDocument,
            };
        });
        return { isLoading, clientSellersWithDetails };
    });
    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <h2>List of client sellers</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Passport ID</th>
                        <th>Name</th>
                        <th>Car</th>
                        <th>Certifying Document</th>
                        <th>Purchase Date</th>
                    </tr>
                </thead>
                <tbody>
                    {clientSellersWithDetails.map((clientSeller) => (
                        <tr key={clientSeller._id}>
                            <td>{clientSeller._id}</td>
                            <td>{clientSeller.passport._id}</td>
                            <td>{`${clientSeller.passport.first_name} ${clientSeller.passport.middle_name} ${clientSeller.passport.second_name}`}</td>
                            <td>{clientSeller.car ? clientSeller.car.name : 'Unknown'}</td>
                            <td>{clientSeller.certifyingDocument.name}</td>
                            <td>{clientSeller.purchase_date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};