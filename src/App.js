
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Registration from './CustomerRegistration/Registration';
import RestaurantRegistration from './RestaurantLogin/RestaurantRegistration';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Home/>}/>
      <Route exact path = 'register' element={<Registration/>}/>
      <Route exact path="/RestaurantRegistration1" element={<RestaurantRegistration/>}/>
      
      

</Routes>
    </BrowserRouter>
    
  );
}

export default App;
