import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';    
import S3 from 'react-aws-s3';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//This function is used to extract the ingredients from the recipes
function ExtractIngredients() {

    let recipeid = "";
    let list = [];
    const [recipeList, setRecipeList] = useState([]);
    let ingredient = "";
    const [selectedFile, setSelectedFile] = useState(null);

    //generating a random recipe id
    const generateId = () => {
        return Math.floor(Math.random() * 1000000000);
    }

    recipeid = generateId();
    recipeid = recipeid.toString();

    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);
    }

   
//Author(s) name: MDN Web Docs
//Date: 28 November 2022
//Title of program/source code: Using the Fetch API
//Code version: v1
//Type: Code
//Web address: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

//This function is used to call lambda function using fetch API
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


//Author(s) name: MDN Web Docs
//Date: 28 November 2022
//Title of program/source code: Using the Fetch API
//Code version: v1
//Type: Code
//Web address: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

//This function is used to call lambda function using fetch API
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
                //remove last comma
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
                        <td>{recipe.title}</td>
                        <td><button onClick={() => getIngredients(recipe.recipeid)}>Extract Ingredients</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
        <ToastContainer />
    </div>
}
export default ExtractIngredients;