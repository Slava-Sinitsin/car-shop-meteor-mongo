import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO, format } from 'date-fns';
import { PassportCollection } from '../../../api/collections/PassportCollection';

export const PassportEdit = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [fieldsData, setFieldsData] = useState({
        passportSelect: 'select',
        passportID: '',
        firstName: '',
        secondName: '',
        middleName: '',
        birthDate: '',
        address: '',
        issueDate: '',
        genderSelect: 'select'
    });

    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setFieldsData({
            passportSelect: '',
            passportID: '',
            firstName: '',
            secondName: '',
            middleName: '',
            birthDate: '',
            address: '',
            issueDate: '',
            genderSelect: ''
        });
    };

    const passports = useTracker(() => {
        Meteor.subscribe('passport');
        return PassportCollection.find().fetch();
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFieldsData({
            ...fieldsData,
            [name]: value
        });

        if (name === 'passportSelect' && value) {
            if (value == 'select') {
                setFieldsData((prevData) => ({
                    ...prevData,
                    passportID: '',
                    firstName: '',
                    secondName: '',
                    middleName: '',
                    birthDate: '',
                    address: '',
                    issueDate: '',
                    genderSelect: 'select'
                }));
            }
            const selectedPassport = passports.find((passport) => passport._id == value);
            if (selectedPassport) {
                setFieldsData((prevData) => ({
                    ...prevData,
                    passportID: selectedPassport._id,
                    firstName: selectedPassport.first_name,
                    secondName: selectedPassport.second_name,
                    middleName: selectedPassport.middle_name,
                    birthDate: selectedPassport.birth_date ? parseISO(selectedPassport.birth_date) : null,
                    address: selectedPassport.address,
                    issueDate: selectedPassport.issue_date ? parseISO(selectedPassport.issue_date) : null,
                    genderSelect: selectedPassport.gender
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

    const handlePassportUpdate = async () => {
        const editedPassport = {
            _id: fieldsData.passportID,
            first_name: fieldsData.firstName,
            second_name: fieldsData.secondName,
            middle_name: fieldsData.middleName,
            birth_date: format(fieldsData.birthDate, 'yyyy-MM-dd'),
            address: fieldsData.address,
            issue_date: format(fieldsData.issueDate, 'yyyy-MM-dd'),
            gender: fieldsData.genderSelect
        }

        await Meteor.call('passport.update', fieldsData.passportID, editedPassport);
    };

    const handleSubmit = () => {
        if (fieldsData.passportSelect != 'select' && fieldsData.genderSelect != 'select') {
            handlePassportUpdate();
        }
        closeDialog();
    };

    return (
        <div>
            <button className="open-dialog-button" onClick={openDialog}>
                Edit passport
            </button>
            {isDialogOpen && (
                <div className="dialog-overlay">
                    <div className="dialog-content">
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <div className="column">
                                <h2>Passport info</h2>
                                <div className="form-group">
                                    <label>Passport ID:</label>
                                    <select className="form-group" name="passportSelect" value={fieldsData.passportSelect} onChange={handleInputChange} style={{ width: '160px' }}>
                                        <option value="select">Select passport</option>
                                        {passports.map((passport) => (
                                            <option key={passport._id} value={passport._id}>
                                                {`${passport._id}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginLeft: '20px' }}></div>
                            <div className="column">
                                <h2>Passport properties</h2>
                                <div className="form-group">
                                    <label>First name:</label>
                                    <input type="text" name="firstName" value={fieldsData.firstName} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Second name:</label>
                                    <input type="text" name="secondName" value={fieldsData.secondName} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Middle name:</label>
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
                                    <label>Issue date:</label>
                                    <DatePicker
                                        name="issueDate"
                                        selected={fieldsData.issueDate}
                                        onChange={(date) => handleDateChange("issueDate", date)}
                                        dateFormat="yyyy-MM-dd"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Gender:</label>
                                    <select className="form-group" name="genderSelect" value={fieldsData.genderSelect} onChange={handleInputChange} style={{ width: '160px' }}>
                                        <option value="select">Select gender</option>
                                        <option value="man">Man</option>
                                        <option value="woman">Woman</option>
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