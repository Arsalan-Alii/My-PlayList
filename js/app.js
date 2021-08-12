
// Define UI Vars
const form = document.querySelector('#add-video-form');
const videoList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-playlist');
const filter = document.querySelector('#filter');
const videoTitle = document.querySelector('#video-title');
const videoLink = document.querySelector('#video-link');
const themeIcone = document.querySelector('#theme-icon');

// Get Theme
getLastSelectedTheme();
// Load all event listeners
loadEventListeners();

// Load all event listeners
function loadEventListeners() {
  // DOM Load event
  document.addEventListener('DOMContentLoaded', loadPlaylist);
  // Add video event
  form.addEventListener('submit', addVideo);
  // Play video event
  videoList.addEventListener('click', playVideo);
  // Delete video event
  videoList.addEventListener('click', deleteVideo);
  // Clear playlist event
  clearBtn.addEventListener('click', clearPlaylist);
  // Filter Videos event
  filter.addEventListener('keyup', filterVideos);
  // Theme change event
  themeIcone.addEventListener('click', changeTheme);
  getLastPLayedVideo();
}

// Get Playlist
function loadPlaylist() {
  // getLastSelectedTheme();

  let playlist = getPlaylist();

  playlist.forEach(function (video) {
    // Create li element
    const li = document.createElement('li');
    // Add class and ID
    li.className = 'collection-item';
    li.id = video.ID;
    // Title Span
    const title_span = document.createElement('span');
    title_span.className = 'video-title';
    title_span.appendChild(document.createTextNode(video.title));
    li.appendChild(title_span);

    // Icons Span
    const videoIcons = document.createElement('span');
    videoIcons.className = 'video-icons';

    // const playVideo = document.createElement('a');
    // playVideo.className = 'play-video';
    // playVideo.innerHTML = '<i class="far fa-play-circle"></i>';

    const deleteVideo = document.createElement('span');
    deleteVideo.className = 'delete-video';
    deleteVideo.innerHTML = '<i class="fas fa-trash-alt"></i>';

    // videoIcons.appendChild(playVideo);
    videoIcons.appendChild(deleteVideo);
    li.appendChild(videoIcons);
    videoList.appendChild(li);
  })
}

function addVideo(e) {
  urlValidation = validateVideoURL(videoLink.value);

  if (urlValidation === false) {
    // alert("Invalid URL...try again with valid url");
    document.querySelector('.invalid-url-msg').style.display = 'block';
    videoLink.value = '';
  }

  else {
    const id = Math.random().toString(16).slice(2);

    // Create li element
    const li = document.createElement('li');
    // Add class
    li.className = 'collection-item';
    li.id = id;
    // Title Span
    const title_span = document.createElement('span');
    title_span.className = 'video-title';
    title_span.appendChild(document.createTextNode(videoTitle.value));
    li.appendChild(title_span);

    // Icons Span
    const videoIcons = document.createElement('span');
    videoIcons.className = 'video-icons';

    const deleteVideo = document.createElement('span');
    deleteVideo.className = 'delete-video';
    deleteVideo.innerHTML = '<i class="fas fa-trash-alt"></i>';

    // videoIcons.appendChild(playVideo);
    videoIcons.appendChild(deleteVideo);

    // Append Icons to li
    li.appendChild(videoIcons);

    // Append li to ul
    videoList.appendChild(li);

    // Store in Local Storage
    storeVideoInLocalStorage(id, videoTitle.value, videoLink.value, urlValidation);

    // Clear input
    videoTitle.value = '';
    videoLink.value = '';
    document.querySelector('.bg-modal').style.display = "none";
  }

  e.preventDefault();
}

function storeVideoInLocalStorage(videoID, videoTitle, videoLink, urlInfo) {
  let playlist = getPlaylist();
  let videoPlatform = urlInfo[1];
  videoIdOnPlatform = urlInfo[0];

  playlist.push({ platform: videoPlatform, ID: videoID, title: videoTitle, link: videoLink, platformId: videoIdOnPlatform })

  localStorage.setItem('playlist', JSON.stringify(playlist));
}

function playVideo(e) {
  if (e.target.parentElement.classList.contains('collection-item')) {
    let playlist = getPlaylist();

    playlist.forEach(function (video) {
      if (e.target.parentElement.id === video.ID) {
        let videoLink = generateURL(video.platformId, video.platform);
        document.querySelector('.video').setAttribute("src", videoLink);
        localStorage.setItem("lastPlayedVideo", JSON.stringify(video));
        localStorage.setItem("currentPlayingVideo", JSON.stringify(video));
        return;
      }
    });
  }
}

