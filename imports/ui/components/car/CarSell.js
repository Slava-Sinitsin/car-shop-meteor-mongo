import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CarCollection } from '../../../api/collections/CarCollection';
import { ClientBuyerCollection } from '../../../api/collections/ClientBuyerCollection';
import { useTracker } from 'meteor/react-meteor-data';
import { PassportCollection } from '../../../api/collections/PassportCollection';
import { parseISO, format } from 'date-fns';

export const CarSell = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [fieldsData, setFieldsData] = useState({
        carSelect: '',
        carID: '',

        clientBuyerSelect: 'new',
        clientBuyerID: '',
        passportID: '',
        firstName: '',
        secondName: '',
        middleName: '',
        birthDate: '',
        address: '',
        passportIssueDate: '',
        gender: '',

        saleDate: '',
        accountNumber: '',
        paymentTypeSelect: ''
    });

    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setFieldsData({
            carSelect: '',
            carID: '',

            clientBuyerSelect: '',
            clientBuyerID: '',
            passportID: '',
            firstName: '',
            secondName: '',
            middleName: '',
            birthDate: '',
            address: '',
            passportIssueDate: '',
            gender: '',

            saleDate: '',
            accountNumber: '',
            paymentTypeSelect: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFieldsData({
            ...fieldsData,
            [name]: value
        });

        if (name === 'carSelect' && value) {
            setFieldsData({
                ...fieldsData,
                carSelect: e.value,
                carID: value
            });
        }

        if (name === 'clientBuyerSelect' && value) {
            if (value == 'new') {
                setFieldsData((prevData) => ({
                    ...prevData,
                    passportID: '',
                    firstName: '',
                    secondName: '',
                    middleName: '',
                    birthDate: '',
                    address: '',
                    passportIssueDate: '',
                    gender: '',
                    accountNumber: ''
                }));
            }

            const selectedClientBuyer = clientBuyers.find((clientBuyer) => clientBuyer._id == value);
            if (selectedClientBuyer) {
                setFieldsData((prevData) => ({
                    ...prevData,
                    clientBuyerSelect: e.value,
                    passportID: selectedClientBuyer.passport._id,
                    firstName: selectedClientBuyer.passport.first_name,
                    secondName: selectedClientBuyer.passport.second_name,
                    middleName: selectedClientBuyer.passport.middle_name,
                    birthDate: selectedClientBuyer.passport.birth_date ? parseISO(selectedClientBuyer.passport.birth_date) : null,
                    address: selectedClientBuyer.passport.address,
                    passportIssueDate: selectedClientBuyer.passport.issue_date ? parseISO(selectedClientBuyer.passport.issue_date) : null,
                    gender: selectedClientBuyer.passport.gender,
                    accountNumber: selectedClientBuyer.account_number,
                    paymentTypeSelect: selectedClientBuyer.payment_type
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

    const cars = useTracker(() => {
        Meteor.subscribe('car');
        Meteor.subscribe('client_buyer');
        const cars = CarCollection.find().fetch();
        const clientBuyers = ClientBuyerCollection.find().fetch();
        const carsNotSold = cars.map(car => {
            const carSold = clientBuyers.find(u => u.car_id === car._id);
            return {
                ...car,
                sold: carSold || null
            };
        }).filter(car => car.sold === null);
        return carsNotSold;
    });

    const clientBuyers = useTracker(() => {
        Meteor.subscribe('client_buyer');
        const clientBuyers = ClientBuyerCollection.find().fetch();
        Meteor.subscribe('passport');
        const passports = PassportCollection.find().fetch();
        return clientBuyersWithDetails = clientBuyers.map(clientBuyer => {
            const passport = passports.find(p => p._id === clientBuyer.passport_id);
            return {
                ...clientBuyer,
                passport
            };
        });
    });

    const handleSellCar = async () => {
        const newPassport = {
            _id: fieldsData.passportID,
            first_name: fieldsData.firstName,
            second_name: fieldsData.secondName,
            middle_name: fieldsData.middleName,
            birth_date: format(fieldsData.birthDate, 'yyyy-MM-dd'),
            address: fieldsData.address,
            issue_date: format(fieldsData.passportIssueDate, 'yyyy-MM-dd'),
            gender: fieldsData.gender
        };

        const newClientBuyer = {
            _id: `${clientBuyers.length + 1}`,
            passport_id: fieldsData.passportID,
            car_id: fieldsData.carID,
            sale_date: format(fieldsData.saleDate, 'yyyy-MM-dd'),
            account_number: +fieldsData.accountNumber,
            payment_type: fieldsData.paymentTypeSelect
        };

        if (fieldsData.clientBuyerSelect == 'new') {
            await Meteor.call('passport.insert', newPassport);
        }
        await Meteor.call('client_buyer.insert', newClientBuyer);
    };

    const handleSubmit = () => {
        if (fieldsData.carSelect != 'select' && fieldsData.paymentTypeSelect != 'select' && fieldsData.gender != 'select') {
            handleSellCar();
        }
        closeDialog();
    };

    return (
        <div>
            <button className="open-dialog-button" onClick={openDialog}>
                Sell car
            </button>
            {isDialogOpen && (
                <div className="dialog-overlay">
                    <div className="dialog-content">
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <div className="column">
                                <h2>Car info</h2>
                                <div className="form-group">
                                    <label>Car:</label>
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
                                <h2>Client buyer info</h2>
                                <div className="form-group">
                                    <label>Client buyer:</label>
                                    <select className="form-group" name="clientBuyerSelect" value={fieldsData.clientBuyerSelect} onChange={handleInputChange}>
                                        <option value="new">New client buyer</option>
                                        {clientBuyers.map((clientBuyer) => (
                                            <option key={clientBuyer._id} value={clientBuyer._id}>
                                                {`${clientBuyer._id} ${clientBuyer.passport.first_name} ${clientBuyer.passport.second_name} ${clientBuyer.passport.middle_name} `}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="form-group">
                                        <label>Passport ID:</label>
                                        <input type="text" name="passportID" value={fieldsData.passportID} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>First Name:</label>
                                        <input type="text" name="firstName" value={fieldsData.firstName} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Second Name:</label>
                                        <input type="text" name="secondName" value={fieldsData.secondName} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Middle Name:</label>
                                        <input type="text" name="middleName" value={fieldsData.middleName} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Birth date:</label>
                                        <DatePicker
                                            name="birthDate"
                                            selected={fieldsData.birthDate}
                                            onChange={(date) => handleDateChange("birthDate", date)}
                                            dateFormat="yyyy-MM-dd"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Address:</label>
                                        <input type="text" name="address" value={fieldsData.address} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Issue Date:</label>
                                        <DatePicker
                                            name="passportIssueDate"
                                            selected={fieldsData.passportIssueDate}
                                            onChange={(date) => handleDateChange("passportIssueDate", date)}
                                            dateFormat="yyyy-MM-dd"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Gender:</label>
                                        <select name="gender" value={fieldsData.gender} onChange={handleInputChange}>
                                            <option value="select">Select gender</option>
                                            <option value="man">Man</option>
                                            <option value="woman">Woman</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginLeft: '20px' }}></div>
                            <div className="column">
                                <h2>Payment info</h2>
                                <div className="form-group">
                                    <label>Sale date:</label>
                                    <DatePicker
                                        name="saleDate"
                                        selected={fieldsData.saleDate}
                                        onChange={(date) => handleDateChange("saleDate", date)}
                                        dateFormat="yyyy-MM-dd"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Account number:</label>
                                    <input type="text" name="accountNumber" value={fieldsData.accountNumber} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Payment type:</label>
                                    <select className="form-group" name="paymentTypeSelect" value={fieldsData.paymentTypeSelect} onChange={handleInputChange}>
                                        <option value="select">Select payment type</option>
                                        <option value="card">Card</option>
                                        <option value="transfer">Transfer</option>
                                        <option value="cash">Cash</option>
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