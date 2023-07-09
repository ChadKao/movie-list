const Base_URL = 'https://webdev.alphacamp.io'
const index_URL = Base_URL + '/api/movies/'
const poster_URL = Base_URL + '/posters/'
const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const movies_per_page = 12;
let currentPage = 1
const paginator = document.querySelector("#paginator");


renderMovieList(getFavoriteMoviesByPage(1))
renderPaginator(movies.length)



function renderMovieList(data) {
  let rawHTML = ''

  data.forEach(item => {
    rawHTML += `<div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src= "${poster_URL + item.image}"
              class="card-img-top" alt="movie poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
              <div class="card-footer">
                <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
                  data-bs-target="#movie-modal" data-id = "${item.id}">More</button>
                <button class="btn btn-danger btn-remove-favorite" data-id = "${item.id}">X</button>

              </div>
            </div>
          </div>

        </div>
      </div>`
  });


  dataPanel.innerHTML = rawHTML
}



function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image img')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(index_URL + id).then(response => {
    const data = response.data.results
    modalTitle.innerHTML = data.title
    modalImage.src = `${poster_URL + data.image}`
    modalDate.innerHTML = 'release date : ' + data.release_date
    modalDescription.innerHTML = data.description
  })
    .catch((err) => console.log(err))
}


dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(event.target.dataset.id)
    console.log(event.target.dataset)
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

function removeFromFavorite(id) {

  const movieIndex = movies.findIndex(movie => movie.id === id)
  let numberOfPages = Math.ceil(movies.length / movies_per_page)
  // 原本我的最愛有幾頁

  movies.splice(movieIndex, 1)

  const newNumberOfPages = Math.ceil(movies.length / movies_per_page)
  // 刪除一個最愛的使用者後，我的最愛有幾頁
  if (numberOfPages === newNumberOfPages + 1) {
    currentPage = currentPage - 1
    // 假設刪除後的頁數，比原本的頁數少一頁，例如兩頁變成一頁，讓目前頁數-1
  }

  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(getFavoriteMoviesByPage(currentPage))
  // 假設我目前在第二頁操作，刪除使用者後，能及時渲染畫面，並停留在第二頁，且若因為刪除使用者造成兩頁變成一頁，能自動跳轉至第一頁
  renderPaginator(movies.length)
}

function getFavoriteMoviesByPage(page) {
  const startIndex = movies_per_page * (page - 1)
  return movies.slice(startIndex, movies_per_page * page)
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / movies_per_page)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page = "${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderMovieList(getFavoriteMoviesByPage(page))
  currentPage = page
})