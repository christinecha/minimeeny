var sound;
// var loadSound = loadSound

function preload(){
  sound = loadSound('test3.wav')
}

$('#clip').on('updated', function() {
  var soundInput = $('#clip').val()
  $('#player').attr('src', soundInput)
  sound.setPath(soundInput)
  console.log('changed!', sound)
})

function setup(){
  var cnv = createCanvas(100,100);
  cnv.mouseClicked(togglePlay);
  fft = new p5.FFT();
  sound.amp(0.2);
}

var mouthWidth = 20
var mouthHeight = 5

function draw(){
  background(0)
  var spectrum = fft.analyze();

  var pitch = 0
  for (var i = 0; i< spectrum.length; i+= 100){
    var x = map(i, 0, spectrum.length, 0, width);
    var h = -height + map(spectrum[i], 0, 255, height, 0);
    pitch += h
  }

  if (Math.abs(pitch / spectrum.length) > 0.1 || Math.abs(pitch / spectrum.length) < 0.01) {
    // not speech pitch
    // console.log(pitch / spectrum.length)
  } else {
    // console.log(pitch / spectrum.length)
    mouthWidth = (800 * (pitch / spectrum.length)) + 30
    if (mouthWidth <= 10) {
      mouthWidth = 10
    }
    var waveform = fft.waveform();

    var peak = 0
    var original = 50.19607843137255

    for (var i = 0; i < waveform.length; i+= 100){
      var x = map(i, 0, waveform.length, 0, width);
      var y = map( waveform[i], -1, 1, 0, height);

      if (y > peak) {
        peak = y
      }
    }

    mouthHeight = 5 + 4 * (peak - original)
    if (mouthHeight >= 20) {
      mouthHeight = 20
    } else if (mouthHeight <= 2) {
      mouthHeight = 2
    }
  }

  // console.log(peak - original)
  endShape();
}

function visualization() {
  console.log('vis')
  $('.mouth').css('width', mouthWidth + 'px')
  $('.mouth').css('height', mouthHeight + 'px')
}

var tick = setInterval(function() {
  visualization()
}, 100)

// fade sound if mouse is over canvas
function togglePlay() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}
