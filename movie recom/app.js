// Replace with your TMDB API key
const API_KEY = "17d39320a40e38525d141a1c7d4afb72";
const BASE_URL = "https://api.themoviedb.org/3";

const questions = [
  {
    text: "What genre do you prefer?",
    options: [
      { label: "Action", value: 28 },
      { label: "Comedy", value: 35 },
      { label: "Sci-Fi", value: 878 },
      { label: "Drama", value: 18 },
    ],
    key: "genre",
  },
  {
    text: "What type of movies do you like?",
    options: [
      { label: "Popular", value: "popularity.desc" },
      { label: "Highly Rated", value: "vote_average.desc" },
    ],
    key: "sort_by",
  },
  {
    text: "Do you prefer newer or older movies?",
    options: [
      { label: "Modern (2000+)", value: "2000-01-01" },
      { label: "Classic (Before 2000)", value: "1999-12-31" },
    ],
    key: "release_date",
  },
];

let currentQuestionIndex = 0;
let userAnswers = {};

function displayQuestion() {
  const quizContainer = document.getElementById("quizContainer");
  const question = questions[currentQuestionIndex];

  quizContainer.innerHTML = `
    <h2>${question.text}</h2>
    <div class="quiz-options">
      ${question.options
        .map(
          (option) => `
            <label>
              <input type="radio" name="answer" value="${option.value}" />
              ${option.label}
            </label>
          `
        )
        .join("")}
    </div>
    <button id="nextButton">Next</button>
  `;

  document.getElementById("nextButton").addEventListener("click", () => {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (!selectedOption) {
      alert("Please select an option!");
      return;
    }

    userAnswers[questions[currentQuestionIndex].key] = selectedOption.value;
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
      displayQuestion();
    } else {
      fetchMovies();
    }
  });
}

async function fetchMovies() {
  const { genre, sort_by, release_date } = userAnswers;
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genre}&sort_by=${sort_by}&primary_release_date.gte=${release_date}`;

  const resultsContainer = document.getElementById("resultsContainer");
  const moviesContainer = document.getElementById("moviesContainer");
  const quizContainer = document.getElementById("quizContainer");

  quizContainer.style.display = "none";
  resultsContainer.style.display = "block";

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.results.length > 0) {
      const movieDetails = await Promise.all(
        data.results.slice(0, 10).map(async (movie) => {
          const detailsResponse = await fetch(`${BASE_URL}/movie/${movie.id}?api_key=${API_KEY}`);
          const detailsData = await detailsResponse.json();
          return {
            title: movie.title,
            poster: `https://image.tmdb.org/t/p/w200${movie.poster_path}`,
            rating: movie.vote_average,
            imdb_id: detailsData.imdb_id,
          };
        })
      );

      moviesContainer.innerHTML = movieDetails
        .map(
          (movie) => `
            <div class="movie-card" data-imdb-id="${movie.imdb_id}">
              <img src="${movie.poster}" alt="${movie.title}" />
              <h3>${movie.title}</h3>
              <p>Rating: ${movie.rating}</p>
            </div>
          `
        )
        .join("");

      document.querySelectorAll(".movie-card").forEach((card) => {
        card.addEventListener("click", () => {
          const imdbId = card.getAttribute("data-imdb-id");
          window.open(`https://www.imdb.com/title/${imdbId}/`, "_blank");
        });
      });
    } else {
      moviesContainer.innerHTML = "<p>No movies found. Please try different answers.</p>";
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    moviesContainer.innerHTML = "<p>Could not fetch movies. Try again later.</p>";
  }

  document.getElementById("restartQuiz").addEventListener("click", () => {
    currentQuestionIndex = 0;
    userAnswers = {};
    resultsContainer.style.display = "none";
    quizContainer.style.display = "block";
    displayQuestion();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  displayQuestion();
});
