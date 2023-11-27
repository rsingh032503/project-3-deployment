import { useState, useEffect } from 'react';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import { images } from '../images.js'; // path to the images.js file
import '../styles/MenuBoard.css';
import '../styles/index.css';

function MenuBoard() {
  	// const [count, setCount] = useState(0);
  	// const [credentialsData, setCredentialsData] = useState(null);
  	// const [customersData, setCustomersData] = useState(null);
  	const [menuItemsData, setMenuItemsData] = useState(null);
 	 const [weatherData, setWeatherData] = useState(null);

 	 useEffect(() => {
   		fetch('https://project-3-09m-server.onrender.com/menu_item')
    	    .then(response => {
        	    if (!response.ok) {
                  	throw new Error('Network response was not ok');
             	 }
     	         return response.json();
       	   	})
       	   	.then(data => {
       	       	setMenuItemsData(data);
       	   	})
        	.catch(error => {
              	console.error('Error:', error);
          	});

      	const fetchWeatherData = async () => {
        	const API_KEY = 'c07de4218ecd476595111859231611';
        	const LOCATION = 'College Station';
        	try {
          	const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${LOCATION}&days=3`);
          	if (!response.ok) {
         		throw new Error('Network response was not ok');
          	}
          	const data = await response.json();
          	setWeatherData(data);
        	} catch (error) {
          		console.error('Error:', error);
        	}
      	};
      	fetchWeatherData();
  	}, []);

  	return (
    	<>
    	<h1 className="text-3xl font-bold underline" id="homepage">
      		Welcome to Sharetea!
    	</h1>
      	{menuItemsData && (
        	<div className="menu-items-container">
            	{menuItemsData.menu_item.map(item => (
                	<div key={item.id} className="menu-item">
                    	<img src={images[item.name]} alt={item.name} />
                    	<p>{item.name}</p>
                	</div>
            	))}
        	</div>
      	)}
		{weatherData && (
		<div className="weather-container">
			<h2>Weather in {weatherData.location.name}</h2>
			<h3>Current temperature: {weatherData.current.temp_f}°F</h3>
			<h3>Forecast:</h3>
			<div className="forecast-container">
			{weatherData.forecast.forecastday.map((day) => (
				<div key={day.date} className="forecast-day">
				<h4>{day.date}</h4>
				<img src={day.day.condition.icon} alt={day.day.condition.text} />
				<p>{day.day.condition.text}</p>
				<p>Max temp: {day.day.maxtemp_f}°F</p>
				<p>Min temp: {day.day.mintemp_f}°F</p>
				<p>Chance of rain: {day.day.daily_chance_of_rain}%</p>
				</div>
			))}
			</div>
		</div>
		)}     
    	</>
  	);
}

export default MenuBoard;
