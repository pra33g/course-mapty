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
/////
class Workout{
    date = new Date();
    id = (Date.now() + '').slice(-10);
    
    constructor(coords, distance, duration){
	this.coords = coords;
	this.distance = distance;
	this.duration = duration;
    }
};

class Running extends Workout{
    name='running';
    constructor(coords, distance, duration, cadence){
	super(coords, distance, duration);
	this.cadence = cadence;
	this.calcPace();
    }
    calcPace(){
	this.pace = this.duration / this.distance;
	return this.pace;
    }
};
class Cycling extends Workout{
    name = 'cycling';
    constructor(coords, distance, duration, elev){
    	super(coords, distance, duration);
	this.elevation = elev;
	this.calcSpeed();
    }
    calcSpeed(){
	this.speed = this.distance / (this.duration / 60);
	return this.speed;
    }
};

//////////
class App{
    #map;
    #mapEvent;
    constructor(){
	this.workouts = [];
	this._getPosition();
	form.addEventListener('submit', this._newWorkout.bind(this));

	inputType.addEventListener('change', this._toggleElevationField);

    }
    _getPosition(){
	if (navigator.geolocation){
	    navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function(){
		    console.log(`Couldnt get coords`);
		}
	    );
	}

    }
    _loadMap(position){

	const {latitude} = position.coords;
	const {longitude} = position.coords;
	const coords = [latitude, longitude];
	console.log(`https://www.google.pt/maps/@${latitude},${longitude}`);
	this.#map = L.map('map').setView([latitude, longitude], 16);
	L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
		    {
			attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenSteetMap</a> contributors',
		    }).addTo(this.#map);
	
	this.#map.on('click', this._showForm.bind(this));
    }
    _showForm(mapE){
	this.#mapEvent = mapE;
	form.classList.remove('hidden');
	inputDistance.focus();
    }
    _toggleElevationField(){
	inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
	inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }
    _newWorkout(e){
	
	const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp));
	const allPositive = (...inputs) => inputs.every(inp => inp > 0);

	e.preventDefault();
	
	//get data from form
	const type = inputType.value;
	const distance = +inputDistance.value;
	const duration = +inputDuration.value;
	const {lat, lng} = this.#mapEvent.latlng;
	//check validity

	//if workout running
	let workout;
	if (type === 'running'){

	    const cadence = +inputCadence.value;
	    if(!validInputs(distance, duration , cadence) || !allPositive(distance, duration, cadence)){
		return alert("Wrong input!");	
	    }
	    
	    workout = new Running( [lat, lng], distance, duration, cadence);
	    this.workouts.push(workout);
	}
	//if cycling
	else {
	    const elevation = +inputElevation.value;
	    
	    if(!validInputs(distance, duration , elevation) || !allPositive(distance, duration)){
		return alert("Wrong input!");	
	    }
	    workout = new Cycling( [lat, lng], distance, duration, elevation);
	    this.workouts.push(workout);
	}
	console.log(this.workouts);
	//add new workout obj to arr
	this._hideForm();
	//render workout on list
	this._renderWorkout(workout);
	
	//hide form and clear input fields


	//render workoutmarker on map
	L.marker([lat, lng])
	    .addTo(this.#map)
	    .bindPopup(L.popup({
	    maxWidth : 250,
	    minWidth: 150,
	    autoClose: false,
	    closeOnEscapeKey: true,
	    closeOnClick: false,
	    className: `${type}-popup`,
	}))
	    .setPopupContent(`${workout.name + " on " + workout.date.getDate() + " " + months[workout.date.getMonth()]}`)
	    .openPopup();
	
    }
    _hideForm(){
	inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = "";
	form.classList.add('hidden');
    }
    _renderWorkout(workout){
	
	let html = `
<li class="workout workout--{workout.name}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.name + " on " + workout.date.getDate() + " " + months[workout.date.getMonth()]}</h2>
          <div class="workout__details">
            <span class="workout__icon">${workout.name === 'running' ? "🏃":"🚴"  } </span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>

`;
	if(workout.name === 'running'){
	    html+=`          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>`;
	    
	}
	else {
	    html +=`          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevation}</span>
            <span class="workout__unit">m</span>
          </div>
        </li> `;
	}
	form.insertAdjacentHTML('afterend', html);
    }
};

////
const app = new App();
////
