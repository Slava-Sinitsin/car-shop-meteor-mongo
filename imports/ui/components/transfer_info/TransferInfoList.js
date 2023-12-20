import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { TransferInfoCollection } from '../../../api/collections/TransferInfoCollection';

export const TransferInfoList = () => {
    const { isLoading, transferInfos } = useTracker(() => {
        const handleTransferInfo = Meteor.subscribe('transfer_info');
        const isLoading = !handleTransferInfo.ready();
        const transferInfos = TransferInfoCollection.find().fetch();
        return { isLoading, transferInfos };
    });
    if (isLoading) {
        return <div>Loading...</div>;
    }
    const transferInfosToDisplay = transferInfos.slice(1);
    return (
        <div>
            <h2>List of transfer info</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Transfer info ID</th>
                        <th>Previous position</th>
                        <th>Transfer reason</th>
                        <th>Order date</th>
                    </tr>
                </thead>
                <tbody>
                    {transferInfosToDisplay.map((transferInfo, index) => (
                        <tr key={transferInfo._id}>
                            <td>{transferInfo._id}</td>
                            <td>{transferInfo.previous_position}</td>
                            <td>{transferInfo.transfer_reason}</td>
                            <td>{transferInfo.order_date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};