"use strict"

let Recorder = require('recorderjs')


navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia;

var constraints = {
  audio: true,
  video: true
};

var video = document.querySelector('video');
var rec;
var frequencyData = []
console.log(video, rec)

function successCallback(stream) {
  var audioCtx = new AudioContext();
  var mediaStreamSource = audioCtx.createMediaStreamSource(stream);

  rec = new Recorder(mediaStreamSource)
  console.log('streaming:', rec)
}

$('#start').click(function() {
  console.log('started')
  rec.record()
  setTimeout(function() {
    rec.stop()
    rec.exportWAV((blob) => inputFile(blob), 'audio/wav')
  }, 5000)
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
