const API_URL = "https://archive.org/advancedsearch.php?q=mediatype:movies&output=json&rows=50";

// DOM
const container = document.getElementById("categories");
const banner = document.getElementById("banner");
const bannerTitle = document.getElementById("banner-title");
const playBanner = document.getElementById("play-banner");

const modal = document.getElementById("player-modal");
const video = document.getElementById("video-player");
const closeBtn = document.getElementById("close-btn");

// 播放
function playMovie(src) {
  video.src = src;
  modal.classList.remove("hidden");
  video.play();
}

closeBtn.onclick = () => {
  modal.classList.add("hidden");
  video.pause();
};

// 获取电影
async function loadMovies() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    const movies = data.response.docs;

    // Banner
    const first = movies[0];
    banner.style.backgroundImage = `url(https://archive.org/services/img/${first.identifier})`;
    bannerTitle.innerText = first.title;

    playBanner.onclick = () => {
      playMovie(`https://archive.org/download/${first.identifier}/${first.identifier}.mp4`);
    };

    // 分类（简单按年份）
    const categories = {};

    movies.forEach(m => {
      const year = m.year || "Other";

      if (!categories[year]) {
        categories[year] = [];
      }

      categories[year].push(m);
    });

    // 渲染
    Object.keys(categories).slice(0, 5).forEach(cat => {
      const section = document.createElement("div");
      section.className = "category";

      section.innerHTML = `<h2>${cat}</h2><div class="movie-row"></div>`;
      const row = section.querySelector(".movie-row");

      categories[cat].forEach(movie => {
        const div = document.createElement("div");
        div.className = "movie";

        const img = `https://archive.org/services/img/${movie.identifier}`;

        div.innerHTML = `<img src="${img}">`;

        div.onclick = () => {
          playMovie(`https://archive.org/download/${movie.identifier}/${movie.identifier}.mp4`);
        };

        row.appendChild(div);
      });

      container.appendChild(section);
    });

  } catch (err) {
    console.error("加载失败:", err);
  }
}

// 启动
loadMovies();    video.play();
  };

  list.appendChild(div);
});

// 关闭播放器
closeBtn.onclick = () => {
  modal.classList.add("hidden");
  video.pause();
};
