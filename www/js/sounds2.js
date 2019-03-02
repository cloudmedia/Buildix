/**
 * 
 * @param {(string|string[])} sounds Sound File List (without ext)
 * @param {string} sndDir Directory path of sounds (without trailing /)
 * @param {boolean} autoLoad Auto load sounds into DOM
 * @param {string} fileExt File extension for sound list
 * 
 */
class Sounds2
{
    constructor(sounds, sndDir, autoLoad, fileExt)
    {
        // Defaults
        if (typeof sndDir === typeof undefined) sndDir = ".";
        if (typeof autoLoad === typeof undefined) autoLoad = false;
        if (typeof fileExt === typeof undefined) fileExt = 'wav';
        this.className = 'sounds2JS';
        this.sndDir = sndDir;
        this.autoLoad = autoLoad;
        this.fileExt = fileExt;
        this.autoPlay = false;
        this.loaded = [];
        this.playing = null;
        this.volume = 1;
        if (autoLoad)
        {
            if (Object.prototype.toString.call(sounds) === '[object Array]')
            {
                for (var i = 0; i < sounds.length; i++)
                {
                    this.load(sounds[i]);
                }
            }else{
                    this.load(sounds);
            }
        }
        this.sounds = sounds;
        return true;
    }

    setFileExt(e)
    {
        this.fileExt = e;
        return true;
    }

    setAutoPlay(bool)
    {
        this.autoPlay = bool;
        return true;
    }

    setVolume(v)
    {
        this.volume = v;
        return true;
    }

    load(s, autoPlay)
    {
        if (typeof autoPlay === typeof undefined) autoPlay = false;
        if (this.autoPlay) autoPlay = true;
        var snd_f = this.sndDir + "/" + s;
        if (this.fileExt.length > 0) snd_f = snd_f + '.' + this.fileExt;
        var snd = document.createElement('audio');
        snd.setAttribute('src', snd_f);
        if (this.autoPlay) snd.setAttribute('autoplay', true);
        snd.setAttribute('class', this.className);
        this[s] = snd;
        this.loaded.push(s);
        return true;
    }

    play(s)
    {
        var play = this[s];
        if (this.playing)
        {
            if (this.playing == play)
            {
                this.playing.pause();
                this.playing.currentTime = 0;
            }
        }
        play.volume = this.volume;
        const prom = play.play();
        if (prom !== null)
        {
            prom.catch(() => {
                play.play();
            });
        }
        this.playing = play;
        return true;
    }

    destroy(s)
    {
        this[s].parentNode.removeChild(this[s]);
    }
}