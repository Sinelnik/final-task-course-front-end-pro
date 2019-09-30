document.addEventListener("DOMContentLoaded", function() {
	
	window.addEventListener("load", showWeatherByCoordinates);

	function showWeatherByCoordinates() {
		navigator.geolocation.getCurrentPosition(function(pos) {
			var lat = pos.coords.latitude;
			var lon = pos.coords.longitude;
			var requestWeather = fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=b76db1f799bfd7055d8b133c6667219c`);
			requestWeather.then(objPromise => objPromise.json()).then(weatherData => {
				var weatherWidgetByCoord = document.createElement('div');
				weatherWidgetByCoord.classList.add('weatherByCoordinates');
				v.appendChild(weatherWidgetByCoord);
				// weatherWidgetByCoord.style.backgroundColor = 'lime';
				weatherWidgetByCoord.style.borderRadius = '10px';
				weatherWidgetByCoord.style.fontWeight = 'bold';
				weatherWidgetByCoord.style.textAlign = 'center';
				weatherWidgetByCoord.innerHTML = 
					`<span>YOUR CITY:${weatherData.name}</span></br>
					<span>temperature - ${Math.round(weatherData.main.temp-273)}℃</span></br>
					<span>humidity - ${weatherData.main.humidity}%</span></br>
					<span>wind - ${weatherData.wind.speed}m/s</span></br>
					<span>${weatherData.weather[0].description}</span></br>
					<img src="https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png" />`
			})
		})
	}
});