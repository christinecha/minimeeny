var root = this;

// Get the SpeechRecognition object, while handling browser prefixes
var SpeechRecognition = root.SpeechRecognition ||
                        root.webkitSpeechRecognition ||
                        root.mozSpeechRecognition ||
                        root.msSpeechRecognition ||
                        root.oSpeechRecognition;

var recognizing;
var recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interim = true;
reset();
recognition.onend = reset;

var button = document.getElementById("button")

recognition.onresult = function (event) {
  var final = "";
  var interim = "";
  for (var i = 0; i < event.results.length; ++i) {
    if (event.results[i].final) {
      final += event.results[i][0].transcript;
    } else {
      interim += event.results[i][0].transcript;
    }
  }
}

function reset() {
  recognizing = false;
  button.innerHTML = "Click to Speak";
}

function toggleStartStop() {
  if (recognizing) {
    recognition.stop();
    reset();
  } else {
    recognition.start();
    recognizing = true;
    button.innerHTML = "Click to Stop";
  }
}
