const env = {
    MAP_ACCESS_TOKEN: 'pk.eyJ1IjoibWFyenVrLXphcmlyIiwiYSI6ImNrcHdsOGF2ajF3dDAycW11ZnplM2lnNXUifQ.EAiefoOGliuh1q0I1kAjaw', /* your access token from https://mapbox.com */
    CITY_ACCESS_TOKEN: '2af02de7afba3096c217e360c9d3610f', /* your access token from https://openweathermap.org */
};

const CITY_URL = 'https://api.openweathermap.org/geo/1.0/direct';
const searchForm = document.querySelector('#search-form');
const cityInput = searchForm.querySelector('[type="text"]');

window.addEventListener('DOMContentLoaded', init);

// Main function
function init() {
    // ask for user's current location
    navigator.geolocation.getCurrentPosition(locationAllow, locationDeny, {
        enableHighAccuracy: true,
    });

    // Search by city
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let input = cityInput.value.trim().toLowerCase();
        if (input.length === 0) {
            alert('Please enter your city');
            cityInput.value = '';
            return;
        }

        try {
            const response = await fetch(
                `${CITY_URL}?q=${input}&appid=${env.CITY_ACCESS_TOKEN}`
            );
            const data = await response.json();

            if (data.length == 0 || data.cod == 404) {
                alert('City not found');
                cityInput.classList.add('is-invalid');
            } else {
                mapBox(data[0].lat, data[0].lon);
                cityInput.classList.remove('is-invalid');
            }
        } catch (e) {
            cityInput.classList.add('is-invalid');
            alert(e.message);
        } finally {
            cityInput.value = '';
        }
    });
}

// If user allow location
function locationAllow(position) {
    mapBox(position.coords.latitude, position.coords.longitude);
}

// If user block location
function locationDeny() {
    mapBox(39.9042, 116.4074);
}

// map box api call
function mapBox(lat, long) {
    mapboxgl.accessToken = env.MAP_ACCESS_TOKEN;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [long, lat],
        zoom: 10,
    });
    map.addControl(new mapboxgl.NavigationControl());
}
