//import {useState} from 'react';
import Login from './login.tsx';
import Adddata from './home/adddata.tsx';
import SignUpForm from './signup.tsx';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Updatedata from './home/updatedata.tsx';
import Admin from './admin.tsx';


function App() {
  

  return (
     <BrowserRouter>
     <Routes>
    <Route path='/' element={<Login/>}></Route>
    <Route path="/Adddata" element={<Adddata/>}></Route>
    <Route path="/Updatedata" element={<Updatedata/>}></Route>
    <Route path="/Signup" element={<SignUpForm/>}></Route>
    <Route path="/Admin" element={<Admin/>}></Route>
     </Routes>
     </BrowserRouter>
    
  )
}

export default App
