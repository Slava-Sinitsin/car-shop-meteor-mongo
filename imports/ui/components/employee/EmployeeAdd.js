import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTracker } from 'meteor/react-meteor-data';
import { format } from 'date-fns';
import { EmployeeCollection } from '../../../api/collections/EmployeeCollection';
import { TransferInfoCollection } from '../../../api/collections/TransferInfoCollection';

export const EmployeeAdd = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [fieldsData, setFieldsData] = useState({
        transferInfoID: '1',
        firstName: '',
        secondName: '',
        middleName: '',
        birthDate: '',
        address: '',
        position: '',
        salary: ''
    });

    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setFieldsData({
            transferInfoID: '1',
            firstName: '',
            secondName: '',
            middleName: '',
            birthDate: '',
            address: '',
            position: '',
            salary: ''
        });
    };

    const employees = useTracker(() => {
        Meteor.subscribe('employee');
        return EmployeeCollection.find().fetch();
    });

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

    const handleAddEmployee = async () => {
        const newEmployee = {
            _id: `${employees.length + 1}`,
            transfer_info_id: fieldsData.transferInfoID,
            first_name: fieldsData.firstName,
            second_name: fieldsData.secondName,
            middle_name: fieldsData.middleName,
            birth_date: format(fieldsData.birthDate, 'yyyy-MM-dd'),
            address: fieldsData.address,
            position: fieldsData.position,
            salary: +fieldsData.salary
        };

        await Meteor.call('employee.insert', newEmployee);
    };

    const handleSubmit = () => {
        handleAddEmployee();
        closeDialog();
    };

    return (
        <div>
            <button className="open-dialog-button" onClick={openDialog}>
                Add new employee
            </button>
            {isDialogOpen && (
                <div className="dialog-overlay">
                    <div className="dialog-content">
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <div className="column">
                                <h2>Employee info</h2>
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
                                    <label>Position:</label>
                                    <input type="text" name="position" value={fieldsData.position} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Salary:</label>
                                    <input type="text" name="salary" value={fieldsData.salary} onChange={handleInputChange} />
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