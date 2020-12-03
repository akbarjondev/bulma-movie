// variables
var elForm = document.querySelector('.form');
var elHiddenInput = document.querySelector('.hidden-input', elForm);
var elSearchInput = document.querySelector('.input', elForm);

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

	elMovies.appendChild(movieFragmentBox);
};

elForm.addEventListener('submit', (evt) => {
	evt.preventDefault();

	var searchQuery = elSearchInput.value.trim();
	var MAIN_URL = `http://www.omdbapi.com/?apikey=${API_KEY}&s=${searchQuery}`;
	
	fetch(MAIN_URL).then((response) => {
		return response.json();
	}).then((data) => {
		var moviesArray = data.Search;

		renderMovies(moviesArray);
	});
});