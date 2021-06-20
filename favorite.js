const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'


const movies = []
const dataPanel = document.querySelector('#data-panel')


function raderMovieList(data) {
  let rawHTML = ''

  data.forEach((item) => {
    console.log(item.title)
    rawHTML += `<div class="col-sm-3">
            <div class="my-1">
                <div class="card">
                    <img src="${POSTER_URL + item.image}"
                        class="card-img-top" alt="movie template">
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
                            data-bs-target="#movie-modal" data-id="${item.id}">More</button>
                        <button class="btn btn-danger btn-remove" data-id="${item.id}">x</button>
                    </div>
                </div>
            </div>
        </div>`
  })

  dataPanel.innerHTML = rawHTML
}

function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image}"
                                alt="movie-poster" class="img-fluid">`
  })
}

function removeFromFavorite(id) {
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  movies.splice(movieIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  raderMovieList(movies)
}



dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    // console.log(event.target.dataset)
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
console.log(list)

movies.push(...list)
// console.log(movies)
raderMovieList(movies)