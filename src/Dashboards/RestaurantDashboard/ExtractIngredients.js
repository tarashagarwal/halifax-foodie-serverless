import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';    
import S3 from 'react-aws-s3';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ExtractIngredients() {

    let recipeid = "";
    let list = [];
    const [recipeList, setRecipeList] = useState([]);
    let ingredient = "";
    const [selectedFile, setSelectedFile] = useState(null);

    const generateId = () => {
        return Math.floor(Math.random() * 1000000000);
    }

    recipeid = generateId();
    recipeid = recipeid.toString();

    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);
    }

   

    const ListOfRecipesLambda = () => {
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({
                "email": localStorage.getItem("email") 
            })
        };
        fetch('https://v7m2ht3ukkvzcahqfsfw274xpy0xalol.lambda-url.us-east-1.on.aws/', requestOptions)
            .then(async response => {
                const data = await response.text();
                console.log(response);
                response = JSON.parse(data);
                for (var i = 0; i < response.length; i++) {
                    list.push(response[i]);
                }
                setRecipeList(list);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    const onSubmit = (e) => {
        e.preventDefault();
        ListOfRecipesLambda();
    }
    
    const getIngredients = (id) => {
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({
                "recipeid": id
            })
        };
    
        fetch('https://qsjuo6lqt3pv7z7q35q332elmu0utnwt.lambda-url.us-east-1.on.aws/', requestOptions)
            .then(async response => {
                const data = await response.text();
                console.log(response);
                response = JSON.parse(data);
                for (var i = 0; i < response.length; i++) {
                    ingredient = ingredient + response[i] + ", ";
                }
                ingredient = ingredient.slice(0, -2);

                toast.info(ingredient, {
                    position: "top-center",
                    autoClose: 5000,
                    width: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    });
                ingredient = "";
            })
            .catch(error => {
                console.error('There was an error!', error);
            });    
    }

    return <div>
        <button onClick={onSubmit}>Extract Ingredients</button>
        <table>
            <thead>
                <tr>
                    <th>Recipe Name</th>
                    <th>Extract Ingredients</th>
                </tr>
            </thead>
            <tbody>
                {recipeList.map((recipe) => (
                    <tr key={recipe.recipeid}>
                        <td>{recipe.recipename}</td>
                        <td><button onClick={() => getIngredients(recipe.recipeid)}>Extract Ingredients</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
        <ToastContainer />
    </div>
}
export default ExtractIngredients;