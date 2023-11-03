import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [credentialsData, setCredentialsData] = useState(null);
  const [customersData, setCustomersData] = useState(null);

  useEffect(() => {
    // Make an HTTP GET request to the "credentials" API endpoint
    fetch('http://localhost:3000/credentials')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Update the state with the received data
        setCredentialsData(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []); // The empty array ensures the effect runs only once

  useEffect(() => {
    // Make an HTTP GET request to the "credentials" API endpoint
    fetch('http://localhost:3000/customers')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Update the state with the received data
        setCustomersData(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []); // The empty array ensures the effect runs only once

  return (
    <>
    <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
      {credentialsData && (
        <div>
          <h2>Credentials Data</h2>
          <pre>{JSON.stringify(customersData, null, 2)}</pre>
        </div>
      )}
    </>
  );
}

export default App;
