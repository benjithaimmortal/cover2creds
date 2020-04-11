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
        // var parser = new DOMParser();
        // var xml = parser.parseFromString(xhr.responseXML, "text/xml");
        podcastAttributes = xhr.responseXML.getElementsByTagName('item');
        console.log(podcastAttributes[0]);
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

console.log(iframeElement);
var widget = new PB(iframeElement);
console.log(widget);

function log(thing) {
  console.log(thing);
}

function changeEverything(json, selected) {
  var poster = document.querySelector(".side-a .poster");
  var title = document.querySelector(".side-a .title");
  var date = document.querySelector(".side-a .date");
  var description = document.querySelector(".side-a .description");
  poster.src = json['poster'];
  title.innerHTML = json['name'];
  var datarang = podcastAttributes[selected].getElementsByTagName('pubDate')[0].innerHTML.split(" ");
  date.innerHTML = datarang[2] + " " + datarang[1] + ", " + datarang[3];
  description.innerHTML = podcastAttributes[selected].getElementsByTagName('description')[0].innerHTML.slice(0, -3);

  console.log(podcastAttributes[selected].getElementsByTagName('pubDate').innerHTML);
  // console.log(json);
}


widget.bind("PB.Widget.Events.READY", function(){
  widget.getSources(function(result){
    // add the source names to side-b
    var count = 0;
    var selected = 0;
    var box = document.querySelector(".spacer");
    result.forEach( source => {
      // if this is the first item, send it up to change everything and 'load' the stuff
      count === 0 ? changeEverything(source, selected) : false;

      box.innerHTML = box.innerHTML + "<div class='episode' data-count='" + count + "' data-json='" + JSON.stringify(source) + "'>" + source['name'] + "</div>";
      count++;
    });
    // // what if you run out of things to do? make more things to do
    // box.innerHTML = box.innerHTML + '<div class="see-more">See more on Podbean!</div>';


    // listen for clicks on side-b
    var episodes = document.querySelectorAll(".episode");
    episodes.forEach( episode => {
      episode.addEventListener("click", function(){
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
    
    // listen for clicks on side-a
    var play = document.getElementById("play");
    play.addEventListener("click", function(){
      // invoke the changing of titles and buttons and everything
      widget.play();
      this.classList.remove("paused");
      this.classList.add("playing");
      document.getElementById("pause").classList.remove("plaused");
      document.getElementById("pause").classList.add("playing");
    });
    
    // listen for clicks on side-a
    var pause = document.getElementById("pause");
    pause.addEventListener("click", function(){
      // invoke the changing of titles and buttons and everything
      widget.pause();
      this.classList.remove("playing");
      this.classList.add("paused");
      document.getElementById("play").classList.remove("playing");
      document.getElementById("play").classList.add("paused");
    });
    

    // add a title
    console.log("poot");
  });





});


// var playToggleButton, playButton, pauseButton, shareButton, downloadButton;

// playToggleButton = document.querySelector('#play_toggle');
// playButton = document.querySelector('#play');
// pauseButton = document.querySelector('#pause');
// downloadButton = document.querySelector('#download');
// shareButton = document.querySelector('#share');
