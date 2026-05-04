const API_BASE = "https://archive.org/advancedsearch.php";

// 状态
let page = 1;
let loading = false;
let keyword = "";

// DOM
const container = document.getElementById("categories");
const banner = document.getElementById("banner");
const bannerTitle = document.getElementById("banner-title");
const playBanner = document.getElementById("play-banner");

const modal = document.getElementById("player-modal");
const video = document.getElementById("video-player");
const closeBtn = document.getElementById("close-btn");

// ===== 播放 =====
function playMovie(src) {
  video.src = src;
  modal.classList.remove("hidden");
  video.play();
}

closeBtn.onclick = () => {
  modal.classList.add("hidden");
  video.pause();
};

// ===== 获取真正可播放视频（关键优化🔥）=====
async function getPlayableUrl(identifier) {
  try {
    const res = await fetch(`https://archive.org/metadata/${identifier}`);
    const data = await res.json();

    const files = data.files;

    // 优先找 mp4
    const videoFile = files.find(f => f.name.endsWith(".mp4"));

    if (videoFile) {
      return `https://archive.org/download/${identifier}/${videoFile.name}`;
    }

    return null;
  } catch {
    return null;
  }
}

// ===== 加载电影 =====
async function loadMovies() {
  if (loading) return;
  loading = true;

  const query = keyword
    ? `mediatype:movies AND ${keyword}`
    : "mediatype:movies";

  const url = `${API_BASE}?q=${encodeURIComponent(query)}&rows=20&page=${page}&output=json`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const movies = data.response.docs;

    // Banner 只在第一页设置
    if (page === 1 && movies.length > 0) {
      const first = movies[0];
      banner.style.backgroundImage = `url(https://archive.org/services/img/${first.identifier})`;
      bannerTitle.innerText = first.title;

      playBanner.onclick = async () => {
        const src = await getPlayableUrl(first.identifier);
        if (src) playMovie(src);
      };
    }

    movies.forEach(movie => {
      const div = document.createElement("div");
      div.className = "movie";

      const img = `https://archive.org/services/img/${movie.identifier}`;

      div.innerHTML = `<img src="${img}">`;

      div.onclick = async () => {
        div.innerHTML = "Loading...";
        const src = await getPlayableUrl(movie.identifier);

        if (src) {
          playMovie(src);
        } else {
          div.innerHTML = "❌ 无法播放";
        }
      };

      container.appendChild(div);
    });

    page++;

  } catch (err) {
    console.error(err);
  }

  loading = false;
}

// ===== 无限滚动 =====
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
    loadMovies();
  }
});

// ===== 搜索（动态添加输入框）=====
const searchBox = document.createElement("input");
searchBox.placeholder = "🔍 搜索电影...";
searchBox.style.cssText = `
  width: 300px;
  padding: 10px;
  margin: 20px;
  font-size: 16px;
`;

document.body.insertBefore(searchBox, container);

searchBox.addEventListener("input", () => {
  keyword = searchBox.value;
  page = 1;
  container.innerHTML = "";
  loadMovies();
});

// 启动
loadMovies();
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
