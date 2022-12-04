import React, { useState } from "react";
import Login1 from "./Login1";
import Login2 from "./Login2";
import Login3 from "./Login3";
import UserPool from "../Configs/UserPool";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { useNavigate } from "react-router-dom";
import { db } from "../Configs/Firebaseconfig";
import { addDoc, collection, doc, getDoc, setDoc} from "firebase2/firestore";


//Author(s) name: machadop1407
//Date: 28 November 2022
//Title of program/source code: multi-step-form-react
//Code version: v1
//Type: Code
//Web address: https://github.com/machadop1407/multi-step-form-react

//This code is a multi-step form that allows users to register as a customer or restaurant. It uses React and Firebase.

function Login() {
  let data = {}
  const userCollection = collection(db, "QuestionAnswers");
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

  
  //This function is used to validate the second page of the form
  const formValidation2 = () => {
    if (formData.answer1 === "" || formData.answer2 === "" || formData.answer3 === "") {
      alert("Please answer all security questions");
      return false;
    }
    return true;
  }

  //This function is used to validate the third page of the form
  const formValidation3 = () => {
    if (formData.ciphertext === "") {
      alert("Please enter a ciphertext");
      return false;
    }
    return true;
  }

  //This function is used to validate the first page of the form
  const formValidation1 = () => {
    if (formData.email === "") {
      alert("Please enter your email");
      return false;
    } else if (formData.email.indexOf("@") === -1) {
      alert("Please enter a valid email");
      return false;
    } else if (formData.password === "") {
      alert("Please enter your password");
      return false;
    }
    return true;
  }

//Author(s) name: SoftAuuthor
//Date: 28 November 2022
//Title of program/source code: Firebase 9 Firestore Get A Document By ID Using getDoc()
//Code version: v1
//Type: Code
//Web address: https://softauthor.com/firebase-firestore-get-document-by-id/

  //This function is used to get answers to security questions from firestore and compare them to the answers entered by the user
  const getdata = async () => {
    const docRef = doc(db, "QuestionAnswers", formData.email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      var answer1 = docSnap.data().answer1;
      var answer2 = docSnap.data().answer2;
      var answer3 = docSnap.data().answer3;
      if (answer1 === formData.answer1 && answer2 === formData.answer2 && answer3 === formData.answer3) {
        //navigate user to the next page of the form
        setPage((currPage) => currPage + 1);
      }
      else {
        alert("Incorrect answers");
      }
    } else {
      console.log("No such document!");
    }
  }

  //Author(s) name: AWS Developer Guide
  //Date: 28 November 2022
  //Title of program/source code: Authentication with User Pools
  //Code version: v1
  //Type: Code
  //Web address: https://docs.aws.amazon.com/cognito/latest/developerguide/authentication.html

  //This function is used to authenticate the user using Cognito
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


//Author(s) name: MDN Web Docs
//Date: 28 November 2022
//Title of program/source code: Using the Fetch API
//Code version: v1
//Type: Code
//Web address: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

//This function is used to call lambda function using fetch API
  const ciphertextforCustomer = () => {
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(formData)
    };
    fetch('https://3tesarwbkmin5m2u2ilxmsrb4a0fibfb.lambda-url.us-east-1.on.aws/', requestOptions)
      .then(async response => {
        const data = await response.json();
        console.log(response);
        var ciphertext = JSON.stringify(data);
        //removing the first and last character of the ciphertext
        var stringwithoutquotes = ciphertext.replace(/['"]+/g, '');
        if (stringwithoutquotes === formData.ciphertext) {
          storeUserInFirestore();
          navigate("/CustomerDashboard");
        }
        else {
          alert("Incorrect ciphertext");
        }
      })
      .catch(error => {

        console.error('There was an error!', error);
      });
  }

//Author(s) name: MDN Web Docs
//Date: 28 November 2022
//Title of program/source code: Using the Fetch API
//Code version: v1
//Type: Code
//Web address: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

//This function is used to call lambda function using fetch API
const ciphertextforRestaurant = () => {
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(formData)
    };
    fetch('https://sujj5roew6ye6fwxeeaiwvguuu0ddwxy.lambda-url.us-east-1.on.aws/', requestOptions)
      .then(async response => {
        const data = await response.json();
        console.log(response);
        var ciphertext = JSON.stringify(data);
        var stringwithoutquotes = ciphertext.replace(/['"]+/g, '');
        if (stringwithoutquotes === formData.ciphertext) {
          storeUserInFirestore();
          navigate("/RestaurantDashboard");
        }
        else {
          alert("Incorrect ciphertext");
        }
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }

//Author(s) name: MDN Web Docs
//Date: 28 November 2022
//Title of program/source code: Using the Fetch API
//Code version: v1
//Type: Code
//Web address: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

//This function is used to call lambda function using fetch API
  const checkCustomerLambda = () => {
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(formData)
    };
    fetch('https://taar64njhgfd4np4eea3lshzay0usvlt.lambda-url.us-east-1.on.aws/', requestOptions)
      .then(async response => {
        const data = await response.json();
        if (JSON.stringify(data) === '"true"') {
          ciphertextforCustomer();

          //storing user information in local storage
          localStorage.setItem("email", formData.email);
          localStorage.setItem("CustomerType", "Customer");
          localStorage.setItem("opposite_user_id", "sticknet.assist@gmail.com");
        }
        else {
          ciphertextforRestaurant();

          //storing user information in local storage
          localStorage.setItem("email", formData.email);
          localStorage.setItem("CustomerType", "Restaurant");
          localStorage.setItem("opposite_user_id", "rahulmac17599@gmail.com");
        }
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
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

//Author(s) name: Firebase Documentation
//Date: 28 November 2022
//Title of program/source code: Add data to Cloud Firestore
//Code version: v1
//Type: Code
//Web address: https://firebase.google.com/docs/firestore/manage-data/add-data

//This function is used to store user information in firestore
  const storeUserInFirestore = async () => {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;
    data = {
      last_login: dateTime
    }
    await setDoc(doc(db, "LoginInformation", formData.email), data);
  }

  const submitHandler = () => {
    if (page === FormTitles.length - 1) {
      if (formValidation3(formData)) {
        console.log(formData);
        checkCustomerLambda();
      }
    }
    else {
      if (page === 0) {
        if (formValidation1(formData)) {
          authenticateUserUsingCognito();
        }
      }
      else if (page === 1) {
        if (formValidation2(formData)) {
          getdata();
        }
      }
      else if (page === 2) {
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
        >
        </div>
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
