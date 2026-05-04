const movies = [
  {
    title: "Night of the Living Dead",
    poster: "https://archive.org/download/night_of_the_living_dead/night_of_the_living_dead.jpg",
    src: "https://archive.org/download/night_of_the_living_dead/night_of_the_living_dead_512kb.mp4"
  },
  {
    title: "The General",
    poster: "https://archive.org/download/TheGeneral1926/TheGeneral1926.jpg",
    src: "https://archive.org/download/TheGeneral1926/TheGeneral1926_512kb.mp4"
  },
  {
    title: "His Girl Friday",
    poster: "https://archive.org/download/his_girl_friday/his_girl_friday.jpg",
    src: "https://archive.org/download/his_girl_friday/his_girl_friday_512kb.mp4"
  }
];

const list = document.getElementById("movie-list");
const modal = document.getElementById("player-modal");
const video = document.getElementById("video-player");
const closeBtn = document.getElementById("close-btn");

// 渲染电影
movies.forEach(movie => {
  const div = document.createElement("div");
  div.className = "movie";

  div.innerHTML = `
    <img src="${movie.poster}">
    <h3>${movie.title}</h3>
  `;

  div.onclick = () => {
    video.src = movie.src;
    modal.classList.remove("hidden");
    video.play();
  };

  list.appendChild(div);
});

// 关闭播放器
closeBtn.onclick = () => {
  modal.classList.add("hidden");
  video.pause();
};
