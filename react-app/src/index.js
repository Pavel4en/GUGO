import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

export default function MyForm() {
    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);

        // Or you can work with it as a plain object:
        const formJson = Object.fromEntries(formData.entries());

        const taskName = formJson['taskname'];

        const requestOptions = {
            method: 'POST',
        };

        fetch('http://127.0.0.1:5000/delete_task/' + taskName, requestOptions).then();

    }

    return (
        <form method="post" onSubmit={handleSubmit}>
            <label>
                Text input: <input className="inputClass" name="taskname"/>
            </label>
            <hr/>
            <button type="reset">Reset form</button>
            <button type="submit">Delete task</button>
        </form>
    );
}


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <MyForm />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
