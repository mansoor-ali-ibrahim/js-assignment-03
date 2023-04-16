// IIFE Immediately invoked function Expressions
(async function () {
const response = await fetch("./data.json");
const moviesData = await response.json();

//Get genres values and pass them to createOptionElement for showing at the frontend
const genres = [...new Set(moviesData.flatMap(movie => movie.genres))].sort();
genres.forEach(elements => {createOptionElement("genres-select", elements)});

//Get Release Date values and pass them to createOptionElement for showing at the frontend
const mapDate = moviesData.flatMap(movie => movie.release_date)
const years = [...new Set(mapDate.flatMap(dateString => new Date(dateString).getFullYear()))].sort();
years.forEach(elements => {createOptionElement("year-select", elements)});

//Get language values and pass them to createOptionElement for showing at the frontend
const language = [...new Set(moviesData.flatMap(movie => movie.original_language))].sort();
language.forEach(elements => {createOptionElement("language-select", elements)});

//Get certifications values and pass them to createOptionElement for showing at the frontend
const rating = [...new Set(moviesData.flatMap(movie => movie.certification))].sort();
rating.forEach(elements => {createOptionElement("rating-select", elements)});

//Function to take select if and value and create options element within the provided ID
function createOptionElement(id, value) {
        const optionElement = document.createElement("option");
        optionElement.value = value;
        optionElement.text = value;
        document.getElementById(id).appendChild(optionElement);
}

function searchMovies(selectedGenres, selectedYear, selectedLanguage, rating, moviesData ) {
        // Load JSON data into object
        let movies = moviesData;
        const moviesList = movies.filter(u => {
                const hasSelectedGenre = selectedGenres === "ALL" || Array.isArray(u.genres) && u.genres.includes(selectedGenres);
                const hasSelectedYear = selectedYear === "ALL" || u.release_date.substr(0, 4) === selectedYear.toString();
                const hasSelectedLanguage = selectedLanguage === "ALL" || u.original_language === selectedLanguage;
                const hasSelectedRating = rating === "ALL" || u.certification === rating;
                
                if (hasSelectedGenre && hasSelectedYear && hasSelectedLanguage && hasSelectedRating) {
                        return true;
                } else {
                        return false;
                }
        });
        
        document.querySelector(".search-results-heading").innerHTML = `
                Total Number of Movies: <strong>${moviesList.length}</strong>
        `;

        let movieHTML = moviesList.map((movie, index) => {
                Array.isArray(movie.genres) ? splittedGenres = movie.genres.sort().join(", ") : splittedGenres = movie.genres;
                //const splittedGenres = movie.genres.map(str => str.replace(/,/g, ', '));
                return `
                        <div class="movie">
                        <div class="movie-number">${index + 1}</div>
                        <div class="movie-info">
                        <div class="movie-image">
                        <img src="https://image.tmdb.org/t/p/w185${movie.poster_path}" alt="${movie.title}">
                        </div>
                        <div class="movie-details">
                        <div class="movie-title">${movie.title}</div>
                        <div class="movie-certification"><strong>${movie.certification}</strong></div>
                        <div class="movie-genres">${splittedGenres}</div>
                        </div>
                        </div>
                        <div class="movie-year">${movie.release_date.substr(0, 4)}</div>
                        </div>
                `;
                }).join('');
        
        // Add HTML to the page
        document.querySelector('#movie-list').innerHTML = movieHTML;

}  


document.querySelector('#searchBtn').addEventListener('click', () => {
        const selectedGenres = document.getElementById("genres-select").value;
        const selectedYear = document.getElementById("year-select").value;
        const selectedLanguage = document.getElementById("language-select").value;
        const rating = document.getElementById("rating-select").value;

        searchMovies(selectedGenres, selectedYear, selectedLanguage, rating, moviesData);      
});                     

})();