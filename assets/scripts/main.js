var rellax = new Rellax('.rellax');




// AJAX BLOODMETAL DETHKLOK HOMAGE TO ANCIENT XMLHTTPREQUESTS
var podcastAttributes = [];

var url = "https://feed.podbean.com/covertocredits/feed.xml";
var xhr = new XMLHttpRequest();
xhr.open("GET", url, true);

xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    if (xhr.status == 200) {
      if (xhr.responseText != null) {
        podcastAttributes = xhr.responseXML.getElementsByTagName('item');

        // console.log(podcastAttributes[0]);
      } else {
        alert("Failed to receive RSS file from the server - file not found.");
        return false;
      }
    } else {
      alert("Error code " + xhr.status + " received: " + xhr.statusText);
    }
  }
};

xhr.send(null);
  





// and now for something completely different: an API integration
var iframeElement = document.querySelector('#multi_iframe');
// console.log(iframeElement);

var widget = new PB(iframeElement);
// console.log(widget);


function changeEverything(json, selected) {
  var poster      = document.querySelector(".side-a .poster");
  var title       = document.querySelector(".side-a .title");
  var playerTitle = document.getElementById("title");
  var date        = document.querySelector(".side-a .date");
  var description = document.querySelector(".side-a .description");
  var download    = document.getElementById("downloadWidget");
  var selectedObject = document.querySelector(".side-b .episode[data-count='" + selected + "']");
    
  poster.src      = json['poster'];
  
  title.innerHTML = playerTitle.innerHTML = selectedObject.innerHTML;
  
  // console.log(selectedObject);
  
  // sure, there's a more idiomatic way to do that, but why? check out this mess of RSS date formatting:
  var datarang    = podcastAttributes[selected].getElementsByTagName('pubDate')[0].innerHTML.split(" ");
  // console.log(podcastAttributes[selected].getElementsByTagName('pubDate').innerHTML);
  date.innerHTML = datarang[2] + " " + datarang[1] + ", " + datarang[3];
  
  description.innerHTML = podcastAttributes[selected].getElementsByTagName('description')[0].innerHTML.slice(0, -3);
  
  download.setAttribute("download", json['sources'][0]['src']);
  
  var duration = json['duration'];
  // console.log(duration);
  var endtime = document.getElementById('endtime');
  var hours, minutes, seconds;
  if (Math.floor(duration / 3600) !== 0) {
    hours = Math.floor(duration / 3600);
    hours += ":";
  } else {
    hours = '';
  }
  duration %= 3600;
  if (Math.floor(duration / 60) !== 0) {
    minutes = Math.floor(duration / 60);
  } else {
    minutes = 0 + Math.floor(duration / 60);
  }
  minutes += ":";
  
  if (Math.floor(duration % 60) >= 10) {
    seconds = Math.floor(duration % 60);
  } else {
    seconds = '0' + Math.floor(duration % 60);
  }
  endtime.innerHTML = hours + minutes + seconds;
}

function playTheWidget() {
  // invoke the changing of titles and buttons and everything
  widget.play();

  console.log("play button clicked");
  document.querySelector(".player").classList.add("playing");
  document.getElementById("pauseWidget").classList.add("playing");
  document.getElementById("playWidget").classList.add("playing");
  document.getElementById("play").classList.add("playing");
  document.getElementById("pause").classList.add("playing");
}

function pauseTheWidget() {
  // invoke the changing of titles and buttons and everything
  widget.pause();
  console.log("pause clicked");
  document.getElementById("pauseWidget").classList.remove("playing");
  document.getElementById("playWidget").classList.remove("playing");
  document.getElementById("play").classList.remove("playing");
  document.getElementById("pause").classList.remove("playing");
}

function downloadThePod() {
  // yeah, I know, it's not downloading. It's a CORS file, can't do that.
  var download = document.getElementById("downloadWidget");
  window.open(download.getAttribute("download"), '_blank');
}

widget.bind("PB.Widget.Events.READY", function(){
  widget.getSources(function(result){
    // add the source names to side-b
    var count = 0;
    var selected = 0;
    var box = document.querySelector(".spacer");
    result.forEach( source => {
      var name = source['name'];
      delete source['name'];

      box.innerHTML = box.innerHTML + "<div class='episode' data-count='" + count + "' data-json='" + JSON.stringify(source) + "'>" + name + "</div>";
      
      // if this is the first item, send it up to change everything and 'load' the stuff
      count === 0 ? changeEverything(source, selected) : false;
      count++;
    });
    // // what if you run out of things to do? make more things to do
    // box.innerHTML = box.innerHTML + '<div class="see-more">See more on Podbean!</div>';


    // listen for clicks on side-b
    var episodes = document.querySelectorAll(".episode");
    episodes.forEach( episode => {
      episode.addEventListener("click", function(){
        // widget.pause();
        selected = this.dataset.count;
        var sticker = document.querySelector('.new-sticker');
        selected === '0' ? sticker.classList.add("active") : sticker.classList.remove("active");

        json = JSON.parse(this.dataset.json);
        // invoke the changing of titles and buttons and everything
        changeEverything(json, selected);
        // skip to track number awesome
        widget.skip(selected);
      });
    });
    
    // console.log("poot");
  });
// });

// widget.bind("PB.Widget.Events.PLAY", function(){
  // listen for clicks on side-a
  var playWidget = document.getElementById("playWidget");
  playWidget.addEventListener("click", playTheWidget);

  var play = document.getElementById("play");
  play.addEventListener("click", playTheWidget);

  // listen for clicks on side-a
  var pauseWidget = document.getElementById("pauseWidget");
  pauseWidget.addEventListener("click", pauseTheWidget);

  var pause = document.getElementById("pause");
  pause.addEventListener("click", pauseTheWidget);
  
  var downloadButton = document.querySelector('#downloadWidget');
  downloadButton.addEventListener("click", downloadThePod);

  // var shareButton = document.querySelector('#shareWidget');
  // shareButton.addEventListener("click", shareThisPod);

  var thirtyBack = document.getElementById("back30");
  thirtyBack.addEventListener("click", function(){
    widget.getPosition(function(currentPosition){
      widget.seekTo(currentPosition - 30);
    })
  });
  var thirtyFwd = document.getElementById("fwd30");
  thirtyFwd.addEventListener("click", function(){
    widget.getPosition(function(currentPosition){
      widget.seekTo(currentPosition + 30);
    });
  });
});

widget.bind("PB.Widget.Events.PLAY_PROGRESS", function(object){
  var currentTime = object['data']['currentPosition'];
  var relativePosition = object['data']['relativePosition'];
  var startTime = document.getElementById('starttime');
  
  
  var hours, minutes, seconds;
  if (Math.floor(currentTime / 3600) !== 0) {
    hours = Math.floor(currentTime / 3600);
    hours += ":";
  } else {
    hours = '';
  }
  currentTime %= 3600;
  if (Math.floor(currentTime / 60) !== 0) {
    minutes = Math.floor(currentTime / 60);
  } else {
    minutes = 0 + Math.floor(currentTime / 60);
  }
  minutes += ":";
  
  if (Math.floor(currentTime % 60) >= 10) {
    seconds = Math.floor(currentTime % 60);
  } else {
    seconds = '0' + Math.floor(currentTime % 60);
  }
  startTime.innerHTML = hours + minutes + seconds;

  console.log(relativePosition);
  var progressBar = document.getElementById('complete');
  progressBar.style.width = (relativePosition * 100) + "%";
});