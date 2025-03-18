import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainApp from './Components/Pages/Home.js'; 
import Login from './Components/Pages/Login'; 
import Signup from './Components/Pages/Signup.js'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {}
        <Route path="/signup" element={<Signup />} /> {}
        <Route path="/app/*" element={<MainApp />} /> {}
      </Routes>
    </Router>
  );
}

export default App;

