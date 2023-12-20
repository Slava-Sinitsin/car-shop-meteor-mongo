import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { UsedInfoCollection } from '../../../api/collections/UsedInfoCollection';
import { EmployeeCollection } from '../../../api/collections/EmployeeCollection';

export const UsedInfoList = () => {
    const { isLoading, usedInfoWithEmployee } = useTracker(() => {
        const handleUsedInfo = Meteor.subscribe('used_info');
        const handleEmployee = Meteor.subscribe('employee');
        const isLoading = !handleUsedInfo.ready() || !handleEmployee.ready();
        const usedInfo = UsedInfoCollection.find().fetch();
        const employees = EmployeeCollection.find().fetch();
        const usedInfoWithEmployee = usedInfo.map(info => {
            const employee = employees.find(e => e._id === info.employee_id);
            return {
                ...info,
                employee: employee || null
            };
        });
        return { isLoading, usedInfoWithEmployee };
    });
    if (isLoading) {
        return <div>Loading...</div>;
    }
    const usedInfoWithEmployeeToDisplay = usedInfoWithEmployee.slice(1);
    return (
        <div>
            <h2>List of used info</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Used info ID</th>
                        <th>Employee name</th>
                        <th>Purchase price</th>
                        <th>Certificate date</th>
                    </tr>
                </thead>
                <tbody>
                    {usedInfoWithEmployeeToDisplay.map((info, index) => (
                        <tr key={info._id}>
                            <td>{info._id}</td>
                            <td>{`${info.employee.first_name} ${info.employee.middle_name} ${info.employee.second_name}`}</td>
                            <td>{info.purchase_price}</td>
                            <td>{info.certificate_date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};