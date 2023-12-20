import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { CertifyingDocumentCollection } from '../../../api/collections/CertifyingDocumentCollection';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO, format } from 'date-fns';

export const CertifyingDocumentEdit = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [fieldsData, setFieldsData] = useState({
        certifyingDocumentSelect: 'select',
        id: '',
        name: '',
        issueDate: '',
        issuer: ''
    });

    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setFieldsData({
            certifyingDocumentSelect: '',
            id: '',
            name: '',
            issueDate: '',
            issuer: ''
        });
    };

    const certifyingDocuments = useTracker(() => {
        Meteor.subscribe('certifying_document');
        return CertifyingDocumentCollection.find().fetch();
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFieldsData({
            ...fieldsData,
            [name]: value
        });

        if (name === 'certifyingDocumentSelect' && value) {
            if (value == 'select') {
                setFieldsData((prevData) => ({
                    ...prevData,
                    id: '',
                    name: '',
                    issueDate: '',
                    issuer: ''
                }));
            }
            const selectedCertifyingDocument = certifyingDocuments.find((certifyingDocument) => certifyingDocument._id == value);
            if (selectedCertifyingDocument) {
                setFieldsData((prevData) => ({
                    ...prevData,
                    id: selectedCertifyingDocument._id,
                    name: selectedCertifyingDocument.name,
                    issueDate: selectedCertifyingDocument.issue_date ? parseISO(selectedCertifyingDocument.issue_date) : null,
                    issuer: selectedCertifyingDocument.issuer
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

    const handleCertifyingDocumentUpdate = async () => {
        const editedCertifyingDocument = {
            _id: fieldsData.id,
            name: fieldsData.name,
            issue_date: format(fieldsData.issueDate, 'yyyy-MM-dd'),
            issuer: fieldsData.issuer
        };
        await Meteor.call('certifying_document.update', fieldsData.id, editedCertifyingDocument);
    };

    const handleSubmit = () => {
        if (fieldsData.transferInfoSelect != 'select') {
            handleCertifyingDocumentUpdate();
        }
        closeDialog();
    };

    return (
        <div>
            <button className="open-dialog-button" onClick={openDialog}>
                Edit certifying document
            </button>
            {isDialogOpen && (
                <div className="dialog-overlay">
                    <div className="dialog-content">
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <div className="column">
                                <h2>Certifying document info</h2>
                                <div className="form-group">
                                    <label>Certifying document ID:</label>
                                    <select className="form-group" name="certifyingDocumentSelect" value={fieldsData.certifyingDocumentSelect} onChange={handleInputChange}>
                                        <option value="select">Select certifying document</option>
                                        {certifyingDocuments.map((certifyingDocument) => (
                                            <option key={certifyingDocument._id} value={certifyingDocument._id}>
                                                {`${certifyingDocument._id}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginLeft: '20px' }}></div>
                            <div className="column">
                                <h2>Certifying document properties</h2>
                                <div className="form-group">
                                    <label>Name:</label>
                                    <input type="text" name="name" value={fieldsData.name} onChange={handleInputChange} />
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
                                    <label>Issuer:</label>
                                    <input type="text" name="issuer" value={fieldsData.issuer} onChange={handleInputChange} />
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