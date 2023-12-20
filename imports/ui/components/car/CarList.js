import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { CarCollection } from '../../../api/collections/CarCollection';
import { UsedInfoCollection } from '../../../api/collections/UsedInfoCollection';
import { ClientBuyerCollection } from '../../../api/collections/ClientBuyerCollection';

export const CarList = () => {
    const { isLoading, carsWithUsedInfo } = useTracker(() => {
        const handleCars = Meteor.subscribe('car');
        const handleUsedInfo = Meteor.subscribe('used_info');
        const handleclientBuyers = Meteor.subscribe('client_buyer');
        const isLoading = !handleCars.ready() || !handleUsedInfo.ready() || !handleclientBuyers.ready();
        const cars = CarCollection.find().fetch();
        const usedInfo = UsedInfoCollection.find().fetch();
        const clientBuyers = ClientBuyerCollection.find().fetch();
        const carsWithUsedInfo = cars.map(car => {
            const carUsedInfo = usedInfo.find(u => u._id === car.used_info_id);
            const carSold = clientBuyers.find(u => u.car_id === car._id);
            return {
                ...car,
                usedInfo: carUsedInfo || null,
                sold: carSold || null
            };
        });
        return { isLoading, carsWithUsedInfo };
    });
    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <h2>List of cars</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Used</th>
                        <th>Name</th>
                        <th>Color</th>
                        <th>Engine number</th>
                        <th>Reg number</th>
                        <th>Body number</th>
                        <th>Chassis number</th>
                        <th>Release date</th>
                        <th>Mileage</th>
                        <th>Release price</th>
                        <th>Sales price</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {carsWithUsedInfo.map((car) => (
                        <tr key={car._id}>
                            <td>{car._id}</td>
                            <td>{car.usedInfo && car.usedInfo._id === '1' ? 'No' : 'Yes'}</td>
                            <td>{car.name}</td>
                            <td>{car.color}</td>
                            <td>{car.engine_number}</td>
                            <td>{car.reg_number}</td>
                            <td>{car.body_number}</td>
                            <td>{car.chassis_number}</td>
                            <td>{car.release_date}</td>
                            <td>{car.mileage}</td>
                            <td>{car.release_price}</td>
                            <td>{car.sales_price}</td>
                            <td>{car.sold !== null ? 'Sold' : 'Not sold'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};