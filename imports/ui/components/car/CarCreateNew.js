import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { CarCollection } from '../../../api/collections/CarCollection';
import { useTracker } from 'meteor/react-meteor-data';

export const CarCreateNew = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [fieldsData, setFieldsData] = useState({
        id: '',
        usedInfoId: '1',
        name: '',
        color: '',
        engineNumber: '',
        regNumber: '',
        bodyNumber: '',
        chassisNumber: '',
        releaseDate: '',
        mileage: '',
        releasePrice: '',
        salesPrice: ''
    });

    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setFieldsData({
            id: '',
            usedInfoId: '',
            name: '',
            color: '',
            engineNumber: '',
            regNumber: '',
            bodyNumber: '',
            chassisNumber: '',
            releaseDate: '',
            mileage: '',
            releasePrice: '',
            salesPrice: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFieldsData({
            ...fieldsData,
            [name]: value
        });
    };

    const handleDateChange = (name, date) => {
        setFieldsData({
            ...fieldsData,
            [name]: date
        });
    };

    const cars = useTracker(() => {
        Meteor.subscribe('car');
        return CarCollection.find().fetch();
    });

    const handleCreateCarNew = async () => {
        const newCar = {
            _id: `${cars.length + 1}`,
            used_info_id: fieldsData.usedInfoId,
            name: fieldsData.name,
            color: fieldsData.color,
            engine_number: fieldsData.engineNumber,
            reg_number: fieldsData.regNumber,
            body_number: fieldsData.bodyNumber,
            chassis_number: fieldsData.chassisNumber,
            release_date: format(fieldsData.releaseDate, 'yyyy-MM-dd'),
            mileage: +fieldsData.mileage,
            release_price: +fieldsData.releasePrice,
            sales_price: +fieldsData.salesPrice
        };
        await Meteor.call('car.insert', newCar);
    };

    const handleSave = () => {
        handleCreateCarNew();
        closeDialog();
    };
    return (
        <div>
            <button className="open-dialog-button" onClick={openDialog}>
                Add new car
            </button>
            {isDialogOpen && (
                <div className="dialog-overlay">
                    <div className="dialog-content">
                        <h2>Car info</h2>
                        <div className="form-group">
                            <label>Name:</label>
                            <input type="text" name="name" value={fieldsData.name} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Color:</label>
                            <input type="text" name="color" value={fieldsData.color} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Engine Number:</label>
                            <input type="text" name="engineNumber" value={fieldsData.engineNumber} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Reg Number:</label>
                            <input type="text" name="regNumber" value={fieldsData.regNumber} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Body Number:</label>
                            <input type="text" name="bodyNumber" value={fieldsData.bodyNumber} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Chassis Number:</label>
                            <input type="text" name="chassisNumber" value={fieldsData.chassisNumber} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Release Date:</label>
                            <DatePicker
                                name="releaseDate"
                                selected={fieldsData.releaseDate}
                                onChange={(date) => handleDateChange("releaseDate", date)}
                                dateFormat="yyyy-MM-dd"
                            />
                        </div>
                        <div className="form-group">
                            <label>Mileage:</label>
                            <input type="text" name="mileage" value={fieldsData.mileage} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Release Price:</label>
                            <input type="text" name="releasePrice" value={fieldsData.releasePrice} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Sales Price:</label>
                            <input type="text" name="salesPrice" value={fieldsData.salesPrice} onChange={handleInputChange} />
                        </div>
                        <div className="button-group">
                            <button className="cancel-button" onClick={closeDialog}>
                                Cancel
                            </button>
                            <button className="save-button" onClick={handleSave}>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};