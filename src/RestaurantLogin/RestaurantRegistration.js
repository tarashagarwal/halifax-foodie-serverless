import React, { useState } from "react";
import Registration1 from "./RestaurantRegistration1";
import Registration2 from "./RestaurantRegistration2";
import Registration3 from "./RestaurantRegistration3";
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import UserPool from '../Configs/UserPool';
import {db} from '../Configs/Firebaseconfig';
import {addDoc, collection, getDocs} from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";


import axios from 'axios';
import { useNavigate } from "react-router-dom";


function RestaurantRegistration() {
  let data ={}
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    restaurantname: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    address: "",
    phoneNumber: "",
    answer1: "",
    answer2: "",
    answer3: "",
    key: "",
    plaintext: ""
  });



  const FormTitles = ["Registration1", "Registration2", "Registration3"];

  const PageDisplay = () => {
    if (page === 0) {
      return <Registration1 formData={formData} setFormData={setFormData} />;
    } else if (page === 1) {
      return <Registration2 formData={formData} setFormData={setFormData} />;
    } else {
      return <Registration3 formData={formData} setFormData={setFormData} />;
    }
  };

  const submitHandler = () => {
    if (page === FormTitles.length - 1) {
      
        alert("FORM SUBMITTED");
        console.log(formData);
        
      
        
        navigate('/login');
        
    
  }
  else {
      if(page===0){
        
       
          setPage((currPage) => currPage + 1);  
       
        
      }
      else if(page===1){
        
          setPage((currPage) => currPage + 1);  
        
  
      }
      else if(page===2){
        
          setPage((currPage) => currPage + 1);  
        
        
      }
      
    }
  }

  return (
    <div className="form">
      <div className="progressbar">
        <div
          style={{ width: page === 0 ? "33.3%" : page == 1 ? "66.6%" : "100%" }}
        ></div>
      </div>
      <div className="form-container">
        <div className="header">
          <h1>{FormTitles[page]}</h1>
        </div>
        <div className="body">{PageDisplay()}</div>
        <div className="footer">
          <button
            disabled={page == 0}
            onClick={() => {
              setPage((currPage) => currPage - 1);
            }}
          >
            Prev
          </button>
          <button
            onClick={submitHandler}
            >

            {page === FormTitles.length - 1 ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RestaurantRegistration;
