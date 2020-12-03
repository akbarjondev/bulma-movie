// API KEY
var API_KEY = '2ae0cd9a';

// variables
var elForm = document.querySelector('.form');
var elSubmitButton = elForm.querySelector('.button');
var elHiddenInput = elForm.querySelector('.hidden-input');
var elSearchInput = elForm.querySelector('.input');

// movies <ul>
var elMovies = document.querySelector('.movies');
var elInfoBody = document.querySelector('.info-body');

// pagination
var elPagination = document.querySelector('.pagination-list');

// template
var movieTemplate = document.querySelector('#movie-info-template').content;
var movieInfoBodyTemplate = document.querySelector('#movie-info-body-template').content;
var paginationTemplate = document.querySelector('#pagination-item').content;

// === FUNCTIONS === //

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

//paginate
var paginate = function(results, isCurrent = 1) {
	document.querySelector('.number-of-movies').textContent = `{${results}}`

	var movieFragmentBox = document.createDocumentFragment();
	var numberOfPages = Math.ceil(results / 10);

	for(var i = 1; i <= numberOfPages; i++) {
		var newPaginationEl = paginationTemplate.cloneNode(true);
		if(i === isCurrent) {
			newPaginationEl.querySelector('.pagination-link').classList.add('is-current');	
		}

		newPaginationEl.querySelector('.pagination-link').dataset.pageId = i;	
		newPaginationEl.querySelector('.pagination-link').textContent = i;

		movieFragmentBox.appendChild(newPaginationEl);	
	}

	elPagination.innerHTML = '';
	elPagination.appendChild(movieFragmentBox);
};

// listen to form
elForm.addEventListener('submit', (evt) => {
	evt.preventDefault();
	elSubmitButton.classList.add('is-loading');

	var searchQuery = elSearchInput.value.trim();
	
	if(!Boolean(searchQuery)) {
		alert('Type in!');
	}

	var MAIN_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchQuery}`;
	
	fetch(MAIN_URL).then((response) => {
		return response.json();
	}).then((data) => {
		paginate(Number(data.totalResults, 1));
		renderMovies(data.Search);
		
		elSubmitButton.classList.remove('is-loading');
	});

});

// render movie info
var renderInfo = function(data) {
	var movieFragmentBox = document.createDocumentFragment();

	var newInfoBody = movieInfoBodyTemplate.cloneNode(true);

	newInfoBody.querySelector('.movie-img').src = data.Poster;	
	newInfoBody.querySelector('.movie-img').title = data.Title;	
	newInfoBody.querySelector('.movie-img').alt = data.Title;	
	newInfoBody.querySelector('.movie-title').textContent = data.Title;
	newInfoBody.querySelector('.movie-year').textContent = data.Year;
	newInfoBody.querySelector('.movie-genre').textContent = data.Genre;
	newInfoBody.querySelector('.movie-rating').textContent = data.imdbRating;
	newInfoBody.querySelector('.movie-plot').textContent = data.Plot;

	movieFragmentBox.appendChild(newInfoBody);

	elInfoBody.innerHTML = '';
	elInfoBody.appendChild(movieFragmentBox);
};

// event delegation
elMovies.addEventListener('click', (evt) => {
	if(evt.target.matches('.movie__button')) {
		var movieID = evt.target.closest('.movie').dataset.id;
		var MAIN_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movieID}&plot=full`;
		
		evt.target.classList.add('is-loading');

		fetch(MAIN_URL).then((response) => {
			return response.json();
		}).then((data) => {
			evt.target.classList.remove('is-loading');
			renderInfo(data);
		});
	}
});

// pagination wrapper event delegation
elPagination.addEventListener('click', (evt) => {
	var pageId = Number(evt.target.dataset.pageId);
	
	var searchQuery = elSearchInput.value.trim();
	var MAIN_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchQuery}&page=${pageId}`;
	
	fetch(MAIN_URL).then((response) => {
		return response.json();
	}).then((data) => {
		paginate(Number(data.totalResults), pageId);
		renderMovies(data.Search);
	});
});
