import { useState, useEffect } from 'react';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import { images } from '../images.js'; // path to the images.js file
import '../styles/MenuBoard.css';
import '../styles/index.css';
import { useLanguage } from '../LanguageContext';
import FontSizeIncreaser from '../FontSizeIncreaser';

function MenuBoard() {
  	// const [count, setCount] = useState(0);
  	// const [credentialsData, setCredentialsData] = useState(null);
  	// const [customersData, setCustomersData] = useState(null);
  	const [menuItemsData, setMenuItemsData] = useState(null);
 	 const [weatherData, setWeatherData] = useState(null);
	const { language } = useLanguage();
	let [loading, setLoading] = useState(true);
	const [fontSize, setFontSize] = useState(16);
	const [welcomeFontSize, setWelcomeFontSize] = useState(55);
	const [weatherTitleFontSize, setWeatherTitleFontSize] = useState(25);
	const [forecastTitleFontSize, setForecastTitleFontSize] = useState(20);

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
			.then(() => {
					setLoading(false);
					if (language === 'es') {
					  translatePage();
					}
				  })
				  .catch(error => console.error('Error:', error));

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
  	}, [language]);

	  const translatePage = async () => {
		try {
		  const elementsToTranslate = document.querySelectorAll('[data-translate]');
	
		  for (const element of elementsToTranslate) {
			const textToTranslate = element.innerText;
	
			const apiKey = 'AIzaSyD2cZ2edFWnb15EsgO2BvfjyJdtP9z7LLQ';
			const targetLanguage = language === 'es' ? 'es' : 'en';
			const response = await fetch(
			  `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
			  {
				method: 'POST',
				headers: {
				  'Content-Type': 'application/json',
				},
				body: JSON.stringify({
				  q: textToTranslate,
				  target: targetLanguage,
				}),
			  }
			);
	
			const data = await response.json();
	
			if (data && data.data && data.data.translations && data.data.translations[0]) {
			  const translatedText = data.data.translations[0].translatedText;
			  element.innerText = translatedText;
			}
		  }
		} catch (error) {
		  console.error('Error translating text:', error);
		}
	  };

	  const handleFontSizeChange = (newFontSize) => {
		setFontSize(newFontSize);
		setWeatherTitleFontSize(newFontSize);
		setWelcomeFontSize(newFontSize);
		setForecastTitleFontSize(newFontSize);
	  };

	  const handleFontSizeDecrease = () => {
		setFontSize((prevSize) => (prevSize - 2));
		setWeatherTitleFontSize((prevSize) => (prevSize - 2));
		setWelcomeFontSize((prevSize) => (prevSize - 2));
		setForecastTitleFontSize((prevSize) => (prevSize - 2));
	  };
	

  	return (
    	<>
    	<h1 className="Title" id="homepage" data-translate>
      		Welcome to Sharetea!
    	</h1>
      	{menuItemsData && (
        	<div className="menu-items-container">
            	{menuItemsData.menu_item.map(item => (
                	<div key={item.id} className="menu-item">
                    	<img src={images[item.name]} alt={item.name} />
                    	<p style={{ fontSize: `${fontSize}px` }} data-translate>{item.name}</p>
                	</div>
            	))}
        	</div>
      	)}
		{weatherData && (
		<div className="weather-container">
			<h2 style={{ fontSize: `${weatherTitleFontSize}px` }} data-translate>Weather in {weatherData.location.name}</h2>
			<h3 style={{ fontSize: `${weatherTitleFontSize}px` }} data-translate>Current temperature: {weatherData.current.temp_f}°F</h3>
			<h3  style={{ fontSize: `${forecastTitleFontSize}px` }} data-translate>Forecast:</h3>
			<div className="forecast-container">
			{weatherData.forecast.forecastday.map((day) => (
				<div key={day.date} className="forecast-day">
				<h4 style={{ fontSize: `${fontSize}px` }} >{day.date}</h4>
				<img src={day.day.condition.icon} alt={day.day.condition.text} />
				<p style={{ fontSize: `${fontSize}px` }} data-translate>{day.day.condition.text}</p>
				<p style={{ fontSize: `${fontSize}px` }} data-translate >Max temp: {day.day.maxtemp_f}°F</p>
				<p style={{ fontSize: `${fontSize}px` }} data-translate>Min temp: {day.day.mintemp_f}°F</p>
				<p style={{ fontSize: `${fontSize}px` }} data-translate>Chance of rain: {day.day.daily_chance_of_rain}%</p>
				</div>
			))}
			</div>
			<FontSizeIncreaser onFontSizeChange={handleFontSizeChange} />
			<button onClick={handleFontSizeDecrease}>Decrease Font Size</button>
		</div>
		)}     
    	</>
  	);
}

export default MenuBoard;
