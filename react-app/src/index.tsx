import React from 'react';
import ReactDOM from 'react-dom/client'

import reportWebVitals from './reportWebVitals';

import TodoApp from "./todo";


const App = () => {
    return (
        <React.StrictMode>
            <TodoApp/>
        </React.StrictMode>
    );
}


const rootElement = document.getElementById('root');
if (!rootElement)
    throw new Error("No root node");
const root = ReactDOM.createRoot(rootElement);

root.render(
    <App/>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

