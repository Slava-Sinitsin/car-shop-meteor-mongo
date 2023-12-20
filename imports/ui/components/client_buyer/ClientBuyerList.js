import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { PassportCollection } from '../../../api/collections/PassportCollection';
import { CarCollection } from '../../../api/collections/CarCollection';
import { ClientBuyerCollection } from '../../../api/collections/ClientBuyerCollection';

export const ClientBuyerList = () => {
    const { isLoading, clientBuyersWithPassportAndCar } = useTracker(() => {
        const handleClientBuyers = Meteor.subscribe('client_buyer');
        const handlePassports = Meteor.subscribe('passport');
        const handleCars = Meteor.subscribe('car');
        const isLoading = !handleClientBuyers.ready() || !handlePassports.ready() || !handleCars.ready();
        const clientBuyers = ClientBuyerCollection.find().fetch();
        const passports = PassportCollection.find().fetch();
        const cars = CarCollection.find().fetch();
        const clientBuyersWithPassportAndCar = clientBuyers.map(clientBuyer => {
            const passport = passports.find(p => p._id === clientBuyer.passport_id);
            const car = cars.find(c => c._id === clientBuyer.car_id);
            return {
                ...clientBuyer,
                passport: passport || null,
                car: car || null
            };
        });
        return { isLoading, clientBuyersWithPassportAndCar };
    });
    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <h2>List of client buyers</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Client passport ID</th>
                        <th>Client buyer name</th>
                        <th>Car name</th>
                        <th>Sale Date</th>
                        <th>Account number</th>
                        <th>Payment type</th>
                    </tr>
                </thead>
                <tbody>
                    {clientBuyersWithPassportAndCar.map((clientBuyer) => (
                        <tr key={clientBuyer._id}>
                            <td>{clientBuyer._id}</td>
                            <td>{clientBuyer.passport._id}</td>
                            <td>{`${clientBuyer.passport.first_name} ${clientBuyer.passport.middle_name} ${clientBuyer.passport.second_name}`}</td>
                            <td>{clientBuyer.car.name}</td>
                            <td>{clientBuyer.sale_date}</td>
                            <td>{clientBuyer.account_number}</td>
                            <td>{clientBuyer.payment_type}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};