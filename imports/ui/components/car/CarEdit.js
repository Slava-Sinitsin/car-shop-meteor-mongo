import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO, format } from 'date-fns';
import { CarCollection } from '../../../api/collections/CarCollection';

export const CarEdit = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [fieldsData, setFieldsData] = useState({
        carSelect: 'select',
        id: '',
        usedInfoID: '',
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
            carSelect: '',
            id: '',
            usedInfoID: '',
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

        if (name === 'carSelect' && value) {
            if (value == 'select') {
                setFieldsData((prevData) => ({
                    ...prevData,
                    id: '',
                    usedInfoID: '',
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
                }));
            }
            const selectedCar = cars.find((car) => car._id == value);
            if (selectedCar) {
                setFieldsData((prevData) => ({
                    ...prevData,
                    id: selectedCar._id,
                    usedInfoID: selectedCar.used_info_id,
                    name: selectedCar.name,
                    color: selectedCar.color,
                    engineNumber: selectedCar.engine_number,
                    regNumber: selectedCar.reg_number,
                    bodyNumber: selectedCar.body_number,
                    chassisNumber: selectedCar.chassis_number,
                    releaseDate: selectedCar.release_date ? parseISO(selectedCar.release_date) : null,
                    mileage: selectedCar.mileage,
                    releasePrice: selectedCar.release_price,
                    salesPrice: selectedCar.sales_price
                }));
            }
        }
    };

    const handleDateChange = (name, date) => {
        setFieldsData({
            ...fieldsData,
            [name]: date
        });
    };

    const handleCarUpdate = async () => {
        const editedCar = {
            _id: fieldsData.id,
            used_info_id: fieldsData.usedInfoID,
            name: fieldsData.name,
            color: fieldsData.color,
            engine_number: fieldsData.engineNumber,
            reg_number: fieldsData.regNumber,
            body_number: fieldsData.bodyNumber,
            chassis_number: fieldsData.chassisNumber,
            release_date: format(fieldsData.releaseDate, 'yyyy-MM-dd'),
            mileage: +fieldsData.mileage,
            release_price: +fieldsData.releasePrice,
            sales_price: +fieldsData.salesPrice,
        }

        await Meteor.call('car.update', fieldsData.id, editedCar);
    };

    const handleSubmit = () => {
        if (fieldsData.carSelect != 'select') {
            handleCarUpdate();
        }
        closeDialog();
    };

    return (
        <div>
            <button className="open-dialog-button" onClick={openDialog}>
                Edit car
            </button>
            {isDialogOpen && (
                <div className="dialog-overlay">
                    <div className="dialog-content">
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <div className="column">
                                <h2>Used info</h2>
                                <div className="form-group">
                                    <label>Used info ID:</label>
                                    <select className="form-group" name="carSelect" value={fieldsData.carSelect} onChange={handleInputChange}>
                                        <option value="select">Select car</option>
                                        {cars.map((car) => (
                                            <option key={car._id} value={car._id}>
                                                {`${car.name} ${car.reg_number}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginLeft: '20px' }}></div>
                            <div className="column">
                                <h2>Car properties</h2>
                                <div className="form-group">
                                    <label>Name:</label>
                                    <input type="text" name="name" value={fieldsData.name} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Color:</label>
                                    <input type="text" name="color" value={fieldsData.color} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Engine number:</label>
                                    <input type="text" name="engineNumber" value={fieldsData.engineNumber} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Reg number:</label>
                                    <input type="text" name="regNumber" value={fieldsData.regNumber} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Body number:</label>
                                    <input type="text" name="bodyNumber" value={fieldsData.bodyNumber} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Chassis number:</label>
                                    <input type="text" name="chassisNumber" value={fieldsData.chassisNumber} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Release date:</label>
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
                                    <label>Release price:</label>
                                    <input type="text" name="releasePrice" value={fieldsData.releasePrice} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Sales price:</label>
                                    <input type="text" name="salesPrice" value={fieldsData.salesPrice} onChange={handleInputChange} />
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