import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { PassportCollection } from '../../../api/collections/PassportCollection';

export const PassportList = () => {
    const { isLoading, passports } = useTracker(() => {
        const handle = Meteor.subscribe('passport');
        const isLoading = !handle.ready();
        const passports = PassportCollection.find().fetch();
        return { isLoading, passports };
    });
    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <h2>List of passports</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Passport ID</th>
                        <th>First name</th>
                        <th>Second name</th>
                        <th>Middle name</th>
                        <th>Birth date</th>
                        <th>address</th>
                        <th>Issue date</th>
                        <th>Gender</th>
                    </tr>
                </thead>
                <tbody>
                    {passports.map((passport) => (
                        <tr key={passport._id}>
                            <td>{passport._id}</td>
                            <td>{passport.first_name}</td>
                            <td>{passport.second_name}</td>
                            <td>{passport.middle_name}</td>
                            <td>{passport.birth_date}</td>
                            <td>{passport.address}</td>
                            <td>{passport.issue_date}</td>
                            <td>{passport.gender}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};