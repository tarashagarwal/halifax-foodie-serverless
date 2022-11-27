import React, { useState } from "react";
import Login1 from "./Login1";
import Login2 from "./Login2";
import Login3 from "./Login3";

import UserPool from "../Configs/UserPool";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { useNavigate } from "react-router-dom";

import {addDoc, collection, doc, getDoc} from "firebase/firestore";





function Login() {
    

  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    answer1: "",
    answer2: "",
    answer3: "",
    ciphertext: "",
  });

  const formValidation2 = () => {
    if(formData.answer1 === "" || formData.answer2 === "" || formData.answer3 === "") {
      alert("Please answer all security questions");
      return false;
    }
    return true;
  }
  const formValidation3 = () => {
    if(formData.ciphertext === "") {
      alert("Please enter a ciphertext");
      return false;
    }
    return true;
  }
  
  
  
    const formValidation1 = () => {
      if (formData.email === "") {
        alert("Please enter your email");
        return false;
      } else if(formData.email.indexOf("@") === -1) {
        alert("Please enter a valid email");
        return false;
      } else if (formData.password === "") {
        alert("Please enter your password");
        return false;
      } 
      return true;
    }


    const authenticateUserUsingCognito = () => {
      const user = new CognitoUser({
          Username: formData.email,
          Pool: UserPool
      })
      const authDetails = new AuthenticationDetails({
          Username: formData.email,
          Password: formData.password
      })
      user.authenticateUser(authDetails, {
          onSuccess: (data) => {
              console.log("onSuccess: ", data)
              setPage((currPage) => currPage + 1);  
          },
          onFailure: (err) => {
              alert("Incorrect email or password")
          }
      })

  
  }

  const FormTitles = ["Login1", "Login2", "Login3"];

  const PageDisplay = () => {
    if (page === 0) {
      return <Login1 formData={formData} setFormData={setFormData} />;
    } else if (page === 1) {
      return <Login2 formData={formData} setFormData={setFormData} />;
    } else {
      return <Login3 formData={formData} setFormData={setFormData} />;
    }
  };

    

  const submitHandler = () => {
    if (page === FormTitles.length - 1) {
      
        alert("FORM SUBMITTED");
        console.log(formData);
        

        
        
        
    
  }
  else {
        if(page===0){
        
        if (formValidation1(formData)) {
          authenticateUserUsingCognito();
          setPage((currPage) => currPage + 1);  
        }
        
      }
      else if(page===1){
        if (formValidation2(formData)) {
          setPage((currPage) => currPage + 1);  
        }
  
      }
      else if(page===2){
        if (formValidation3(formData)) {
          setPage((currPage) => currPage + 1);  
        }
        
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

export default Login
