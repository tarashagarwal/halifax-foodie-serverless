import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import S3 from 'react-aws-s3';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UploadRecipe() {
    window.Buffer = window.Buffer || require("buffer").Buffer;
    let recipe = "";
    let recipename = "";
    let recipeid = "";
    let list = [];
    const [recipeList, setRecipeList] = useState([]);
    let ingredient = "";
    const [selectedFile, setSelectedFile] = useState(null);

    const config = {
        bucketName: "serverless-assignment1-b00890152",
        region: "us-west-2",
        accessKeyId: "AKIAZDZ3OZNH2RTFIHGY",
        secretAccessKey: "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",
    }

    const generateId = () => {
        return Math.floor(Math.random() * 1000000000);
    }

    recipeid = generateId();
    recipeid = recipeid.toString();

    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);
    }

    const uploadFile = async (file) => {

        const ReactS3Client = new S3(config);
        ReactS3Client
            .uploadFile(file, file.name)
            .then(data => console.log(data.location))
            .catch(err => console.error(err))
        recipename = file.name; 
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function () {
            recipe = reader.result;
            recipename = recipename.replace(".txt", "");
            storeDataInDynamoDB(recipe, recipename);
            setTimeout(function () { ListOfRecipesLambda() }, 5000);
        }
    }


    const storeDataInDynamoDB = () => {
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({
                "recipeid": recipeid,
                "restaurantName": localStorage.getItem("email"),
                "recipename": recipename,
                "recipe": recipe,
                "ingredients": "",
                "price": ""
            })
        };

        fetch('https://gs4zohdfkk4crhe7g5wnl2hge40ytyrz.lambda-url.us-east-1.on.aws/', requestOptions)
            .then(async response => {
                const data = await response.text();
                console.log(response);
                response = JSON.parse(data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
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
        <div>React S3 File Upload</div>
        <input type="file" onChange={handleFileInput} />
        <br></br>
        <button onClick={() => uploadFile(selectedFile)}> Upload to S3</button>
        <table>
            <thead>
                <tr>
                    <th>Recipe Name</th>
                    <th>Uploded</th>
                </tr>
            </thead>
            <tbody>
                {recipeList.map((recipe) => (
                    <tr key={recipe.recipeid}>
                        <td>{recipe.recipename}</td>
                        <td>Yes</td>
                    </tr>
                ))}
            </tbody>
        </table>
        <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
        />
    </div>
}

export default UploadRecipe;