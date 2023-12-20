import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { PartCollection } from '../../../api/collections/PartCollection';
import { CarCollection } from '../../../api/collections/CarCollection';

export const PartRepair = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [fieldsData, setFieldsData] = useState({
        partSelect: 'select',
        carSelect: 'select',

        partID: '',
        carID: '',
        partName: '',
        price: '',
        count: ''
    });

    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setFieldsData({
            partSelect: 'select',
            carSelect: 'select',

            partID: '',
            carID: '',
            partName: '',
            price: '',
            count: ''
        });
    };

    const carParts = useTracker(() => {
        Meteor.subscribe('part');
        Meteor.subscribe('car');
        const selectedCar = CarCollection.findOne({ _id: fieldsData.carSelect });
        const filteredParts = PartCollection.find({ car_id: selectedCar ? selectedCar._id : null }).fetch();
        return filteredParts;
    });

    const cars = useTracker(() => {
        Meteor.subscribe('car');
        return CarCollection.find().fetch();
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFieldsData({
            ...fieldsData,
            [name]: value
        });

        if (name === 'partSelect' && value) {
            const selectedPart = carParts.find((part) => part._id == value);
            if (selectedPart) {
                setFieldsData((prevData) => ({
                    ...prevData,
                    partSelect: e.value,
                    partID: selectedPart._id,
                    carID: selectedPart.car_id,
                    partName: selectedPart.name,
                    price: selectedPart.price,
                    count: selectedPart.count
                }));
            }
        }
    };

    const handleCarRepair = async () => {
        const editedPart = {
            _id: fieldsData.partID,
            car_id: fieldsData.carID,
            name: fieldsData.partName,
            price: +fieldsData.price,
            count: +fieldsData.count - 1
        };
        if (editedPart.count === 0) {
            await Meteor.call('part.delete', fieldsData.partID);
        } else {
            await Meteor.call('part.update', fieldsData.partID, editedPart);
        }
    };

    const handleSubmit = () => {
        if (fieldsData.partSelect != 'select') {
            handleCarRepair();
        }
        closeDialog();
    };

    return (
        <div>
            <button className="open-dialog-button" onClick={openDialog}>
                Repair car
            </button>
            {isDialogOpen && (
                <div className="dialog-overlay">
                    <div className="dialog-content">
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <div className="column">
                                <h2>Car info</h2>
                                <div className="form-group">
                                    <label>Car name:</label>
                                    <select className="form-group" name="carSelect" value={fieldsData.carSelect} onChange={handleInputChange}>
                                        <option value="select">Select car</option>
                                        {cars.map((car) => (
                                            <option key={car._id} value={car._id}>
                                                {`${car.name}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginLeft: '20px' }}></div>
                            <div className="column">
                                <h2>Part info</h2>
                                <div className="form-group">
                                    <label>Part name:</label>
                                    <select className="form-group" name="partSelect" value={fieldsData.partSelect} onChange={handleInputChange} style={{ width: '160px' }}>
                                        <option value="select">Select part</option>
                                        {carParts.map((part) => (
                                            <option key={part._id} value={part._id}>
                                                {`${part.name}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="button-group">
                            <button className="cancel-button" onClick={closeDialog}>
                                Cancel
                            </button>
                            <button className="save-button" onClick={handleSubmit}>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};