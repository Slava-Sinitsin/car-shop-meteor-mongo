import React from "react";
import { Link } from "react-router-dom";
import "../styles/header.css"

export const Header = ({ user }) => {
    return (
        <div className="header-container">
            <header>
                <Link to="/transfer-info" className="header-link">Transfer Info</Link>
                <Link to="/employee" className="header-link">Employee</Link>
                <Link to="/used-info" className="header-link">Used Info</Link>
                <Link to="/car" className="header-link">Car</Link>
                <Link to="/part" className="header-link">Part</Link>
                <Link to="/passport" className="header-link">Passport</Link>
                <Link to="/client-buyer" className="header-link">Client buyer</Link>
                <Link to="/certifying-document" className="header-link">Certifying document</Link>
                <Link to="/client-seller" className="header-link">Client seller</Link>
            </header>
            <div className="logout-container">
                {user ? <button className="logout-button" onClick={Meteor.logout}>Logout</button> : null}
            </div>
        </div>
    );
}