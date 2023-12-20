import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { PartCollection } from '../../../api/collections/PartCollection';
import { CarCollection } from '../../../api/collections/CarCollection';

export const PartEdit = () => {
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
            partSelect: '',
            carSelect: '',

            partID: '',
            carID: '',
            partName: '',
            price: '',
            count: ''
        });
    };

    const parts = useTracker(() => {
        Meteor.subscribe('part');
        return PartCollection.find().fetch();
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
            if (value == 'select') {
                setFieldsData((prevData) => ({
                    ...prevData,
                    carSelect: 'select',
                    partName: '',
                    price: '',
                    count: ''
                }));
            }
            const selectedPart = parts.find((part) => part._id == value);
            if (selectedPart) {
                setFieldsData((prevData) => ({
                    ...prevData,
                    partSelect: e.value,
                    carSelect: selectedPart.car_id,
                    partID: selectedPart._id,
                    carID: selectedPart.car_id,
                    partName: selectedPart.name,
                    price: selectedPart.price,
                    count: selectedPart.count
                }));
            }
        }

        if (name === 'carSelect' && value) {
            const selectedCar = cars.find((car) => car._id == value);
            if (selectedCar) {
                setFieldsData((prevData) => ({
                    ...prevData,
                    carSelect: e.value,
                    carID: selectedCar._id
                }));
            }
        }
    };

    const handlePartUpdate = async () => {
        const editedPart = {
            _id: fieldsData.partID,
            car_id: fieldsData.carID,
            name: fieldsData.partName,
            price: +fieldsData.price,
            count: +fieldsData.count
        };
        if (editedPart.count === 0) {
            await Meteor.call('part.delete', fieldsData.partID);
        } else {
            await Meteor.call('part.update', fieldsData.partID, editedPart);
        }
    };

    const handleSubmit = () => {
        if (fieldsData.partSelect != 'select' && fieldsData.carSelect != 'select') {
            handlePartUpdate();
        }
        closeDialog();
    };

    return (
        <div>
            <button className="open-dialog-button" onClick={openDialog}>
                Edit part
            </button>
            {isDialogOpen && (
                <div className="dialog-overlay">
                    <div className="dialog-content">
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <div className="column">
                                <h2>Part info</h2>
                                <div className="form-group">
                                    <label>Part name:</label>
                                    <select className="form-group" name="partSelect" value={fieldsData.partSelect} onChange={handleInputChange} style={{ width: '160px' }}>
                                        <option value="select">Select part</option>
                                        {parts.map((part) => (
                                            <option key={part._id} value={part._id}>
                                                {`${part._id} ${part.name}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginLeft: '20px' }}></div>
                            <div className="column">
                                <h2>Part properties</h2>
                                <label>Car name:</label>
                                <select className="form-group" name="carSelect" value={fieldsData.carSelect} onChange={handleInputChange}>
                                    <option value="select">Select car</option>
                                    {cars.map((car) => (
                                        <option key={car._id} value={car._id}>
                                            {`${car.name}`}
                                        </option>
                                    ))}
                                </select>
                                <div className="form-group">
                                    <label>Part name:</label>
                                    <input type="text" name="partName" value={fieldsData.partName} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Price:</label>
                                    <input type="text" name="price" value={fieldsData.price} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Count:</label>
                                    <input type="text" name="count" value={fieldsData.count} onChange={handleInputChange} />
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