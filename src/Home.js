import React from "react";
import { useNavigate } from "react-router-dom";

function Home  () {

    const navigate = useNavigate()
    
      
  return (
    <div className="App">
      <h1>Welcome to Halifax Foodie</h1>
      
        <button onClick={() => navigate(`/login`)}>Login</button>
      
        <button onClick={() => navigate(`/register`)}>Register</button>

        <button onClick={() => navigate(`/online-support`)}>Chat</button>
  
  
    </div>
  );
}

export default Home