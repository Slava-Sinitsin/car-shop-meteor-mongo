import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { ClientSellerCollection } from '../../../api/collections/ClientSellerCollection';
import { PassportCollection } from '../../../api/collections/PassportCollection';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO, format } from 'date-fns';

export const ClientSellerEdit = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [fieldsData, setFieldsData] = useState({
        clientSellerSelect: 'select',
        id: '',
        passportID: '',
        carID: '',
        certifyingDocumentID: '',
        purchaseDate: ''
    });

    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setFieldsData({
            clientSellerSelect: 'select',
            id: '',
            passportID: '',
            carID: '',
            certifyingDocumentID: '',
            purchaseDate: ''
        });
    };

    const clientSellers = useTracker(() => {
        Meteor.subscribe('client_seller');
        Meteor.subscribe('passport');
        const clientSellers = ClientSellerCollection.find().fetch();
        const passports = PassportCollection.find().fetch();
        const clientBuyersWithPassportAndCar = clientSellers.map(clientSeller => {
            const passport = passports.find(p => p._id === clientSeller.passport_id);
            return {
                ...clientSeller,
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

        if (name === 'clientSellerSelect' && value) {
            if (value == 'select') {
                setFieldsData((prevData) => ({
                    ...prevData,
                    id: '',
                    passportID: '',
                    name: '',
                    carID: '',
                    certifyingDocumentID: '',
                    purchaseDate: ''
                }));
            }
            const selectedclientSeller = clientSellers.find((clientSeller) => clientSeller._id == value);
            if (selectedclientSeller) {
                setFieldsData((prevData) => ({
                    ...prevData,
                    id: selectedclientSeller._id,
                    passportID: selectedclientSeller.passport._id,
                    carID: selectedclientSeller.car_id,
                    certifyingDocumentID: selectedclientSeller.certifying_document_id,
                    purchaseDate: selectedclientSeller.purchase_date ? parseISO(selectedclientSeller.purchase_date) : null
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

    const handleClientSellerUpdate = async () => {
        const editedClientSeller = {
            _id: fieldsData.id,
            passport_id: fieldsData.passportID,
            car_id: fieldsData.carID,
            certifying_document_id: fieldsData.certifyingDocumentID,
            purchase_date: format(fieldsData.purchaseDate, 'yyyy-MM-dd')
        };
        await Meteor.call('client_seller.update', fieldsData.id, editedClientSeller);
    };

    const handleSubmit = () => {
        if (fieldsData.clientSellerSelect != 'select') {
            handleClientSellerUpdate();
        }
        closeDialog();
    };

    return (
        <div>
            <button className="open-dialog-button" onClick={openDialog}>
                Edit client seller
            </button>
            {isDialogOpen && (
                <div className="dialog-overlay">
                    <div className="dialog-content">
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <div className="column">
                                <h2>Client seller info</h2>
                                <div className="form-group">
                                    <label>Client seller:</label>
                                    <select className="form-group" name="clientSellerSelect" value={fieldsData.clientSellerSelect} onChange={handleInputChange}>
                                        <option value="select">Select client seller</option>
                                        {clientSellers.map((clientSeller) => (
                                            <option key={clientSeller._id} value={clientSeller._id}>
                                                {`${clientSeller._id} ${clientSeller.passport.first_name} ${clientSeller.passport.second_name} ${clientSeller.passport.middle_name}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginLeft: '20px' }}></div>
                            <div className="column">
                                <h2>Client seller properties</h2>
                                <div className="form-group">
                                    <label>Purchase date:</label>
                                    <DatePicker
                                        name="purchaseDate"
                                        selected={fieldsData.purchaseDate}
                                        onChange={(date) => handleDateChange("purchaseDate", date)}
                                        dateFormat="yyyy-MM-dd"
                                    />
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