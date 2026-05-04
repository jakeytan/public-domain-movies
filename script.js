const movies = [
  {
    title: "Night of the Living Dead",
    category: "Horror",
    poster: "https://archive.org/download/night_of_the_living_dead/night_of_the_living_dead.jpg",
    src: "https://archive.org/download/night_of_the_living_dead/night_of_the_living_dead_512kb.mp4"
  },
  {
    title: "The General",
    category: "Classic",
    poster: "https://archive.org/download/TheGeneral1926/TheGeneral1926.jpg",
    src: "https://archive.org/download/TheGeneral1926/TheGeneral1926_512kb.mp4"
  },
  {
    title: "His Girl Friday",
    category: "Comedy",
    poster: "https://archive.org/download/his_girl_friday/his_girl_friday.jpg",
    src: "https://archive.org/download/his_girl_friday/his_girl_friday_512kb.mp4"
  },
  {
    title: "Sherlock Holmes",
    category: "Classic",
    poster: "https://archive.org/download/SherlockHolmesAndTheSecretWeapon/Sherlock.jpg",
    src: "https://archive.org/download/SherlockHolmesAndTheSecretWeapon/SherlockHolmesAndTheSecretWeapon_512kb.mp4"
  }
];

// ===== Banner =====
const banner = document.getElementById("banner");
const bannerTitle = document.getElementById("banner-title");
const playBanner = document.getElementById("play-banner");

const featured = movies[0];

banner.style.backgroundImage = `url(${featured.poster})`;
bannerTitle.innerText = featured.title;

playBanner.onclick = () => playMovie(featured.src);

// ===== 分类生成 =====
const categories = {};

movies.forEach(m => {
  if (!categories[m.category]) {
    categories[m.category] = [];
  }
  categories[m.category].push(m);
});

const container = document.getElementById("categories");

Object.keys(categories).forEach(cat => {
  const section = document.createElement("div");
  section.className = "category";

  section.innerHTML = `<h2>${cat}</h2><div class="movie-row"></div>`;
  const row = section.querySelector(".movie-row");

  categories[cat].forEach(movie => {
    const div = document.createElement("div");
    div.className = "movie";

    div.innerHTML = `<img src="${movie.poster}">`;

    div.onclick = () => playMovie(movie.src);

    row.appendChild(div);
  });

  container.appendChild(section);
});

// ===== 播放 =====
const modal = document.getElementById("player-modal");
const video = document.getElementById("video-player");
const closeBtn = document.getElementById("close-btn");

function playMovie(src) {
  video.src = src;
  modal.classList.remove("hidden");
  video.play();
}

closeBtn.onclick = () => {
  modal.classList.add("hidden");
  video.pause();
};