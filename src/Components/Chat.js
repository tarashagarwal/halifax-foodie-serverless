import React, { useRef, useState } from 'react';
import '../stylesheets/chat.css';

import firebase from 'firebase1/app';
import 'firebase1/firestore';
import 'firebase1/auth';
import 'firebase1/analytics';
import {ChatMessage} from './ChatMessage';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCkT1zMl4Fsdas8l4DlCqjs5fP7lkRf9GLiyIc",
  authDomain: "serverless-project-3ddb2.firebaseapp.com",
  projectId: "serverless-project-3ddb2",
  storageBucket: "serverless-project-3ddb2.appspot.com",
  messagingSenderId: "823169040365",
  appId: "1:823169040365:web:31f7384225d4b4015d31e4",
  measurementId: "G-HNGEXN0LW7"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();


function Chat() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <ChatRoom />
    </div>
  );
}

function ChatRoom() {
  const userKey = "email"
  const oppositeUserKey = "opposite_user_id"
  var userInParameter = window.location.search.substr(1).split("=")[1]
  var currentUser = window.localStorage.getItem(userKey);

  if(userInParameter != "" && userInParameter != undefined){
     currentUser = userInParameter
  }

  var oppositeUser = window.localStorage.getItem(oppositeUserKey);
  if(oppositeUser == "" || oppositeUser == undefined){
    oppositeUser = 'support@halifaxfoodie.com'
  }

  console.log(currentUser + "=>" + oppositeUser)
  const dummy = useRef();

  const messagesRef = firestore.collection('messages');
  const users = [currentUser + ":" + oppositeUser, oppositeUser + ":" + currentUser]
  const queryCurrentUser = messagesRef.where('oppuid', 'in', users).orderBy('createdAt').limit(25)
  const [messages] = useCollectionData(queryCurrentUser, { idField: 'id' });
  console.log(messages)

  const [formValue, setFormValue] = useState('');



  const sendMessage = async (e) => {
    e.preventDefault();

    //const { uid, photoURL } = auth.currentUser;
    //get uid from local Storage
    const userKey = "email"
    const oppositeUserKey = "opposite_user_id"
  
    var currentUser = window.localStorage.getItem(userKey);
    var oppositeUser = window.localStorage.getItem(oppositeUserKey);

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid: currentUser,
      oppuid: currentUser + ":" + oppositeUser
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }
 

  return (<>
    <main>
      {messages && messages.map(msge => <ChatMessage msgType={(msge.uid == window.localStorage.getItem("email")) ? "Right" : "Left" } msg={msge.text} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />

      <button type="submit">Submit</button>

    </form>
  </>)

}



export default Chat;
