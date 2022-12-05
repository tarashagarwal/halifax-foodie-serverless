import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import S3 from 'react-aws-s3';
import { useNavigate } from "react-router-dom";

function RestaurantDashboard() {
    const navigate = useNavigate();
    const navigateUploadRecipe = () => {
        navigate(`/UploadRecipe`)
    }

    const navigateExtractIngredients = () => {
        navigate(`/ExtractIngredients`)
    }

    const logout = () => {
        navigate(`/login`)
        window.history.pushState(null, null, window.location.href);
        window.onpopstate = function () {
            window.history.go(1);
        };
        localStorage.clear();
    }
    const navigateShowVisualizations = () => {
        navigate(`/visual`)
    }

    const navigateChat = () => {
        navigate(`/chat`)
    }

    return (
        <div style={{ backgroundColor: "#F5F5F5" }}>
            <h1>RestaurantDashboard</h1>
            <div>
                <button onClick={navigateUploadRecipe}> Upload recipes </button>
            </div>
            <div>
                <button onClick={navigateExtractIngredients}> Extract ingredients from Recipes </button>
            </div>
            <div>
            <button onClick={navigateShowVisualizations}> Show Visualizations</button>

            <button onClick={navigateChat}>Chat</button>
                <div>
                    <button onClick={logout}>logout</button>
                </div>
            </div>
        </div>
    )
}
export default RestaurantDashboard