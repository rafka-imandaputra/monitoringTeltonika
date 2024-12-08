import React from "react"
//import ReactDOM from "react-dom/client";

import { createRoot } from 'react-dom/client';
//import { BrowserRouter } from 'react-router-dom';

import App from './App';

const rootElement = document.getElementById("root")
const root = createRoot(rootElement);

// const root = ReactDOM.createRoot(document.getElementById ('root'))
root.render(
    // <BrowserRouter>
        <App/>
    // </BrowserRouter>
);