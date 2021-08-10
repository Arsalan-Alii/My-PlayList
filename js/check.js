const commonLink = "https://www.youtube.com/embed/";
let url = "https://www.youtube.com/watch?v=2IPw-mWe10U";
videoID = url.replace("https://www.youtube.com/watch?v=", "");

videoURL = commonLink + videoID;


if (url.startsWith("https://www.youtube.com")) {
  console.log("yt video")
}
else if ("youtube.com"){
  console.log("fb video")
}






let list = [];
list.push(
  {
    id: "1",
    title: "v1",
    link: "link1"
  }
);
list.push(
  {
    id: "2",
    title: "v2",
    link: "link2"
  }
);
list.push(
  {
    id: "3",
    title: "v3",
    link: "link3"
  }
);
list.push(
  {
    id: "4",
    title: "v4",
    link: "link4"
  }
);

function getVideo() {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === "2") {
      return list[i];
    }
  }
}

var a = JSON.stringify(getVideo());
var b = JSON.parse(a);