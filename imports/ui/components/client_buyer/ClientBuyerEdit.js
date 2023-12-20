import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { PassportCollection } from '../../../api/collections/PassportCollection';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO, format } from 'date-fns';
import { ClientBuyerCollection } from '../../../api/collections/ClientBuyerCollection';

export const ClientBuyerEdit = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [fieldsData, setFieldsData] = useState({
        clientBuyerSelect: 'select',
        id: '',
        passportID: '',
        carID: '',
        saleDate: '',
        accountNumber: '',
        paymentTypeSelect: 'select',
    });

    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setFieldsData({
            clientBuyerSelect: '',
            id: '',
            passportID: '',
            carID: '',
            saleDate: '',
            accountNumber: '',
            paymentTypeSelect: '',
        });
    };

    const clientBuyers = useTracker(() => {
        Meteor.subscribe('client_buyer');
        Meteor.subscribe('passport');
        const clientBuyers = ClientBuyerCollection.find().fetch();
        const passports = PassportCollection.find().fetch();
        const clientBuyersWithPassportAndCar = clientBuyers.map(clientBuyer => {
            const passport = passports.find(p => p._id === clientBuyer.passport_id);
            return {
                ...clientBuyer,
                passport: passport || null,
            };
        });
        return clientBuyersWithPassportAndCar;
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFieldsData({
            ...fieldsData,
            [name]: value
        });

        if (name === 'clientBuyerSelect' && value) {
            if (value == 'select') {
                setFieldsData((prevData) => ({
                    ...prevData,
                    clientBuyerSelect: 'select',
                    id: '',
                    passportID: '',
                    carID: '',
                    saleDate: '',
                    accountNumber: '',
                    paymentTypeSelect: 'select',
                }));
            }
            const selectedClientBuyer = clientBuyers.find((clientBuyer) => clientBuyer._id == value);
            if (selectedClientBuyer) {
                setFieldsData((prevData) => ({
                    ...prevData,
                    id: selectedClientBuyer._id,
                    passportID: selectedClientBuyer.passport._id,
                    carID: selectedClientBuyer.car_id,
                    saleDate: selectedClientBuyer.sale_date ? parseISO(selectedClientBuyer.sale_date) : null,
                    accountNumber: selectedClientBuyer.account_number,
                    paymentTypeSelect: selectedClientBuyer.payment_type,
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

    const handleClientBuyerUpdate = async () => {
        const editedClientBuyer = {
            _id: fieldsData.id,
            passport_id: fieldsData.passportID,
            car_id: fieldsData.carID,
            sale_date: format(fieldsData.saleDate, 'yyyy-MM-dd'),
            account_number: +fieldsData.accountNumber,
            payment_type: fieldsData.paymentTypeSelect,
        }
        Meteor.call('client_buyer.update', fieldsData.id, editedClientBuyer);
    };

    const handleSubmit = () => {
        if (fieldsData.clientBuyerSelect != 'select' && fieldsData.paymentTypeSelect != 'select') {
            handleClientBuyerUpdate();
        }
        closeDialog();
    };

    return (
        <div>
            <button className="open-dialog-button" onClick={openDialog}>
                Edit client buyer
            </button>
            {isDialogOpen && (
                <div className="dialog-overlay">
                    <div className="dialog-content">
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <div className="column">
                                <h2>Client buyer info</h2>
                                <div className="form-group">
                                    <label>Client buyer:</label>
                                    <select className="form-group" name="clientBuyerSelect" value={fieldsData.clientBuyerSelect} onChange={handleInputChange}>
                                        <option value="select">Select client buyer</option>
                                        {clientBuyers.map((clientBuyer) => (
                                            <option key={clientBuyer._id} value={clientBuyer._id}>
                                                {`${clientBuyer._id} ${clientBuyer.passport.first_name} ${clientBuyer.passport.second_name} ${clientBuyer.passport.middle_name}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginLeft: '20px' }}></div>
                            <div className="column">
                                <h2>Client buyer properties</h2>
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
                                    <select className="form-group" name="paymentTypeSelect" value={fieldsData.paymentTypeSelect} onChange={handleInputChange} style={{ width: '160px' }}>
                                        <option value="select">Select payment type</option>
                                        <option value="card">card</option>
                                        <option value="cash">cash</option>
                                        <option value="transfer">transfer</option>
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