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
  var date        = document.querySelector(".side-a .date");
  var description = document.querySelector(".side-a .description");
  poster.src      = json['poster'];
  var selectedObject = document.querySelector(".side-b .episode[data-count='" + selected + "']");
  title.innerHTML = selectedObject.innerHTML;
  console.log(selectedObject);

  var datarang    = podcastAttributes[selected].getElementsByTagName('pubDate')[0].innerHTML.split(" ");
  // sure, there's a more idiomatic way to do that, but why? check out this mess of RSS date formatting:
  // console.log(podcastAttributes[selected].getElementsByTagName('pubDate').innerHTML);
  date.innerHTML = datarang[2] + " " + datarang[1] + ", " + datarang[3];
  description.innerHTML = podcastAttributes[selected].getElementsByTagName('description')[0].innerHTML.slice(0, -3);

  console.log(json);
}

function playTheWidget() {
  // invoke the changing of titles and buttons and everything
  widget.play();
  console.log("play button clicked");
  document.getElementById("pauseWidget").classList.add("playing");
  document.getElementById("playWidget").classList.add("playing");
}

function pauseTheWidget() {
  // invoke the changing of titles and buttons and everything
  widget.pause();
  console.log("pause clicked");
  document.getElementById("pauseWidget").classList.remove("playing");
  document.getElementById("playWidget").classList.remove("playing");
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
        widget.pause();
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

});


// var playToggleButton, playButton, pauseButton, shareButton, downloadButton;

// playToggleButton = document.querySelector('#play_toggle');
// playButton = document.querySelector('#play');
// pauseButton = document.querySelector('#pause');
// downloadButton = document.querySelector('#download');
// shareButton = document.querySelector('#share');
