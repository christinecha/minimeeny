"use strict"

let Recorder = require('recorderjs')

navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia;

var constraints = {
  audio: true,
  video: true
};

var rec;

function successCallback(stream) {
var video = document.getElementById('vid')
  var audioCtx = new AudioContext();
  var mediaStreamSource = audioCtx.createMediaStreamSource(stream)
  video.src = window.URL.createObjectURL(stream);
   video.onloadedmetadata = function(e) {
      // Do something with the video here.
      video.play()
   };

  rec = new Recorder(mediaStreamSource)
  console.log('streaming:', rec)
}

$('#start').click(function() {
  console.log('started')
  rec.record()
  setTimeout(function() {
    rec.stop()
    rec.exportWAV((blob) => inputFile(blob), 'audio/wav')
    rec.clear()
  }, 5000)
})

$('#clip').on('updated', function() {
  var soundInput = $('#clip').val()
  $('#player').attr('src', soundInput)
  // sound.setPath(soundInput)
  // console.log('changed!', sound)
})

function inputFile(blob) {
  console.log(URL.createObjectURL(blob))
  $('#clip').val(URL.createObjectURL(blob))
  $("#clip").trigger("updated");
}



function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
}

navigator.getUserMedia(constraints, successCallback, errorCallback);
