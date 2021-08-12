function validateVideoURL(url) {
  let regExpYoutube = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  let regExpFB = /^(?:https?:\/\/)?(?:www.|web.|m.)?(facebook|fb).(com|watch)\/(?:video.php\?v=\d+|(\S+)|photo.php\?v=\d+|\?v=\d+)|\S+\/videos\/((\S+)\/(\d+)|(\d+))\/?$/;
  let regExpVimeo = /^(?:https:\/\/)?(?:www\.)?(?:vimeo.com\/)(\d{5,9})(?=\/)?$/;

  if (url.match(regExpYoutube)) return `https://www.youtube.com/embed/'${url.match(regExpYoutube)[1]}'?autoplay=1`;

  else if (url.match(regExpFB)) return url;

  else if (url.match(regExpVimeo)) return `https://player.vimeo.com/video/${url.match(regExpVimeo)[1]}`;

  else return false;
}