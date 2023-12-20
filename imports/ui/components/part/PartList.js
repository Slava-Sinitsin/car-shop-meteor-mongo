import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { PartCollection } from '../../../api/collections/PartCollection';
import { CarCollection } from '../../../api/collections/CarCollection';

export const PartList = () => {
    const { isLoading, partsWithCar } = useTracker(() => {
        const handleParts = Meteor.subscribe('part');
        const handleCars = Meteor.subscribe('car');
        const isLoading = !handleParts.ready() || !handleCars.ready();
        const parts = PartCollection.find().fetch();
        const cars = CarCollection.find().fetch();
        const partsWithCar = parts.map(part => {
            const car = cars.find(c => c._id === part.car_id);
            return {
                ...part,
                car: car || null
            };
        });
        return { isLoading, partsWithCar };
    });
    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <h2>List of parts</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Part Name</th>
                        <th>Car Name</th>
                        <th>Price</th>
                        <th>Count</th>
                    </tr>
                </thead>
                <tbody>
                    {partsWithCar.map((part) => (
                        <tr key={part._id}>
                            <td>{part._id}</td>
                            <td>{part.name}</td>
                            <td>{part.car.name}</td>
                            <td>{part.price}</td>
                            <td>{part.count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};