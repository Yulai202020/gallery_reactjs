import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

fetch("/config.json")
  .then(response => {
  // Check if the response status is OK (status code 200-299)
  if (!response.ok) {
    throw new Error('Network response was not ok ' + response.statusText);
  }
  // Parse the response body as JSON (or use response.text() for plain text)
  return response.json();
})
.then(data => {
  // Handle the data from the response
  localStorage.setItem('server_path', data.server_path);
})
.catch(error => {
  // Handle any errors that occurred during the fetch
  console.error('There was a problem with the fetch operation:', error);
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
