var sounds;
var soundVolume = 1;

if (localStorage.getItem('soundVolume'))
{
    soundVolume = localStorage.getItem('soundVolume');
}else{
    localStorage.setItem('soundVolume', soundVolume);
}

sounds = new Sounds2([
    'squeeka',
    'dialex',
    'calculate',
    'compute',
    'pop',
    'reversi',
    'tingdong',
    'swinga',
    'trida',
    'whoop',
    'erroneous',
    'dink',
    'tink',
    'chikaka',
    'schweef',
    'hollowbell',
    'blip',
    'bubble'
], 'sounds2', true, 'mp3');

sounds.setVolume(soundVolume);