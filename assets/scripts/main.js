var rellax = new Rellax('.rellax');


// var simulateClick = function (elem) {
// 	// Create our event (with options)
// 	var evt = new MouseEvent('click', {
// 		bubbles: true,
// 		cancelable: true,
// 		view: window
// 	});
// 	// If cancelled, don't dispatch our event
// 	var canceled = !elem.dispatchEvent(evt);
// };


function getAttributes(){
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
}
  

// AJAX BLOODMETAL DETHKLOK HOMAGE TO ANCIENT XMLHTTPREQUESTS
var podcastAttributes = [];
getAttributes();




// and now for something completely different: an API integration
var iframeElement = document.querySelector('#multi_iframe');
// console.log(iframeElement);

var widget = new PB(iframeElement);
// console.log(widget);


async function changeEverything(json, selected) {
  var poster      = document.querySelector(".side-a .poster");
  var title       = document.querySelector(".side-a .title");
  var date        = document.querySelector(".side-a .date");
  var description = document.querySelector(".side-a .description");
  var download    = document.getElementById("downloadWidget");
  var selectedObject = document.querySelector(".side-b .episode[data-count='" + selected + "']");
  
  // the mini hero image
  poster.src      = json['poster'];
  
  // the episode title
  title.innerHTML = selectedObject.innerHTML;
  
  // console.log(selectedObject);
  
  // the publish date
  // sure, there's a more idiomatic way to do that, but why? check out this mess of RSS date formatting:
  if (!podcastAttributes.length) {
    getAttributes();
  }
  var datarang    = await podcastAttributes[selected].getElementsByTagName('pubDate')[0].innerHTML.split(" ");
  // console.log(podcastAttributes[selected].getElementsByTagName('pubDate').innerHTML);
  date.innerHTML = datarang[2] + " " + datarang[1] + ", " + datarang[3];
  
  // the description
  description.innerHTML = podcastAttributes[selected].getElementsByTagName('description')[0].innerHTML.slice(0, -3);
  
  // the download link
  download.setAttribute("download", json['sources'][0]['src']);
  
}

function setPlayer() {
  // player title
  var selectedObject = document.querySelector(".side-b .episode.selected");
  var json = JSON.parse(selectedObject.dataset.json);
  var selected = selectedObject.dataset.count;
  var playerTitle = document.getElementById("title");
  playerTitle.innerHTML = selectedObject.innerHTML;

  // pod duration information
  var duration = json['duration'];
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

  // skip to track number awesome
  widget.skip(selected);
}


function playTheWidget() {

  // simulateClick(iframeElement);
  // invoke the changing of titles and buttons and everything
  widget.play();

  console.log("play button clicked");
  document.querySelector(".player").classList.add("playing");
  // document.getElementById("pauseWidget").classList.add("playing");
  // document.getElementById("playWidget").classList.add("playing");
  document.getElementById("play").classList.add("playing");
  document.getElementById("pause").classList.add("playing");
}

function pauseTheWidget() {
  // invoke the changing of titles and buttons and everything
  widget.pause();
  console.log("pause clicked");
  // document.getElementById("pauseWidget").classList.remove("playing");
  // document.getElementById("playWidget").classList.remove("playing");
  document.getElementById("play").classList.remove("playing");
  document.getElementById("pause").classList.remove("playing");
}

