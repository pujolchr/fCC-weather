/*
 *          name: getweather.js
 *
 *        Author: Christian Pujol, pujolchr@gmail.com
 *   description:
 *   get weather information
 ://httpd.apache.org/docs/2.4/howto/reverse_proxy.html/
 *
 */

const api = 'https://naga.no/data/2.5/weather?';
const apiKey = '&APPID=87ab6be1ff3b6a47311724895d1086b4';

const weatherImg = {
  '01d': 'clear-sky-day.jpg',
  '01n': 'clear-sky-night.jpg',
  '02d': 'few-cloud-day.jpg',
  '02n': 'few-cloud-night.jpg',
  '03d': 'scattered-clouds-day.jpg',
  '03n': 'scattered-clouds-night.jpg',
  '04d': 'broken-cloud-day.jpg',
  '04n': 'broken-cloud-night.jpg',
  '09d': 'rain-day.jpg',
  '09n': 'rain-night.jpg',
  '10d': 'rain-day.jpg',
  '10n': 'rain-night.jpg',
  '11d': 'thunderstorm-day.jpg',
  '11n': 'thunderstorm-night.jpg',
  '13d': 'snow-day.jpg',
  '13n': 'snow-night.jpg',
  '50d': 'mist-day.jpg',
  '50n': 'mist-nigth.jpg',
};

function getweather(url) {
  $.getJSON(url, (json) => {
    $('#place').html(`${json.name}<img src="https://openweathermap.org/img/w/${json.weather[0].icon}.png">`);
    $('#place-latitude').text(json.coord.lat);
    $('#place-longitude').text(json.coord.lon);

    const temp = (json.main.temp - 273.15).toFixed(2);
    $('#temperature').text(temp);

    $('#weather-description').text(json.weather[0].description);

        // set background image
    $('#image').html(`<img class="img-responsive rounded" src="img/${weatherImg[json.weather[0].icon]}" alt="${weatherImg[json.weather[0].icon]}">`);
  });
}
function geoSucces(pos) {
  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;
  const url = `${api}lat=${lat}&lon=${lon}${apiKey}`;
  getweather(url);
}


function geoError() {
  $.getJSON('https://ipinfo.io/json', (json) => {
    const pos = {};
    pos.coords = {};
    const coords = json.loc.split(',');
    pos.coords.latitude = coords[0];
    pos.coords.longitude = coords[1];
    geoSucces(pos);
  });
}

$(document).ready(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(geoSucces, geoError);
  } else {
    geoError();
  }

    /* Toggle Celsius to Fahrenheit */
  $('#convertCF').on('click', () => {
    let temperature = $('#temperature').text();
    if ($(this).hasClass('celsius')) {
      $(this).removeClass('celsius');
      $(this).addClass('fahrenheit');
      $(this).text('Want some Celsius?');
      $('#temp-unit').text('°F');
      temperature = ((temperature * (9 / 5)) + 32).toFixed(1);
    } else if ($(this).hasClass('fahrenheit')) {
      $(this).removeClass('fahrenheit');
      $(this).addClass('celsius');
      $(this).text('Want some Fahrenheit?');
      $('#temp-unit').text('°C');
      temperature = ((temperature - 32) * (5 / 9)).toFixed(1);
    }

    $('#temperature').text(temperature);
  });
});

