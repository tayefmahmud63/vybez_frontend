import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ForgotPassword from './components/ForgotPassword/ForgotPassword'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
const warr = window.location.pathname.split('/')

const root = ReactDOM.createRoot(document.getElementById('root'));
switch(warr[1].toLowerCase()){
  case "":
    renderer(<App/>)

  break;
  
  case "login":
    renderer(<Login/>)

  break;
  case "signup":
    renderer(<Signup/>)

  break;
  case "forgot-password":
    renderer(<ForgotPassword/>)

  break;
 
}
function renderer(element){
  root.render(
    <React.StrictMode>
      {element}
    </React.StrictMode>
  );
}

reportWebVitals();
