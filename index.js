const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const MOVIES_PER_PAGE = 12

const movies = []
let fileteredMovies = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#pagination')
const changebar = document.querySelector('.changebar')

let mode = 'cardmode'

let nowPage = 1


function renderMovieCardMode(data) {
  let rawHTML = ''

  data.forEach((item) => {
    rawHTML += `
    <div class="col-sm-3 my-1 d-flex align-items-stretch">
                <div class="card">
                    <img src="${POSTER_URL + item.image}"
                        class="card-img-top" alt="movie template">
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
                            data-bs-target="#movie-modal" data-id="${item.id}">More</button>
                        <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
                    </div>
                </div>
        </div>`
  })

  dataPanel.innerHTML = rawHTML
  mode = 'cardmode'
}

function renderMovieListMode(data) {
  let rawHTML = ''

  data.forEach((item) => {
    rawHTML += `
            <ul class="list-group">
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${item.title}
                <div><button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal"
                        data-id="${item.id}">More</button>
                    <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
                </div>
            </li>
        </ul>`
  })

  dataPanel.innerHTML = rawHTML
  mode = 'listmode'
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

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }
  list.push(movie)
  console.log(list)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
  // console.log(id)
}

function getMoviesByPage(page) {

  const data = fileteredMovies.length ? fileteredMovies : movies


  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)

  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" data-page="${page}" href="#">${page}</a></li>`
  }
  console.log(rawHTML)
  paginator.innerHTML = rawHTML
}

searchInput.addEventListener('blur', e => {
  console.log(searchInput.value.length)
  if (searchInput.value.length === 0) {
    fileteredMovies = []
    nowPage = sessionStorage.getItem('nowPage')
    if (mode === 'cardmode') {
      renderMovieCardMode(getMoviesByPage(nowPage))
    } else {
      renderMovieListMode(getMoviesByPage(nowPage))
    }
    renderPaginator(movies.length)
  }
})


searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {

  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  console.log(keyword)
  if (!keyword.length) {
    return alert('請輸入有效字串！')
  }
  // 【作法一】用迴圈迭代：for-of
  // for (movie of movies) {
  //   if (movie.title.toLowerCase().includes(keyword)) {
  //     fileteredMovies.push(movie)
  //     console.log(fileteredMovies)
  //   }
  // }

  //【作法二】用條件來迭代：filter
  fileteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )

  if (fileteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword}沒有符合條件的電影`)
  }
  if (mode === 'cardmode') {
    renderMovieCardMode(getMoviesByPage(1))
  } else {
    renderMovieListMode(getMoviesByPage(1))
  }

  renderPaginator(fileteredMovies.length)
  sessionStorage.setItem('filterNowPage', 1)
})

TODO:
changebar.addEventListener('click', function listcardChange(event) {
  if (fileteredMovies.length) {
    nowPage = sessionStorage.getItem('filterNowPage')
  }
  if (event.target.matches('.card-button')) {
    renderMovieCardMode(getMoviesByPage(nowPage))
  } else if (event.target.matches('.list-button')) {
    renderMovieListMode(getMoviesByPage(nowPage))
  }
})

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    // console.log(event.target.dataset)
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

paginator.addEventListener('click', function inPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  if (fileteredMovies.length) {
    sessionStorage.setItem('filterNowPage', JSON.stringify(page))
    nowPage = sessionStorage.getItem('filterNowPage')
  } else {
    sessionStorage.setItem('nowPage', JSON.stringify(page))
    nowPage = sessionStorage.getItem('nowPage')
  }

  if (mode === 'cardmode') {
    renderMovieCardMode(getMoviesByPage(nowPage))
  } else {
    renderMovieListMode(getMoviesByPage(nowPage))
  }
})

axios.get(INDEX_URL).then((response) => {
  movies.push(...response.data.results)
  // console.log(movies)
  renderPaginator(movies.length)
  renderMovieCardMode(getMoviesByPage(nowPage))
})
  .catch((err) => console.log(err))

console.log(nowPage)
