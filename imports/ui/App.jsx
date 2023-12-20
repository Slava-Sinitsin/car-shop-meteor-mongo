import React from 'react';
import {useTracker} from 'meteor/react-meteor-data';

import {LoginForm} from './components/LoginForm';
import {Header} from "./components/Header";
import {BrowserRouter} from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";


export const App = () => {

    const {user} = useTracker(() => {
        return ({
            user: Meteor.user(),
        });
    });

    if (!user) {
        return (
            <div className="simple-todos-react">
                <LoginForm/>
            </div>
        );
    }

    return (
        <>
            <BrowserRouter>
                <Header user={user}/>
                <AppRoutes/>
            </BrowserRouter>
        </>
    );
};
