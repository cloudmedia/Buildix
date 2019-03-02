// Sounds.js
var sndDir = "sounds/";
//
var sndSilence_f = sndDir + "silence.wav";
var sndSilence = document.createElement('audio');
sndSilence.setAttribute('src', sndSilence_f);
//sndSilence.setAttribute('autoplay', false);
sndSilence.setAttribute('class', 'soundsJS');
//
var sndIntro_f = sndDir + "intro.wav";
var sndIntro = document.createElement('audio');
sndIntro.setAttribute('src', sndIntro_f);
//sndIntro.setAttribute('autoplay', false);
sndIntro.setAttribute('class', 'soundsJS');
//
var sndType_f = sndDir + "type.wav";
var sndType = document.createElement('audio');
sndType.setAttribute('src', sndType_f);
//sndType.setAttribute('autoplay', false);
sndType.setAttribute('class', 'soundsJS');
//
var sndAlert1_f = sndDir + "alert1.wav";
var sndAlert1 = document.createElement('audio');
sndAlert1.setAttribute('src', sndAlert1_f);
//sndAlert1.setAttribute('autoplay', false);
sndAlert1.setAttribute('class', 'soundsJS');
//
var sndAlert2_f = sndDir + "alert2.wav";
var sndAlert2 = document.createElement('audio');
sndAlert2.setAttribute('src', sndAlert2_f);
//sndAlert2.setAttribute('autoplay', false);
sndAlert2.setAttribute('class', 'soundsJS');
//
var sndAlert3_f = sndDir + "alert3.wav";
var sndAlert3 = document.createElement('audio');
sndAlert3.setAttribute('src', sndAlert3_f);
//sndAlert3.setAttribute('autoplay', false);
sndAlert3.setAttribute('class', 'soundsJS');
//
var sndDing_f = sndDir + "ding.wav";
var sndDing = document.createElement('audio');
sndDing.setAttribute('src', sndDing_f);
//sndDing.setAttribute('autoplay', false);
sndDing.setAttribute('class', 'soundsJS');
//
var sndButton_f = sndDir + "button.wav";
var sndButton = document.createElement('audio');
sndButton.setAttribute('src', sndButton_f);
//sndButton.setAttribute('autoplay', false);
sndButton.setAttribute('class', 'soundsJS');
//
var sndMessage_f = sndDir + "message.wav";
var sndMessage = document.createElement('audio');
sndMessage.setAttribute('src', sndMessage_f);
//sndMessage.setAttribute('autoplay', false);
sndMessage.setAttribute('class', 'soundsJS');
//
var sndError_f = sndDir + "error.wav";
var sndError = document.createElement('audio');
sndError.setAttribute('src', sndError_f);
//sndError.setAttribute('autoplay', false);
sndError.setAttribute('class', 'soundsJS');
//
var sndSuccess_f = sndDir + "success.wav";
var sndSuccess = document.createElement('audio');
sndSuccess.setAttribute('src', sndSuccess_f);
//sndSuccess.setAttribute('autoplay', false);
sndSuccess.setAttribute('class', 'soundsJS');
//
var sndSlide_f = sndDir + "slide.wav";
var sndSlide = document.createElement('audio');
sndSlide.setAttribute('src', sndSlide_f);
//sndSlide.setAttribute('autoplay', false);
sndSlide.setAttribute('class', 'soundsJS');
//
var sndAHAHAH_f = sndDir + "nedry.wav";
var sndAHAHAH = document.createElement('audio');
sndAHAHAH.setAttribute('src', sndAHAHAH_f);
//sndAHAHAH.setAttribute('autoplay', false);
sndAHAHAH.setAttribute('class', 'soundsJS');
//
function playSound(snd) {
  /**
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
  */
  snd.play();
}