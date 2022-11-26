import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Registration from './CustomerRegistration/Registration';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Home/>}/>
      <Route path = 'register' element={<Registration/>}/>
</Routes>
    </BrowserRouter>
    
  );
}

export default App;
