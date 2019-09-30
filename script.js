document.addEventListener("DOMContentLoaded", function() {

	window.addEventListener("load", showWeatherByCoordinates);
	window.addEventListener("load", showExchangeRates);

	var body = document.body;
	var p = document.createElement('p');
	var v = document.createElement('p');
	p.classList.add('weatherByCityName');
	v.classList.add('widget');
	body.appendChild(p);
	body.appendChild(v);

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

	function showExchangeRates() {
		var exchangeRates = fetch('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5');
		exchangeRates.then(objPromise => objPromise.json()).then(courseData => {
			var exchangeWidget = document.createElement('div');
			exchangeWidget.classList.add('exchangeWidget');
			v.appendChild(exchangeWidget);
			// exchangeWidget.style.backgroundColor = 'lime';
			exchangeWidget.style.borderRadius = '10px';
			exchangeWidget.style.fontWeight = 'bold';
			exchangeWidget.style.textAlign = 'center';
			exchangeWidget.innerHTML =
				`<p><span>EXCHANGE RATES</span></br>
				<span>${courseData[0].ccy} ${courseData[0].buy.toString().substring(0,5)} \$ ${courseData[0].sale.toString().substring(0,5)}</span></br>
				<span>${courseData[1].ccy} ${courseData[1].buy.toString().substring(0,5)} \€ ${courseData[1].sale.toString().substring(0,5)}</span></br>
				<span>${courseData[2].ccy} ${courseData[2].buy.toString().substring(0,5)} \₽ ${courseData[2].sale.toString().substring(0,5)}</span></br>
				</p>`
		})
	}

	var button = document.querySelector('.resetButton');
	var input = document.querySelector('.text');

	function showWeatherByCityName() {
		var city = input.value;
		city = city.charAt(0).toUpperCase() + city.substring(1, city.length).toLowerCase();
		var requestWeather = fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=b76db1f799bfd7055d8b133c6667219c`);
		requestWeather.then(objPromise => objPromise.json()).then(weatherData => {
				if (localStorage.getItem('cityList') === null) {
					var list = [];
					list.push(weatherData);
					localStorage.setItem('cityList', JSON.stringify(list));
				} else {
					var list = JSON.parse(localStorage.getItem('cityList'));
					list.push(weatherData);
					localStorage.setItem('cityList', JSON.stringify(list));
				}
				input.value = ''; // очищает поле ввода
				showLocalStor();
		}).catch(e => {
			var list = JSON.parse(localStorage.getItem('cityList'));
			list.pop();
			localStorage.setItem('cityList', JSON.stringify(list));
			input.setAttribute('placeholder', 'Not Found');
			});
	}

	function refreshPlaceholderbyinput() {
		input.setAttribute('placeholder', 'Enter the city...');
	}

	input.addEventListener('click', refreshPlaceholderbyinput);

	button.addEventListener('click', showWeatherByCityName);
	// input.addEventListener('change', showWeatherByCityName);


	function showLocalStor() {
		p.innerHTML = ' '; //очистить чтобы при отображении не дублировалась ранее выведенная инф.
		if (localStorage.getItem('cityList') !== null) {
			var list = JSON.parse(localStorage.getItem('cityList'));
			for(var i = 0; i < list.length; i++) {
				var weatherWidgetByCity = document.createElement('div');
				p.appendChild(weatherWidgetByCity);
				// weatherWidgetByCity.style.backgroundColor = '#5996cc';
				weatherWidgetByCity.style.borderRadius = '10px';
				weatherWidgetByCity.style.fontWeight = 'bold';
				weatherWidgetByCity.style.textAlign = 'center';
				weatherWidgetByCity.innerHTML = 
					`<span class="city">${list[i].name}</span></br>
					<span>temperature - ${Math.round(list[i].main.temp-273)}℃</span></br>
					<span>humidity - ${list[i].main.humidity}%</span></br>
					<span>wind - ${list[i].wind.speed}m/s</span></br>
					<span>${list[i].weather[0].description}</span></br>
					<img src="https://openweathermap.org/img/w/${list[i].weather[0].icon}.png" />`
			}
		}
	}

	showLocalStor();


	function deleteCity(e) {
		if (localStorage.getItem('cityList') !== null) {
			var list = JSON.parse(localStorage.getItem('cityList'));
			for(var i = 0; i < list.length; i++) {
				if (list[i].name === e.target.innerText) {
					list.splice([i],1);
					localStorage.setItem('cityList', JSON.stringify(list));
				}
			}
		}
			
		showLocalStor();
	}

	this.addEventListener('click',deleteCity);

});