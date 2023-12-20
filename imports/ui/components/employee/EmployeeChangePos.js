import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTracker } from 'meteor/react-meteor-data';
import { format } from 'date-fns';
import { EmployeeCollection } from '../../../api/collections/EmployeeCollection';
import { TransferInfoCollection } from '../../../api/collections/TransferInfoCollection';

export const EmployeeChangePos = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [fieldsData, setFieldsData] = useState({
        employeeSelect: '',
        employeeID: '',
        firstName: '',
        secondName: '',
        middleName: '',
        birthDate: '',
        address: '',
        newPosition: '',
        newSalary: '',
        position: '',

        transferReason: '',
        orderDate: ''
    });

    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setFieldsData({
            employeeSelect: '',
            employeeID: '',
            firstName: '',
            secondName: '',
            middleName: '',
            birthDate: '',
            address: '',
            newPosition: '',
            newSalary: '',
            position: '',

            transferReason: '',
            orderDate: ''
        });
    };

    const employees = useTracker(() => {
        Meteor.subscribe('employee');
        return EmployeeCollection.find().fetch();
    });

    const employeesWithUniqueTransferInfo = useTracker(() => {
        Meteor.subscribe('employee');
        Meteor.subscribe('transfer_info');
        const employees = EmployeeCollection.find().fetch();
        const transferInfos = TransferInfoCollection.find().fetch();
        const uniqueEmployees = [];
        employees.forEach(employee => {
            const existingEmployeeIndex = uniqueEmployees.findIndex(e =>
                e.first_name === employee.first_name &&
                e.second_name === employee.second_name &&
                e.middle_name === employee.middle_name
            );
            if (existingEmployeeIndex === -1) {
                uniqueEmployees.push({ ...employee });
            } else {
                const existingEmployee = uniqueEmployees[existingEmployeeIndex];
                const existingTransferInfo = transferInfos.find(t => t._id === existingEmployee.transfer_info_id);
                const newTransferInfo = transferInfos.find(t => t._id === employee.transfer_info_id);
                if (existingTransferInfo && newTransferInfo) {
                    const existingDate = new Date(existingTransferInfo.order_date);
                    const newDate = new Date(newTransferInfo.order_date);
                    if (existingDate < newDate) {
                        uniqueEmployees[existingEmployeeIndex] = { ...employee };
                    }
                } else if (!existingTransferInfo && newTransferInfo) {
                    uniqueEmployees[existingEmployeeIndex] = { ...employee };
                }
            }
        });
        const employeesWithoutFired = uniqueEmployees.filter(employee => {
            if (employee.position === "Fired") {
                return false;
            }
            return true;
        });
        return employeesWithoutFired;
    });

    const transferInfoList = useTracker(() => {
        Meteor.subscribe('transfer_info');
        return TransferInfoCollection.find().fetch();
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFieldsData({
            ...fieldsData,
            [name]: value
        });

        if (name === 'employeeSelect' && value) {
            const selectedEmployee = employees.find((employee) => employee._id == value);
            if (selectedEmployee) {
                setFieldsData((prevData) => ({
                    ...prevData,
                    employeeSelect: e.value,
                    employeeID: selectedEmployee._id,
                    firstName: selectedEmployee.first_name,
                    secondName: selectedEmployee.second_name,
                    middleName: selectedEmployee.middle_name,
                    birthDate: selectedEmployee.birth_date,
                    address: selectedEmployee.address,
                    position: selectedEmployee.position,
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

    const handleChangeEmployeePos = async () => {
        const newTransferInfo = {
            _id: `${transferInfoList.length + 1}`,
            previous_position: fieldsData.position,
            transfer_reason: fieldsData.transferReason,
            order_date: format(fieldsData.orderDate, 'yyyy-MM-dd')
        };

        const newEmployee = {
            _id: `${employees.length + 1}`,
            transfer_info_id: `${transferInfoList.length + 1}`,
            first_name: fieldsData.firstName,
            second_name: fieldsData.secondName,
            middle_name: fieldsData.middleName,
            birth_date: fieldsData.birthDate,
            address: fieldsData.address,
            position: fieldsData.newPosition,
            salary: +fieldsData.newSalary
        };

        await Meteor.call('transfer_info.insert', newTransferInfo);
        await Meteor.call('employee.insert', newEmployee);
    };

    const handleSubmit = () => {
        handleChangeEmployeePos();
        closeDialog();
    };

    return (
        <div>
            <button className="open-dialog-button" onClick={openDialog}>
                Change employee position
            </button>
            {isDialogOpen && (
                <div className="dialog-overlay">
                    <div className="dialog-content">
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <div className="column">
                                <h2>Change employee position</h2>
                                <div className="form-group">
                                    <label>Employee name:</label>
                                    <select className="form-group" name="employeeSelect" value={fieldsData.employeeSelect} onChange={handleInputChange}>
                                        <option value="select">Select employee</option>
                                        {employeesWithUniqueTransferInfo.slice(1).map((employee) => (
                                            <option key={employee._id} value={employee._id}>
                                                {`${employee.first_name} ${employee.second_name} ${employee.middle_name}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>New position:</label>
                                    <input type="text" name="newPosition" value={fieldsData.newPosition} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>New salary:</label>
                                    <input type="text" name="newSalary" value={fieldsData.newSalary} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div style={{ marginLeft: '20px' }}></div>
                            <div className="column">
                                <h2>Transfer info</h2>
                                <div className="form-group">
                                    <label>Transfer reason:</label>
                                    <input type="text" name="transferReason" value={fieldsData.transferReason} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Order date:</label>
                                    <DatePicker
                                        name="orderDate"
                                        selected={fieldsData.orderDate}
                                        onChange={(date) => handleDateChange("orderDate", date)}
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