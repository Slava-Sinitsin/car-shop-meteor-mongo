import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { ClientSellerCollection } from '../../../api/collections/ClientSellerCollection';
import { PassportCollection } from '../../../api/collections/PassportCollection';
import { EmployeeCollection } from '../../../api/collections/EmployeeCollection';
import { UsedInfoCollection } from '../../../api/collections/UsedInfoCollection';
import { CarCollection } from '../../../api/collections/CarCollection';
import { TransferInfoCollection } from '../../../api/collections/TransferInfoCollection';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO, format } from 'date-fns';

export const CarCreateUsed = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);

    const [fieldsData, setFieldsData] = useState({
        carID: '',
        usedInfoID: '',
        carName: '',
        color: '',
        engineNumber: '',
        regNumber: '',
        bodyNumber: '',
        chassisNumber: '',
        releaseDate: '',
        mileage: '',
        releasePrice: '',
        salesPrice: '',
        purchaseDate: '',

        employeeEntity: '',
        employeeID: '',
        purchasePrice: '',
        certificateDate: '',

        clientSellerEntity: '',
        clientSellerID: '',
        passportID: '',
        firstName: '',
        secondName: '',
        middleName: '',
        birthDate: '',
        address: '',
        passportIssueDate: '',
        gender: '',

        certifyingDocumentID: '',
        certifyingDocumentName: '',
        certifyingDocumentIssueDate: '',
        issuer: ''
    });

    const clientSellers = useTracker(() => {
        Meteor.subscribe('client_seller');
        const сlientSellers = ClientSellerCollection.find().fetch();

        Meteor.subscribe('passport');
        const passports = PassportCollection.find().fetch();

        return clientSellersWithDetails = сlientSellers.map(clientSeller => {
            const passport = passports.find(p => p._id === clientSeller.passport_id);
            return {
                ...clientSeller,
                passport
            };
        });
    });

    const employees = useTracker(() => {
        Meteor.subscribe('employee');
        return EmployeeCollection.find().fetch().slice(1);
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

    const usedInfo = useTracker(() => {
        Meteor.subscribe('used_info');
        return UsedInfoCollection.find().fetch();
    });

    const cars = useTracker(() => {
        Meteor.subscribe('car');
        return CarCollection.find().fetch();
    });

    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setFieldsData({
            carID: '',
            usedInfoID: '',
            carName: '',
            color: '',
            engineNumber: '',
            regNumber: '',
            bodyNumber: '',
            chassisNumber: '',
            releaseDate: '',
            mileage: '',
            releasePrice: '',
            salesPrice: '',
            purchaseDate: '',

            employeeEntity: '',
            employeeID: '',
            purchasePrice: '',
            certificateDate: '',

            clientSellerEntity: '',
            clientSellerID: '',
            passportID: '',
            firstName: '',
            secondName: '',
            middleName: '',
            birthDate: '',
            address: '',
            passportIssueDate: '',
            gender: '',

            certifyingDocumentID: '',
            certifyingDocumentName: '',
            certifyingDocumentIssueDate: '',
            issuer: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFieldsData({
            ...fieldsData,
            [name]: value
        });
        if (name === 'employeeEntity' && value) {
            const selectedEmployee = employees.find((employee) => employee._id == value);
            if (selectedEmployee) {
                setFieldsData((prevData) => ({
                    ...prevData,
                    employeeEntity: e.value,
                    employeeID: selectedEmployee._id
                }));
            }
        }
        if (name === 'clientSellerEntity' && value) {
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
                    gender: ''
                }));
            }
            const selectedSeller = clientSellers.find((seller) => seller._id == value);
            if (selectedSeller) {
                setFieldsData((prevData) => ({
                    ...prevData,
                    clientSellerEntity: e.value,
                    passportID: selectedSeller.passport._id,
                    firstName: selectedSeller.passport.first_name,
                    secondName: selectedSeller.passport.second_name,
                    middleName: selectedSeller.passport.middle_name,
                    birthDate: selectedSeller.passport.birth_date ? parseISO(selectedSeller.passport.birth_date) : null,
                    address: selectedSeller.passport.address,
                    passportIssueDate: selectedSeller.passport.issue_date ? parseISO(selectedSeller.passport.issue_date) : null,
                    gender: selectedSeller.passport.gender
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

    const handleCreateCarUsed = async () => {
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

        const newCertifyingDocument = {
            _id: fieldsData.certifyingDocumentID,
            name: fieldsData.certifyingDocumentName,
            issue_date: format(fieldsData.certifyingDocumentIssueDate, 'yyyy-MM-dd'),
            issuer: fieldsData.issuer
        };

        const newUsedInfo = {
            _id: `${usedInfo.length + 1}`,
            employee_id: fieldsData.employeeID,
            purchase_price: fieldsData.purchasePrice,
            certificate_date: format(fieldsData.certificateDate, 'yyyy-MM-dd')
        };

        const newCar = {
            _id: `${cars.length + 1}`,
            used_info_id: `${usedInfo.length + 1}`,
            name: fieldsData.carName,
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

        const newClientSeller = {
            _id: `${clientSellers.length + 1}`,
            passport_id: fieldsData.passportID,
            car_id: `${cars.length + 1}`,
            certifying_document_id: fieldsData.certifyingDocumentID,
            purchase_date: format(fieldsData.purchaseDate, 'yyyy-MM-dd')
        };

        if (fieldsData.clientSellerEntity == 'new') {
            await Meteor.call('passport.insert', newPassport);
        }
        await Meteor.call('certifying_document.insert', newCertifyingDocument);
        await Meteor.call('used_info.insert', newUsedInfo);
        await Meteor.call('car.insert', newCar);
        await Meteor.call('client_seller.insert', newClientSeller);
    };

    const handleSave = () => {
        if (fieldsData.gender != 'select' && fieldsData.employeeEntity != 'select') {
            handleCreateCarUsed();
        }
        closeDialog();
    };

    return (
        <div>
            <button className="open-dialog-button" onClick={openDialog}>
                Add used car
            </button>
            {isDialogOpen && (
                <div className="dialog-overlay">
                    <div className="dialog-content">
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <div className="column">
                                <h2>Car info</h2>
                                <div className="form-group">
                                    <label>Name:</label>
                                    <input type="text" name="carName" value={fieldsData.carName} onChange={handleInputChange} />
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
                                <div className="form-group">
                                    <label>Purchase Date:</label>
                                    <DatePicker
                                        name="purchaseDate"
                                        selected={fieldsData.purchaseDate}
                                        onChange={(date) => handleDateChange("purchaseDate", date)}
                                        dateFormat="yyyy-MM-dd"
                                    />
                                </div>
                            </div>
                            <div style={{ marginLeft: '20px' }}></div>
                            <div className="column">
                                <h2>Used document info</h2>
                                <div className="form-group">
                                    <label>Employee name:</label>
                                    <select className="form-group" name="employeeEntity" value={fieldsData.employeeEntity} onChange={handleInputChange}>
                                        <option value="select">Select employee</option>
                                        {employeesWithUniqueTransferInfo.slice(1).map((employee) => (
                                            <option key={employee._id} value={employee._id}>
                                                {`${employee.first_name} ${employee.second_name} ${employee.middle_name}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Purchase Price:</label>
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
                            <div style={{ marginLeft: '20px' }}></div>
                            <div className="column">
                                <h2>Client seller info</h2>
                                <div className="form-group">
                                    <label>Client seller:</label>
                                    <select className="form-group" name="clientSellerEntity" value={fieldsData.clientSellerEntity} onChange={handleInputChange}>
                                        <option value="new">New client seller</option>
                                        {clientSellers.map((clientSeller) => (
                                            <option key={clientSeller._id} value={clientSeller._id}>
                                                {`${clientSeller._id} ${clientSeller.passport.first_name} ${clientSeller.passport.second_name} ${clientSeller.passport.middle_name} `}
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
                                <h2>Certifying document info</h2>
                                <div className="form-group">
                                    <div className="form-group">
                                        <label>Certifying document ID:</label>
                                        <input type="text" name="certifyingDocumentID" value={fieldsData.certifyingDocumentID} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Name:</label>
                                        <input type="text" name="certifyingDocumentName" value={fieldsData.certifyingDocumentName} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Issue date:</label>
                                        <DatePicker
                                            name="certifyingDocumentIssueDate"
                                            selected={fieldsData.certifyingDocumentIssueDate}
                                            onChange={(date) => handleDateChange("certifyingDocumentIssueDate", date)}
                                            dateFormat="yyyy-MM-dd"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Issuer:</label>
                                        <input type="text" name="issuer" value={fieldsData.issuer} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
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