function downloadThePod() {
  var download = document.getElementById("downloadWidget");
  url = download.getAttribute("download");
  // var name = document.querySelector('.side-a .title').innerHTML

  // fetch(url, {
  //   mode: 'no-cors',
  //   headers: {
  //     'Content-Disposition': 'attachment'
  //   } 
  // })
  // .then( res => res.blob() )
  // .then( blob => {
  //   var url = URL.createObjectURL(blob, {type:"audio/mpeg"});
  //   var a = document.createElement('a');
  //   a.href = url;
  //   a.download = name + ".mp3";

  //     // Click handler that releases the object URL after the element has been clicked
  //     // This is required for one-off downloads of the blob content
  //     // const clickHandler = () => {
  //     //   setTimeout(() => {
  //     //     URL.revokeObjectURL(url);
  //     //     this.removeEventListener('click', clickHandler);
  //     //   }, 150);
  //     // };
      
  //     // Add the click event listener on the anchor element
  //     // Comment out this line if you don't want a one-off download of the blob content
  //     // a.addEventListener('click', clickHandler, false);
    
  //   a.click();
  // });




  // xhr.open("GET", url, true);
  // // xhr.setRequestHeader('Access-Control-Allow-Origin', 'podbean.com/');

  // xhr.onreadystatechange = function() {
  //   if (xhr.readyState == 4) {
  //     if (xhr.status == 200) {
  //       if (xhr.responseText != null) {
  //         stuff = xhr.responseXML;

  //       } else {
  //         alert("Failed to receive RSS file from the server - file not found.");
  //         return false;
  //       }
  //     } else {
  //       alert("Error code " + xhr.status + " received: " + xhr.statusText);
  //     }
  //   }
  // };

  // xhr.send(null);


  // // yeah, I know, it's not downloading. It's a CORS file, can't do that.
  var download = document.getElementById("downloadWidget");
  window.open(download.getAttribute("download"), '_blank');
}

function closeThings() {
  // youtube
  document.getElementById("ytplayer").classList.remove('open');
  document.getElementById('ytex').classList.remove('open');

  // expanded episodes div
  document.querySelector('.side-b-wrapper').classList.remove('mobile-open');

  // podplayer
  document.getElementById('mobilex').classList.remove('open');
  document.querySelector(".player").classList.remove("playing");
  document.querySelector("footer").classList.remove("playing");
  document.querySelector(".mobile-player").classList.remove("playing");
}

var domReady = function(callback) {
  document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};

domReady(function(){
  var introButton = document.getElementById("ytbutton");
  var youTube = document.getElementById("ytplayer");
  var ex = document.getElementById('ytex');
  
  introButton.addEventListener('click', function(){
    youTube.classList.add('open');
    ex.classList.add('open');
  });

  document.getElementById('ytex').addEventListener('click', closeThings);
  document.getElementById('mobilex').addEventListener('click', closeThings);

  document.addEventListener('keyup', function(e){
    if(e.key === "Escape") {
      closeThings();
    }
  });

  var morEps = document.getElementById("moreps");
  morEps.addEventListener('click', function(){
    document.querySelector('.side-b-wrapper').classList.toggle('mobile-open');
    this.classList.toggle('active');
  });
});

widget.bind("PB.Widget.Events.PLAY", function(){
  widget.getCurrentSourceIndex(function(result){ console.log(result)});
});


widget.bind("PB.Widget.Events.READY", function(){

  // simulateClick(iframeElement);
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
      document.querySelector('.episode').classList.add('selected');
      count === 0 ? setPlayer() : false;

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
        var els = document.querySelectorAll('.episode');
        for (var i = 0; i < els.length; i++) {
          els[i].classList.remove('selected');
        }
        this.classList.add('selected');
        var sticker = document.querySelector('.new-sticker');
        selected === '0' ? sticker.classList.add("active") : sticker.classList.remove("active");

        json = JSON.parse(this.dataset.json);
        // invoke the changing of titles and buttons and everything
        changeEverything(json, selected);

        var top = document.getElementById("podtop");
        top.scrollIntoView(true, {behavior: "smooth"});

        closeThings();
      });
    });
    
    // var player = document.getElementById('multi_iframe');
    // player.addEventListener("click", function(){
    //   console.log('clicked!');
    // });
    // console.log("poot");
  });

  var playerOpen = document.getElementById("playerOpen");
  playerOpen.addEventListener('click', function(){
    setPlayer();

    document.querySelector(".player").classList.add("playing");
    document.querySelector(".mobile-player").classList.add("playing");
    document.getElementById('mobilex').classList.add('open');
    document.querySelector("footer").classList.add("playing");
  });
  
  // widget.bind("PB.Widget.Events.PLAY", function(){
  var play = document.getElementById("play");
  play.addEventListener("click", playTheWidget);

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

  // console.log(relativePosition);
  var progressBar = document.getElementById('complete');
  progressBar.style.width = (relativePosition * 100) + "%";
});