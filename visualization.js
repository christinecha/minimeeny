var sound;
// var loadSound = loadSound

function preload(){
  sound = loadSound('test.wav')
}

$('#clip').on('updated', function() {
  endShape();
  var soundInput = $('#clip').val()
  $('#player').attr('src', soundInput)
  sound = loadSound(soundInput)
  console.log('changed!', sound)
})

function setup(){
  var cnv = createCanvas(100,100);
  cnv.mouseClicked(togglePlay);
  fft = new p5.FFT();
  sound.amp(0.2);
}

var mouthWidth = 0
var mouthHeight = 0

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
    mouthWidth = 40 + (300 * (pitch / spectrum.length))
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

    mouthHeight = 5 + (peak - original)
    if (mouthHeight >= 20) {
      mouthHeight = 20
    }
  }

  // console.log(peak - original)
  endShape();

  text('click to play/pause', 4, 10);
}

function visualization() {
  // console.log('vis')
  $('.mouth').css('width', mouthWidth + 'px')
  $('.mouth').css('height', mouthHeight + 'px')
}

var tick = setInterval(function() {
  visualization()
}, 20)

// fade sound if mouse is over canvas
function togglePlay() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}