function deleteVideo(e) {
  if (e.target.parentElement.classList.contains('delete-video')) {
    if (confirm('Do you want to delete?')) {
      e.target.parentElement.parentElement.parentElement.remove();

      // delete from LS
      deleteVideoFromLocalStorage(e.target.parentElement.parentElement.parentElement);
    }
  }
}

function deleteVideoFromLocalStorage(videoItem) {
  let playlist = getPlaylist();

  playlist.forEach(function (video, index) {
    if (videoItem.id === video.ID) {
      playlist.splice(index, 1);
    }
  });

  localStorage.setItem('playlist', JSON.stringify(playlist));
  // check if deleting current video
  if (videoItem.id === JSON.parse(localStorage.getItem('lastPlayedVideo')).ID) {
    localStorage.removeItem('lastPlayedVideo');
    // getLastPLayedVideo();
  }
  playNextVideo();
}

function clearPlaylist() {
  while (videoList.firstChild) {
    videoList.removeChild(videoList.firstChild);
  }
  // Clear Local Storage
  localStorage.clear();
}

function filterVideos(e) {
  const text = e.target.value.toLowerCase();

  document.querySelectorAll('.collection-item').forEach
    (function (video) {
      const item = video.firstChild.textContent;
      if (item.toLowerCase().indexOf(text) != -1) {
        video.style.display = 'block';
      }
      else {
        video.style.display = 'none';
      }
    })
}

function getPlaylist() {
  let playlist;
  if (localStorage.getItem('playlist') === null) {
    playlist = [];
  }
  else {
    playlist = JSON.parse(localStorage.getItem('playlist'));
  }
  return playlist;
}

function generateURL(link, platform) {
  let sourceURL;
  if (platform === "youtube") {
    sourceURL = `https://www.youtube.com/embed/${link}?autoplay=1`;
  }
  else if (platform === "vimeo") {
    sourceURL = `https://player.vimeo.com/video/${link}`;
  }
  else if (platform === "facebook") {
    sourceURL = `https://www.facebook.com/plugins/video.php?autoplay=1&mute=0&href=${link}`;
  }
  return sourceURL;
}

function changeTheme() {
  document.body.classList.toggle("dark-theme");
  if (document.body.classList.contains("dark-theme")) {
    themeIcone.src = "assets/sun.svg";
    localStorage.setItem("theme", "dark");
  } else {
    themeIcone.src = "assets/moon.svg";
    localStorage.removeItem("theme");
  }
}

function getLastSelectedTheme() {
  if (localStorage.getItem("theme") === 'dark') {
    document.body.classList.toggle("dark-theme");
    themeIcone.src = "assets/sun.svg";
  }
}

function getLastPLayedVideo() {
  if (localStorage.getItem('lastPlayedVideo') != null) {
    const lastPlayed = JSON.parse(localStorage.getItem('lastPlayedVideo'));
    document.querySelector('.video').setAttribute("src", generateURL(lastPlayed.platformId, lastPlayed.platform));
  }
  else {
    document.querySelector('.video').setAttribute("src", "https://www.youtube.com/embed/74cVT_tUpck?autoplay=1");
  }
}

function playNextVideo() {
  let playlist = getPlaylist();
  if (playlist != []) {
    document.querySelector('.video').setAttribute("src", generateURL(playlist[0].platformId, playlist[0].platform));
    localStorage.setItem('lastPlayedVideo', playlist[0]);
  } else {
    document.querySelector('.video').setAttribute("src", "https://www.youtube.com/embed/74cVT_tUpck?autoplay=1");
  }
}

function validateVideoURL(url) {
  let regExpYoutube = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  let regExpFB = /^(?:https?:\/\/)?(?:www.|web.|m.)?(facebook|fb).(com|watch)\/(?:video.php\?v=\d+|(\S+)|photo.php\?v=\d+|\?v=\d+)|\S+\/videos\/((\S+)\/(\d+)|(\d+))\/?$/;
  let regExpVimeo = /^(?:https:\/\/)?(?:www\.)?(?:vimeo.com\/)(\d{5,9})(?=\/)?$/;

  if (url.match(regExpYoutube)) return [url.match(regExpYoutube)[1], "youtube"];
  else if (url.match(regExpFB)) return [url, "facebook"];
  else if (url.match(regExpVimeo)) return [url.match(regExpVimeo)[1], "vimeo"];
  else return false;
}

// For Add Video Modal
document.getElementById('add-video').addEventListener("click", function () {
  document.querySelector('.bg-modal').style.display = "flex";
});

document.querySelector('.close').addEventListener("click", function () {
  document.querySelector('.bg-modal').style.display = "none";
  document.querySelector('.invalid-url-msg').style.display = 'none'
  videoTitle.value = '';
});

document.querySelector('#video-link').addEventListener("focus", function () {
  document.querySelector('.invalid-url-msg').style.display = 'none'
});