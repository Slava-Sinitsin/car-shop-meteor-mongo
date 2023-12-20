import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { EmployeeCollection } from '../../../api/collections/EmployeeCollection';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO, format } from 'date-fns';
import { TransferInfoCollection } from '../../../api/collections/TransferInfoCollection';

export const EmployeeEdit = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [fieldsData, setFieldsData] = useState({
        employeeSelect: 'select',
        employeeID: '',
        transferInfoID: '',
        newFirstName: '',
        newSecondName: '',
        newMiddleName: '',
        newBirthDate: '',
        newAddress: '',
        newPosition: '',
        newSalary: '',
        oldFirstName: '',
        oldSecondName: '',
        oldMiddleName: ''
    });

    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setFieldsData({
            employeeSelect: 'select',
            employeeID: '',
            transferInfoID: '',
            newFirstName: '',
            newSecondName: '',
            newMiddleName: '',
            newBirthDate: '',
            newAddress: '',
            newPosition: '',
            newSalary: '',
            oldFirstName: '',
            oldSecondName: '',
            oldMiddleName: ''
        });
    };

    const employees = useTracker(() => {
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
        return employeesWithoutFired.slice(1);
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFieldsData({
            ...fieldsData,
            [name]: value
        });

        if (name === 'employeeSelect' && value) {
            if (value == 'select') {
                setFieldsData((prevData) => ({
                    ...prevData,
                    employeeID: '',
                    transferInfoID: '',
                    newFirstName: '',
                    newSecondName: '',
                    newMiddleName: '',
                    newBirthDate: '',
                    newAddress: '',
                    newPosition: '',
                    newSalary: '',
                    oldFirstName: '',
                    oldSecondName: '',
                    oldMiddleName: ''
                }));
            }
            const selectedEmployee = employees.find((employee) => employee._id == value);
            if (selectedEmployee) {
                setFieldsData((prevData) => ({
                    ...prevData,
                    employeeID: selectedEmployee._id,
                    transferInfoID: selectedEmployee.transfer_info_id,
                    newFirstName: selectedEmployee.first_name,
                    newSecondName: selectedEmployee.second_name,
                    newMiddleName: selectedEmployee.middle_name,
                    newBirthDate: selectedEmployee.birth_date ? parseISO(selectedEmployee.birth_date) : null,
                    newAddress: selectedEmployee.address,
                    newPosition: selectedEmployee.position,
                    newSalary: selectedEmployee.salary,
                    oldFirstName: selectedEmployee.first_name,
                    oldSecondName: selectedEmployee.second_name,
                    oldMiddleName: selectedEmployee.middle_name,
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

    const handleEmployeeUpdate = async () => {
        const employees = EmployeeCollection.find().fetch();
        const employeesByNames = employees.filter(e =>
            e.first_name === fieldsData.oldFirstName &&
            e.second_name === fieldsData.oldSecondName &&
            e.middle_name === fieldsData.oldMiddleName
        );
        employeesByNames.forEach(employee => {
            if (employee._id != fieldsData.employeeID) {
                const editedEmployee = {
                    _id: employee._id,
                    transfer_info_id: employee.transfer_info_id,
                    first_name: fieldsData.newFirstName,
                    second_name: fieldsData.newSecondName,
                    middle_name: fieldsData.newMiddleName,
                    birth_date: employee.birth_date,
                    address: employee.address,
                    position: employee.position,
                    salary: +employee.salary
                }
                Meteor.call('employee.update', employee._id, editedEmployee);
            } else {
                const editedEmployee = {
                    _id: employee._id,
                    transfer_info_id: employee.transfer_info_id,
                    first_name: fieldsData.newFirstName,
                    second_name: fieldsData.newSecondName,
                    middle_name: fieldsData.newMiddleName,
                    birth_date: format(fieldsData.newBirthDate, 'yyyy-MM-dd'),
                    address: fieldsData.newAddress,
                    position: fieldsData.newPosition,
                    salary: +fieldsData.newSalary
                }
                Meteor.call('employee.update', employee._id, editedEmployee);
            }
        })
    };

    const handleSubmit = () => {
        if (fieldsData.transferInfoSelect != 'select') {
            handleEmployeeUpdate();
        }
        closeDialog();
    };

    return (
        <div>
            <button className="open-dialog-button" onClick={openDialog}>
                Edit employee
            </button>
            {isDialogOpen && (
                <div className="dialog-overlay">
                    <div className="dialog-content">
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <div className="column">
                                <h2>Employee info</h2>
                                <div className="form-group">
                                    <label>Employee name:</label>
                                    <select className="form-group" name="employeeSelect" value={fieldsData.employeeSelect} onChange={handleInputChange} style={{ width: '160px' }}>
                                        <option value="select">Select employee</option>
                                        {employees.map((employee) => (
                                            <option key={employee._id} value={employee._id}>
                                                {`${employee.first_name} ${employee.second_name} ${employee.middle_name}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginLeft: '20px' }}></div>
                            <div className="column">
                                <h2>Employee properties</h2>
                                <div className="form-group">
                                    <label>First name:</label>
                                    <input type="text" name="newFirstName" value={fieldsData.newFirstName} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Second name:</label>
                                    <input type="text" name="newSecondName" value={fieldsData.newSecondName} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Middle name:</label>
                                    <input type="text" name="newMiddleName" value={fieldsData.newMiddleName} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Birth date:</label>
                                    <DatePicker
                                        name="newBirthDate"
                                        selected={fieldsData.newBirthDate}
                                        onChange={(date) => handleDateChange("birthDate", date)}
                                        dateFormat="yyyy-MM-dd"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Address:</label>
                                    <input type="text" name="newAddress" value={fieldsData.newAddress} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Position:</label>
                                    <input type="text" name="newPosition" value={fieldsData.newPosition} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Salary:</label>
                                    <input type="text" name="newSalary" value={fieldsData.newSalary} onChange={handleInputChange} />
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