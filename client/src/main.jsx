import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import EmailForm from './EmailForm.jsx'
import { Homepg } from './Homepg.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route exact path="" component={Homepg}>
      <Route path="" element={<Homepg />} /> 
      <Route path="/form" element={<EmailForm />} /> 
    </Route>
  )
);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);