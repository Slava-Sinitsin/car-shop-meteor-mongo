import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { EmployeeCollection } from '../../../api/collections/EmployeeCollection';
import { TransferInfoCollection } from '../../../api/collections/TransferInfoCollection';

export const EmployeeList = () => {
    const { isLoading, employeesWithTransferInfo } = useTracker(() => {
        const handleEmployees = Meteor.subscribe('employee');
        const handleTransferInfo = Meteor.subscribe('transfer_info');
        const isLoading = !handleEmployees.ready() || !handleTransferInfo.ready();
        const employees = EmployeeCollection.find().fetch();
        const transferInfos = TransferInfoCollection.find().fetch();
        const employeesWithTransferInfo = employees.map(employee => {
            const transferInfo = transferInfos.find(t => t._id === employee.transfer_info_id);
            return {
                ...employee,
                transferInfo: transferInfo || null
            };
        });
        return { isLoading, employeesWithTransferInfo };
    });
    if (isLoading) {
        return <div>Loading...</div>;
    }
    const employeesWithTransferInfoToDisplay = employeesWithTransferInfo.slice(1);
    return (
        <div>
            <h2>List of employees</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Previous position</th>
                        <th>First name</th>
                        <th>Second name</th>
                        <th>Middle name</th>
                        <th>Birth date</th>
                        <th>address</th>
                        <th>position</th>
                        <th>salary</th>
                    </tr>
                </thead>
                <tbody>
                    {employeesWithTransferInfoToDisplay.map((employee, index) => (
                        <tr key={employee._id}>
                            <td>{index + 1}</td>
                            <td>{employee.transferInfo.previous_position}</td>
                            <td>{employee.first_name}</td>
                            <td>{employee.second_name}</td>
                            <td>{employee.middle_name}</td>
                            <td>{employee.birth_date}</td>
                            <td>{employee.address}</td>
                            <td>{employee.position}</td>
                            <td>{employee.salary}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};