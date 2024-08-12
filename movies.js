document.addEventListener('DOMContentLoaded', function () {
  let currentlyOpenMovie = null;
  let hoverTimeout = null;

  const genreColors = {
    "Action": "red",
    "Adventure": "orange",
    "Comedy": "yellow",
    "Drama": "green",
    "Horror": "black",
    "Romance": "pink",
    "Sci-Fi": "purple",
    "Thriller": "blue"
    // Add more genres and colors as needed
  };

  // Hey Peter, the fetch call below might need to be changed to include the directory, I needed the directory on my home computer but not on my school computer
  fetch('/movies.json')
    .then(response => response.json())
    .then(movies => {
      const moviesContainer = document.querySelector('.movies-container');
      movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.className = 'movie';

        // Generate genre elements
        let genreElements = '';
        movie.genres.forEach(genre => {
          const color = genreColors[genre] || 'gray'; // Default to gray if genre is not in the mapping
          genreElements += `<span class="movie-genre" style="background-color: ${color};">${genre}</span>`;
        });

        // Extract YouTube video ID from the URL
        const youtubeVideoId = movie.trailer.split('v=')[1];

        movieElement.innerHTML = `
          <img class="movie-poster" src="${movie.poster}" alt="${movie.title}">
          <button class="play-button"></button>
          <div class="details">
            <iframe class="movie-trailer" width="100%" height="160px" src="https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1" frameborder="0" allowfullscreen></iframe>  
            <p class="movie-runtime">${movie.runtime} - ${movie.year}</p>  
            <p class="movie-description" data-full-text="${movie.description}">${truncateText(movie.description, 100)}</p>
            <div class="movie-genres">${genreElements}</div>
          </div>
        `;

        movieElement.addEventListener('mouseenter', () => {
          hoverTimeout = setTimeout(() => {
            if (currentlyOpenMovie && currentlyOpenMovie !== movieElement) {
              currentlyOpenMovie.classList.remove('show');
              currentlyOpenMovie.querySelector('.movie-poster').style.opacity = '1';
            }
            movieElement.classList.add('show');
            movieElement.querySelector('.movie-poster').style.opacity = '0';
            currentlyOpenMovie = movieElement;
          }, 500); // Adjust delay to match the desired hover effect timing
        });

        movieElement.addEventListener('mouseleave', () => {
          clearTimeout(hoverTimeout);
          if (currentlyOpenMovie === movieElement) {
            movieElement.classList.remove('show');
            movieElement.querySelector('.movie-poster').style.opacity = '1';
            currentlyOpenMovie = null;
          }
        });

        moviesContainer.appendChild(movieElement);
      });
    })
    .catch(error => console.error('Error fetching movies:', error));
});

function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
}
