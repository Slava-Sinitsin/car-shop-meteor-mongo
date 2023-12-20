import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO, format } from 'date-fns';
import { UsedInfoCollection } from '../../../api/collections/UsedInfoCollection';
import { EmployeeCollection } from '../../../api/collections/EmployeeCollection';
import { TransferInfoCollection } from '../../../api/collections/TransferInfoCollection';

export const UsedInfoEdit = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [fieldsData, setFieldsData] = useState({
        usedInfoSelect: 'select',
        employeeSelect: 'select',
        usedInfoID: '',
        employeeID: '',
        purchasePrice: '',
        certificateDate: ''
    });

    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setFieldsData({
            usedInfoSelect: '',
            employeeSelect: '',
            usedInfoID: '',
            employeeID: '',
            purchasePrice: '',
            certificateDate: ''
        });
    };

    const usedInfoList = useTracker(() => {
        Meteor.subscribe('used_info');
        return UsedInfoCollection.find().fetch().slice(1);
    });

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

        if (name === 'usedInfoSelect' && value) {
            if (value == 'select') {
                setFieldsData((prevData) => ({
                    ...prevData,
                    employeeSelect: 'select',
                    usedInfoID: '',
                    employeeID: '',
                    purchasePrice: '',
                    certificateDate: ''
                }));
            }
            const selectedUsedInfo = usedInfoList.find((usedInfo) => usedInfo._id == value);
            if (selectedUsedInfo) {
                setFieldsData((prevData) => ({
                    ...prevData,
                    usedInfoID: selectedUsedInfo._id,
                    employeeID: selectedUsedInfo.employee_id,
                    purchasePrice: selectedUsedInfo.purchase_price,
                    certificateDate: selectedUsedInfo.certificate_date ? parseISO(selectedUsedInfo.certificate_date) : null,
                }));
            }
        }

        if (name === 'employeeSelect' && value) {
            const selectedEmployee = employees.find((employee) => employee._id == value);
            if (selectedEmployee) {
                setFieldsData((prevData) => ({
                    ...prevData,
                    employeeID: selectedEmployee._id,
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

    const handleUsedInfoUpdate = async () => {
        const editedUsedInfo = {
            _id: fieldsData.usedInfoID,
            employee_id: fieldsData.employeeID,
            purchase_price: +fieldsData.purchasePrice,
            certificate_date: format(fieldsData.certificateDate, 'yyyy-MM-dd')
        }
        await Meteor.call('used_info.update', fieldsData.usedInfoID, editedUsedInfo);
    };

    const handleSubmit = () => {
        if (fieldsData.usedInfoSelect != 'select') {
            handleUsedInfoUpdate();
        }
        closeDialog();
    };

    return (
        <div>
            <button className="open-dialog-button" onClick={openDialog}>
                Edit used info
            </button>
            {isDialogOpen && (
                <div className="dialog-overlay">
                    <div className="dialog-content">
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <div className="column">
                                <h2>Used info</h2>
                                <div className="form-group">
                                    <label>Used info ID:</label>
                                    <select className="form-group" name="usedInfoSelect" value={fieldsData.usedInfoSelect} onChange={handleInputChange} style={{ width: '160px' }}>
                                        <option value="select">Select used info</option>
                                        {usedInfoList.map((usedInfo) => (
                                            <option key={usedInfo._id} value={usedInfo._id}>
                                                {`${usedInfo._id}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginLeft: '20px' }}></div>
                            <div className="column">
                                <h2>Used info properties</h2>
                                <label>Employee name:</label>
                                <select className="form-group" name="employeeSelect" value={fieldsData.employeeSelect} onChange={handleInputChange}>
                                    <option value="select">Select employee</option>
                                    {employees.map((employee) => (
                                        <option key={employee._id} value={employee._id}>
                                            {`${employee.first_name} ${employee.second_name} ${employee.middle_name}${employee.position === 'Fired' ? ` (${employee.position})` : ''}`}
                                        </option>
                                    ))}
                                </select>
                                <div className="form-group">
                                    <label>Purchase price:</label>
                                    <input type="text" name="purchasePrice" value={fieldsData.purchasePrice} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Certificate date:</label>
                                    <DatePicker
                                        name="certificateDate"
                                        selected={fieldsData.certificateDate}
                                        onChange={(date) => handleDateChange("certificateDate", date)}
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