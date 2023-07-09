const Base_URL = "https://webdev.alphacamp.io";
const index_URL = Base_URL + "/api/movies/";
const poster_URL = Base_URL + "/posters/";
const movies = [];
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const movies_per_page = 12;
const paginator = document.querySelector("#paginator");
let filteredMovies = [];
const listGroup = document.querySelector(".list-group");
const cardMode = document.querySelector(".card-mode");
const listMode = document.querySelector(".list-mode");
let currentMode = "card-mode";
let currentPage = 1;

axios
  .get(index_URL)
  .then((response) => {
    movies.push(...response.data.results);
    renderPaginator(movies.length);
    renderMovieListInCardMode(getMoviesByPage(1));
    // 預設頁面為卡片模式第一頁
  })
  .catch((err) => console.log(err));

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(event.target.dataset.id);
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
  }
});

// 在清單上綁監聽器
listGroup.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(event.target.dataset.id);
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
  }
});

// 在卡片按鈕綁監聽器
cardMode.addEventListener("click", () => {
  currentMode = "card-mode";
  // 設定現在呈現模式為卡片模式
  listGroup.innerHTML = "";
  // 清空清單內容
  if (filteredMovies.length === 0) {
    renderMovieListInCardMode(getMoviesByPage(currentPage));
    // 在還沒搜尋前呈現卡片模式，並依照當下頁數呈現電影
  } else {
    renderMovieListInCardMode(getFilteredMoviesByPage(currentPage));
    // 在搜尋後呈現卡片模式，並依照當下頁數呈現電影，並且只會呈現符合搜尋的結果
  }
});

// 在清單按鈕綁監聽器
listMode.addEventListener("click", () => {
  currentMode = "list-mode";
  // 設定現在呈現模式為清單模式
  dataPanel.innerHTML = "";
  // 清空卡片內容
  if (filteredMovies.length === 0) {
    renderMovieListInListMode(getMoviesByPage(currentPage));
    // 在還沒搜尋前呈現清單模式，並依照當下頁數呈現電影
  } else {
    renderMovieListInListMode(getFilteredMoviesByPage(currentPage));
    // 在搜尋後呈現清單模式，並依照當下頁數呈現電影，並且只會呈現符合搜尋的結果
  }
});

paginator.addEventListener("click", function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") return;
  currentPage = Number(event.target.dataset.page);
  if (currentMode === "card-mode") {
    // 如果現在是卡片模式
    if (filteredMovies.length === 0) {
      renderMovieListInCardMode(getMoviesByPage(currentPage));
      // 在還沒搜尋前呈現卡片模式，並依照當下頁數呈現電影
    } else {
      renderMovieListInCardMode(getFilteredMoviesByPage(currentPage));
      // 在搜尋後呈現卡片模式，並依照當下頁數呈現電影，並且只會呈現符合搜尋的結果
    }
  }

  if (currentMode === "list-mode") {
    // 如果現在是清單模式
    if (filteredMovies.length === 0) {
      renderMovieListInListMode(getMoviesByPage(currentPage));
      // 在還沒搜尋前呈現清單模式，並依照當下頁數呈現電影
    } else {
      renderMovieListInListMode(getFilteredMoviesByPage(currentPage));
      // 在搜尋後呈現清單模式，並依照當下頁數呈現電影，並且只會呈現符合搜尋的結果
    }
  }
});

function renderMovieListInCardMode(data) {
  let rawHTML = "";

  data.forEach((item) => {
    rawHTML += `<div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src= "${poster_URL + item.image}"
              class="card-img-top" alt="movie poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
              <div class="card-footer">
                <button class="btn btn-primary btn-show-movie"                    data-bs-toggle="modal"
                  data-bs-target="#movie-modal" data-id = "${item.id
      }">More</button>
                <button class="btn btn-info btn-add-favorite" data-id = "${item.id
      }">+</button>

              </div>
            </div>
          </div>

        </div>
      </div>`;
  });

  dataPanel.innerHTML = rawHTML;
}

function renderMovieListInListMode(data) {
  let rawHTML = "";

  data.forEach((item) => {
    rawHTML += `
      <li class="list-group-item">
        <span class="movie-title"> ${item.title}</span>
        <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id = "${item.id}">More</button>
        <button class="btn btn-info btn-add-favorite" data-id = "${item.id}">+</button>

      </li>
      
      `;
  });

  listGroup.innerHTML = rawHTML;
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / movies_per_page);
  let rawHTML = "";
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page = "${page}">${page}</a></li>`;
  }
  paginator.innerHTML = rawHTML;
}

function getMoviesByPage(page) {
  const startIndex = movies_per_page * (page - 1);
  return movies.slice(startIndex, movies_per_page * page);
}

function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-image img");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");

  axios
    .get(index_URL + id)
    .then((response) => {
      const data = response.data.results;
      modalTitle.innerHTML = data.title;
      modalImage.src = `${poster_URL + data.image}`;
      modalDate.innerHTML = "release date : " + data.release_date;
      modalDescription.innerHTML = data.description;
    })
    .catch((err) => console.log(err));
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const movie = movies.find((movie) => movie.id === id);
  if (list.some((movie) => movie.id === id)) {
    return alert("此電影已經在收藏清單中！");
  }
  list.push(movie);
  localStorage.setItem("favoriteMovies", JSON.stringify(list));
}

searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();

  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  );

  if (!keyword.length) {
    return alert("Please enter a valid string!");
  }

  if (filteredMovies.length === 0) {
    return alert("Can not find the movie : " + keyword);
  }

  if (currentMode === "card-mode") {
    renderMovieListInCardMode(getFilteredMoviesByPage(1));
    console.log("test");
  } else if (currentMode === "list-mode") {
    renderMovieListInListMode(getFilteredMoviesByPage(1));
  }

  renderPaginator(filteredMovies.length);
});

function getFilteredMoviesByPage(page) {
  const startIndex = movies_per_page * (page - 1);
  return filteredMovies.slice(startIndex, movies_per_page * page);
}
