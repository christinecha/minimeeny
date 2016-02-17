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
console.log(video, rec)

function successCallback(stream) {
  var audioCtx = new AudioContext();
  var mediaStreamSource = audioCtx.createMediaStreamSource(stream);

  window.stream = stream; // stream available to console
  if (window.URL) {
    video.src = window.URL.createObjectURL(stream);
  } else {
    video.src = stream;
  }

  rec = new Recorder(mediaStreamSource)
  console.log('streaming:', rec)
}

$('#start').click(function() {
  rec.record()
  setTimeout(function() {
    rec.stop()
    rec.exportWAV((blob) => downloadFile(blob), 'audio/wav')
  }, 5000)
})

function downloadFile(blob) {
  Recorder.forceDownload(blob)
}

function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
}

navigator.getUserMedia(constraints, successCallback, errorCallback);
