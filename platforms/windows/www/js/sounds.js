// Sounds
var silenceEle;
var sndDir = "sounds/";
var sndSilence = sndDir + "silence.wav";
var sndIntro = sndDir + "intro.wav";
var sndType = sndDir + "type.wav";
var sndAlert1 = sndDir + "alert1.wav";
var sndAlert2 = sndDir + "alert2.wav";
var sndAlert3 = sndDir + "alert3.wav";
var sndDing = sndDir + "ding.wav";
var sndButton = sndDir + "button.wav";
var sndMessage = sndDir + "message.wav";
var sndError = sndDir + "error.wav";
var sndSuccess = sndDir + "success.wav";
var sndSlide = sndDir + "slide.wav";
var sndAHAHAH = sndDir + "nedry.wav";

function playSound(snd)
{
  var old = document.getElementsByClassName('soundsJS');
  while (old[0])
  {
    old[0].parentNode.removeChild(old[0]);
  }
  var ele = document.createElement('audio');
  ele.setAttribute('src', snd);
  ele.setAttribute('autoplay', true);
  ele.setAttribute('class', 'soundsJS');
  ele.play();
}