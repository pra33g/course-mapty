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

//implement app class
class App{
    #map;
    #mapEvent;
    
    constructor(){
	this._getPosition();
	// console.log(this)
	
	form.addEventListener('submit', function(e){
	    e.preventDefault();
	    console.log(mapEvent.latlng);
	    //clear input fields
	    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';

	    
	    let {lat, lng} = mapEvent.latlng;
	    L.marker([lat, lng]).addTo(map).bindPopup(L.popup({
		maxWidth: 250,
		content: "Running",
		minWidth: 100,
		closeButton: false,
		autoClose: false,
		closeOnClick: false,
		className: 'running-popup',
	    })).openPopup();
	    
	});

	inputType.addEventListener('change', function(e){
	    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
	    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
	});



    }
    _getPosition(){
	if(navigator.geolocation){
	    navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function(){	    
		alert("error getting coordinates");
	    });	    
	}
    }
    _loadMap(position){
	console.log(this)
	const {latitude} = position.coords;
	const {longitude} = position.coords;
	//    console.log(`https://maps.google.com/maps/@${x},${y}`);
	let coords = [latitude, longitude];
	this.#map = L.map('map').setView(coords , 8);
	
	L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(this.#map);

	// L.marker(coords).addTo(map)
	//     .bindPopup('You are here')
	//     .openPopup();
	this.#map.on('click', function(mapE){
	    this.#mapEvent = mapE;
	    form.classList.remove('hidden');
	    inputDistance.focus();
	});

    }
    _showForm(){}
    _toggleElevationField(){}
    _newWorkout(){ }
}
const app = new App();
