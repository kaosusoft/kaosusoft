window.addEventListener("keydown", onKeyDown, false);

function onKeyDown(e)
{
	var volume = soundSystem.volume;
	
	switch(e.keyCode)
	{
		case 38: // UP
			volume += 0.1;
			if(volume > 1)
			{
				volume = 1;
			}
			soundSystem.SetVolume(volume);
			break;
		case 40: // DOWN
			volume -= 0.1;
			if(volume < 0)
			{
				volume = 0;
			}
			soundSystem.SetVolume(volume);
			break;
	};
}

function SoundSystem()
{
	this.isLoadComplete = false;
	this.nowResourceLoadedCount = 0;
	this.intAllResourceCount = 0;
	this.volume = 1;
	this.arrSounds = new Array();
	this.backgroundMusic = undefined;
	return this;
}

SoundSystem.prototype.AddSound = function(fileName, resourceCount)
{
	var SOUND_RESOURCE_MAX = 8;
	
	if(resourceCount == undefined)
	{
		resourceCount = SOUND_RESOURCE_MAX;
	}
	
	for(var i=0; i<resourceCount; i++){
		var soundMusic = new Audio();
		soundMusic.src = fileName;
		soundMusic.volume = this.volume;
		soundMusic.isPlayed = false;
		
		soundMusic.addEventListener("canplaythrough", onLoadSoundComplete, false);
		soundMusic.addEventListener("ended", function()
		{
			if(window.chrome) this.load();
			this.pause();
		}, false);
		
		document.body.appendChild(soundMusic);
		
		this.arrSounds.push({name: fileName, sound: soundMusic, isPlayed: false});
		this.intAllResourceCount++;
	}
}

SoundSystem.prototype.PlaySound = function(fileName)
{
	for(var i=0; i<this.arrSounds.length; i++)
	{
		if(this.arrSounds[i].name == fileName)
		{
			if(this.arrSounds[i].sound.ended == true || this.arrSounds[i].sound.isPlayed == false)
			{
				if(this.arrSounds[i].sound.paused)
				{
					this.arrSounds[i].sound.volume = this.volume;
					this.arrSounds[i].sound.play();
					this.arrSounds[i].isPlayed = true;
					break;
				}
			}
		}
	}
}

SoundSystem.prototype.PlayBackgroundMusic = function(fileName)
{
	if(this.backgroundMusic)
	{
		this.backgroundMusic.sound.pause();
		this.backgroundMusic.isPlayed = false;
		this.backgroundMusic = undefined;
	}
	
	for(var i = 0; i < this.arrSounds.length; i++)
	{
		if(this.arrSounds[i].name == fileName)
		{
			var backgroundMusic = this.arrSounds[i];
			backgroundMusic.sound.pause();
			if(window.chrome) backgroundMusic.sound.load();
			backgroundMusic.sound.loop = true;
			backgroundMusic.isPlayed = true;
			backgroundMusic.sound.play();
			
			this.backgroundMusic = backgroundMusic;
		}
	}
}

SoundSystem.prototype.SetVolume = function(volume)
{
	for(var i = 0; i< this.arrSounds.length; i++)
	{
		this.arrSounds[i].sound.volume = volume;
	}
}

function onLoadSoundComplete()
{
	soundSystem.nowResourceLoadedCount++;
	if(soundSystem.nowResourceLoadedCount <= soundSystem.intAllResourceCount)
	{
		soundSystem.isLoadComplete = true;
	}
}

var soundSystem = new SoundSystem();
