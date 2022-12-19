'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
let map, mapEvent;
if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
	function(position){
	    const {latitude} = position.coords;
	    const {longitude} = position.coords;
	    const coords = [latitude, longitude];
	    console.log(`https://www.google.pt/maps/@${latitude},${longitude}`);

	    map = L.map('map').setView([latitude, longitude], 16);
	    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
			{
			    attribution:
			    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenSteetMap</a> contributors',
			}).addTo(map);
	    map.on('click', function(mapE){
		mapEvent = mapE;
		form.classList.remove('hidden');
		inputDistance.focus();
	    });
	    ;	},
	function(){
	    console.log(`Couldnt get coords`);
	}
    );
}

form.addEventListener('submit', function(e){
    e.preventDefault();

    //clear input fields
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = "";

    
    console.log(mapEvent);
    const {lat, lng} = mapEvent.latlng;
    L.marker([lat, lng]).addTo(map).bindPopup(L.popup({
	maxWidth : 250,
	minWidth: 150,
	autoClose: false,
	closeOnEscapeKey: true,
	closeOnClick: false,
	className: 'running-popup',
    }))
	.setPopupContent(`wokrout`)
	.openPopup();
    
});

inputType.addEventListener('change', function(e){
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
})
