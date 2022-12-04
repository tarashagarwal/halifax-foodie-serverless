import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


function CustomerDashboard() {
    const navigate = useNavigate();
    const logout = () => {
        navigate(`/login`)
        //do not allow user to go back to dashboard
        window.history.pushState(null, null, window.location.href);
        window.onpopstate = function () {
            window.history.go(1);
        };
        localStorage.clear();
    }
    return (
        <div>
            <h1>CustomerDashboard</h1>
            <button onClick={logout}>logout</button>
            <button onClick={() => navigate(`/chat`)}>Chat</button>       
            <iframe width="600" height="450" src="https://datastudio.google.com/embed/reporting/92dbfdce-0609-4e69-bd35-4c67f883e8d4/page/Q7Y9C"></iframe>
        </div>
    )
}
export default CustomerDashboard