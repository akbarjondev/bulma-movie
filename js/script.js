// variables
var elForm = document.querySelector('.form');
var elSubmitButton = elForm.querySelector('.button');
var elHiddenInput = elForm.querySelector('.hidden-input');
var elSearchInput = elForm.querySelector('.input');

// movies <ul>
var elMovies = document.querySelector('.movies');

// template
var movieTemplate = document.querySelector('#movie-info-template').content;

// API KEY
var API_KEY = '2ae0cd9a';

// render movies to HTML
var renderMovies = function(array) {
	var movieFragmentBox = document.createDocumentFragment();


	array.forEach((movie) => {
		var newMovieEl = movieTemplate.cloneNode(true);

		newMovieEl.querySelector('.movie').title = movie.Title;
		newMovieEl.querySelector('.movie').dataset.id = movie.imdbID;
		newMovieEl.querySelector('.movie__name').textContent = movie.Title;

		movieFragmentBox.appendChild(newMovieEl);
	});

	elMovies.innerHTML = '';
	elMovies.appendChild(movieFragmentBox);
};

// listen to form
elForm.addEventListener('submit', (evt) => {
	evt.preventDefault();
	elSubmitButton.classList.add('is-loading');

	var searchQuery = elSearchInput.value.trim();
	var MAIN_URL = `http://www.omdbapi.com/?apikey=${API_KEY}&s=${searchQuery}`;
	
	fetch(MAIN_URL).then((response) => {
		return response.json();
	}).then((data) => {
		console.log(data.Search);
		renderMovies(data.Search);
		
		elSubmitButton.classList.remove('is-loading');
	});
});

// event delegation
elMovies.addEventListener('click', (evt) => {
	if(evt.target.matches('.movie__button')) {
		var movieID = evt.target.closest('.movie').dataset.id;
		var MAIN_URL = `http://www.omdbapi.com/?apikey=${API_KEY}&i=${movieID}`;
		
		evt.target.classList.add('is-loading');

		fetch(MAIN_URL).then((response) => {
			return response.json();
		}).then((data) => {
			evt.target.classList.remove('is-loading');
			console.log(data);
		});
	}
});