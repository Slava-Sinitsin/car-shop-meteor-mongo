import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { TransferInfoCollection } from '../../../api/collections/TransferInfoCollection';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO, format } from 'date-fns';

export const TransferInfoEdit = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [fieldsData, setFieldsData] = useState({
        transferInfoSelect: 'select',
        transferInfoID: '',
        previousPosition: '',
        transferReason: '',
        orderDate: ''
    });

    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setFieldsData({
            transferInfoSelect: 'select',
            transferReason: '',
            orderDate: ''
        });
    };

    const transferInfoList = useTracker(() => {
        Meteor.subscribe('transfer_info');
        return TransferInfoCollection.find().fetch().slice(1);
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFieldsData({
            ...fieldsData,
            [name]: value
        });

        if (name === 'transferInfoSelect' && value) {
            if (value == 'select') {
                setFieldsData((prevData) => ({
                    ...prevData,
                    transferReason: '',
                    orderDate: ''
                }));
            }
            const selectedtransferInfo = transferInfoList.find((transferInfo) => transferInfo._id == value);
            if (selectedtransferInfo) {
                setFieldsData((prevData) => ({
                    ...prevData,
                    transferInfoID: selectedtransferInfo._id,
                    previousPosition: selectedtransferInfo.previous_position,
                    transferReason: selectedtransferInfo.transfer_reason,
                    orderDate: selectedtransferInfo.order_date ? parseISO(selectedtransferInfo.order_date) : null
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

    const handleTransferInfoUpdate = async () => {
        const editedTransferInfo = {
            _id: fieldsData.transferInfoID,
            previous_position: fieldsData.previousPosition,
            transfer_reason: fieldsData.transferReason,
            order_date: format(fieldsData.orderDate, 'yyyy-MM-dd')
        };
        await Meteor.call('transfer_info.update', fieldsData.transferInfoID, editedTransferInfo);
    };

    const handleSubmit = () => {
        if (fieldsData.transferInfoSelect != 'select') {
            handleTransferInfoUpdate();
        }
        closeDialog();
    };

    return (
        <div>
            <button className="open-dialog-button" onClick={openDialog}>
                Edit transfer info
            </button>
            {isDialogOpen && (
                <div className="dialog-overlay">
                    <div className="dialog-content">
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <div className="column">
                                <h2>Transfer info</h2>
                                <div className="form-group">
                                    <label>Transfer info ID:</label>
                                    <select className="form-group" name="transferInfoSelect" value={fieldsData.transferInfoSelect} onChange={handleInputChange} style={{ width: '160px' }}>
                                        <option value="select">Select transfer info</option>
                                        {transferInfoList.map((transferInfo) => (
                                            <option key={transferInfo._id} value={transferInfo._id}>
                                                {`${transferInfo._id}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginLeft: '20px' }}></div>
                            <div className="column">
                                <h2>Transfer info properties</h2>
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