// Global Constant
const TEXT_CENTER = 'text-center';

// Selectors
const container = document.querySelector('.container');
const result = container.querySelector('#resultado');
const form = document.querySelector('#formulario');

/**
 * Event listener for form submission. Calls the searchWeather function when the form is submitted.
 *
 * @returns {void}
 */
window.addEventListener('load', () => {
  form.addEventListener('submit', searchWeather);
});

/**
* Handles the form submission event by preventing the default action and calling the searchWeather function.
*
* @param {Event} e - The event object representing the form submission.
* @returns {void}
 */
function searchWeather(e) {
  e.preventDefault();

  const city = document.querySelector('#ciudad').value;
  const country = document.querySelector('#country').value;

  if (country === '' || city === '') {
    insertAlert('Por favor, introduce una ciudad y el país.');
    return;
  }

  // Fetch weather data from API
  apiQuery(city, country);
}

/**
* Displays an alert message with a specified duration.
*
* @param {string} message - The message to be displayed in the alert.
* @returns {void}
 */
function insertAlert(message) {
  const TIME_DURATION = 3000;

  // Remove any previous alerts
  const previousAlerts = document.querySelectorAll('.alert');
  previousAlerts.forEach(alert => alert.remove());

  // Create new alert element and append it to the container
  const alertDiv = document.createElement('DIV');

  alertDiv.classList.add(
    'alert', 'bg-red-100', 'border-red-400', 'text-red-700', 'mx-auto',
    'px-4', 'py-3', 'rounded', 'max-w-md', 'mt-6', TEXT_CENTER
  );
  alertDiv.innerHTML = `
    <strong class="font-bold">¡Error!</strong>
    <span class="block">${message}</span>
  `;

  container.appendChild(alertDiv);

  // Clear alert after 3 seconds
  setTimeout(() => {
    alertDiv.remove();
  }, TIME_DURATION);
}

/**
* Fetches weather data from the OpenWeatherMap API for a given city and country.
*
* @param {string} city - The name of the city to fetch weather data for.
* @param {string} country - The country code of the city to fetch weather data for.
* @returns {void}
 */
function apiQuery(city, country) {
  const STATUS_CODE_OK = 200;
  const API_KEY = 'c41881b47b09323f744221f1a8d6c3b1';
  const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}&units=metric`;

  loadSpinner();

  fetch(API_URL)
   .then(response => response.json())
    .then(data => {
      // Clear previous results
      clearHTML();

      if (data.cod === STATUS_CODE_OK) {
        displayWeatherData(data);
      } else {
        insertAlert('No se ha encontrado la ciudad o el país.');
      }
    })
   .catch(error => {
      insertAlert('Error de conexión. Vuelve a intentarlo' + error);
    });
}

/**
* Displays weather data in the HTML result section.
*
* @param {Object} data - The weather data object received from the API.
* @param {string} data.name - The name of the city.
* @param {Object} data.main - The main weather data.
* @param {number} data.main.temp - The current temperature in Celsius.
* @param {number} data.main.temp_min - The minimum temperature in Celsius.
* @param {number} data.main.temp_max - The maximum temperature in Celsius.
* @param {number} data.main.feels_like - The temperature felt by humans in Celsius.
* @param {number} data.main.humidity - The humidity percentage.
* @param {number} data.main.pressure - The atmospheric pressure in kilopascals.
* @returns {void}
 */
function displayWeatherData(data) {
  const {
    name, main: { temp, temp_min, temp_max, feels_like, humidity, pressure }
  } = data;

  const nameCity = document.createElement('P');
  nameCity.classList.add('text-2xl', 'font-bold');
  nameCity.textContent = `Clima en ${name}`;

  const nowTemp = document.createElement('P');
  nowTemp.classList.add('text-6xl', 'font-bold', 'mt-4', TEXT_CENTER);
  nowTemp.textContent = `${temp}°C`;

  const minTemp = document.createElement('P');
  minTemp.classList.add('text-xl');
  minTemp.textContent = `Mín: ${temp_min}°C`;

  const maxTemp = document.createElement('P');
  maxTemp.classList.add('text-xl');
  maxTemp.textContent = `Máx: ${temp_max}°C`;

  const likeTemp = document.createElement('P');
  likeTemp.classList.add('text-xl');
  likeTemp.textContent = `Sensación térmica: ${feels_like}°C`;

  const humidityTemp = document.createElement('P');
  humidityTemp.classList.add('text-xl');
  humidityTemp.textContent = `Humedad: ${humidity}%`;

  const pressureTemp = document.createElement('P');
  pressureTemp.classList.add('text-xl');
  pressureTemp.textContent = `Presión: ${pressure} kPa`;

  const resultDiv = document.createElement('DIV');
  resultDiv.classList.add('result', 'text-white', TEXT_CENTER);
  resultDiv.appendChild(nameCity);
  resultDiv.appendChild(nowTemp);
  resultDiv.appendChild(minTemp);
  resultDiv.appendChild(maxTemp);
  resultDiv.appendChild(likeTemp);
  resultDiv.appendChild(humidityTemp);
  resultDiv.appendChild(pressureTemp);

  result.appendChild(resultDiv);
}

/**
* Displays a loading spinner in the HTML result section.
This function is called when fetching weather data from the API.
*
* It clears any previous content in the result section and creates a new loading spinner.
* @returns {void}
 */
function loadSpinner() {
  clearHTML();

  const divSpinner = document.createElement('DIV');
  divSpinner.classList.add('sk-fading-circle');
  divSpinner.innerHTML = `
    <div class="sk-circle1 sk-circle"></div>
    <div class="sk-circle2 sk-circle"></div>
    <div class="sk-circle3 sk-circle"></div>
    <div class="sk-circle4 sk-circle"></div>
    <div class="sk-circle5 sk-circle"></div>
    <div class="sk-circle6 sk-circle"></div>
    <div class="sk-circle7 sk-circle"></div>
    <div class="sk-circle8 sk-circle"></div>
    <div class="sk-circle9 sk-circle"></div>
    <div class="sk-circle10 sk-circle"></div>
    <div class="sk-circle11 sk-circle"></div>
    <div class="sk-circle12 sk-circle"></div>
  `;

  result.appendChild(divSpinner);
}

/**
* Clears the HTML content of the result section.
*
* This function is used to remove any previous weather data or loading spinners from the result section.
*
* @returns {void}
* @example
* clearHTML();
 */
function clearHTML() {
  while (result.firstChild) {
    result.removeChild(result.firstChild);
  }
}
