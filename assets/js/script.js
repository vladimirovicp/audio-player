// Audio

import playList from './playList.js';



let playNum = 0;
let isPlay = false;
const player = document.querySelector('.player');
const audio = new Audio();
const playBtn = player.querySelector('.play');
const playPrevBtn = player.querySelector('.play-prev');
const playNextBtn = player.querySelector('.play-next');

const playListContainer = player.querySelector('.play-list');

const playerTimeline = player.querySelector(".player-timeline");

const playerCurrent = player.querySelector(".player-current");
const playerLength = player.querySelector(".player-length");

const progressBar = player.querySelector('.player-progress');

const playerName = player.querySelector('.player-name');
const playerNameAuthor = playerName.querySelector('.player-name__author');
const playerNameTitle = playerName.querySelector('.player-name__title');
let currentTime = 0;

const album = document.querySelector('.player__img');
const albumImg = album.querySelector('img');

function playAudio() {
    if(!isPlay){
        isPlay = true;
        audio.src = playList[playNum].src;
        audio.currentTime = currentTime;
        audio.play();
        playBtn.classList.add("pause");

        let elements = playListContainer.querySelectorAll('li');
        for (let elem of elements) {
            elem.classList.remove('item-active');
            const elemIconUse = elem.querySelectorAll('.playback-icons use');
            elemIconUse[0].classList.remove('hidden');
            elemIconUse[1].classList.add('hidden');
        }
        elements[playNum].classList.add('item-active');

        const elemTruIconUse = elements[playNum].querySelectorAll('.playback-icons use');
        elemTruIconUse[0].classList.add('hidden');
        elemTruIconUse[1].classList.remove('hidden');

        playerLength.textContent = playList[playNum].duration;

        //playerName.textContent =  playList[playNum].author + ': ' + playList[playNum].title;

        playerNameAuthor.textContent = playList[playNum].author
        playerNameTitle .textContent =  playList[playNum].title;

        albumImg.src = playList[playNum].img;
        albumImg.alt = playList[playNum].title;

    } else{
        isPlay = false;
        currentTime = audio.currentTime;
        audio.pause();
        playBtn.classList.remove("pause");

        //playNum
        let elements = playListContainer.querySelectorAll('li');
        const elemTruIconUse = elements[playNum].querySelectorAll('.playback-icons use');
        elemTruIconUse[0].classList.remove('hidden');
        elemTruIconUse[1].classList.add('hidden');
    }
}

playBtn.addEventListener('click', playAudio);

//

function playNext(){
    playNum < playList.length - 1 ? playNum++ : playNum=0;
    isPlay = false;
    currentTime = 0;
    playAudio();
}

function playPrev(){
    playNum <= 0 ? playNum = playList.length - 1 : playNum--;
    isPlay = false;
    currentTime = 0;
    playAudio();
}


playPrevBtn.addEventListener('click', playPrev);
playNextBtn.addEventListener('click', playNext);



playList.forEach(el => {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.setAttribute('data-track', el.track);
    li.innerHTML = el.title +
        `        <button class="player__button toggle" title="Toggle Play">
                        <svg class="playback-icons">
                            <use href="#play-icon"></use>
                            <use class="hidden" href="#pause"></use>
                        </svg>
                    </button>
            `;
    playListContainer.append(li);
});


const playItems = playListContainer.querySelectorAll('.play-item');

playItems.forEach( playItem => {
    playItem.addEventListener('click', (e) =>{
        e.preventDefault()
        let item = e.target.closest('.play-item')
        // console.log(item.dataset.track);

        if( playNum === parseInt(item.dataset.track)){
            playAudio();
        } else {
            isPlay = false;
            currentTime = 0;
            // audio.currentTime = 0;
            playNum = parseInt(item.dataset.track);
            playAudio();
        }
    });
});

// обрабатываем прогресс
function handleAudioProgress() {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

function initializeAudio() {
    const audioDuration = Math.round(Audio.duration);
    const time = formatTime(audioDuration);

    playerLength.innerText = `${time.minutes}:${time.seconds}`;
    playerLength.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`)
}

function formatTime(timeInSeconds) {
    const result = new Date(timeInSeconds * 1000).toISOString().substring(11, 19);
    return {
        minutes: result.substring(3, 5),
        seconds: result.substring(6, 8),
    };
};



//слушаем событие обновление времени
audio.addEventListener('timeupdate', handleAudioProgress);


//обновим время, прошедшее с момента
function updateTimePlayerElapsed() {
    const time = formatTime(Math.round(audio.currentTime));
    playerCurrent.textContent = `${time.minutes}:${time.seconds}`;

    if( audio.currentTime === audio.duration){
        playNum < playList.length - 1 ? playNum++ : playNum=0;
        isPlay = false;
        currentTime = 0;
        audio.currentTime = 0;
        setTimeout(() => {
            playAudio();
        }, 1000);

    }
}


function scrub(e) {

    // console.log(audio.duration)
    // console.log(!NaN)

    if (!audio.duration){
        alert('Выберите трек!');
    } else{
        const scrubTime = (e.offsetX / playerTimeline.offsetWidth) * audio.duration;
        audio.currentTime = scrubTime;
        currentTime = scrubTime;
    }


    // console.log(audio.currentTime);
}

audio.addEventListener('timeupdate', updateTimePlayerElapsed);


let mousedown = false;
playerTimeline.addEventListener('click', scrub);

playerTimeline.addEventListener('mousedown', (e) => mousedown && scrub(e));
playerTimeline.addEventListener('mousedown', () => mousedown = true);
playerTimeline.addEventListener('mouseup', () => mousedown = false);



const volumeControls = player.querySelector('.volume-controls');
const volume = volumeControls.querySelector('.volume');
const volumeButton = player.querySelector('#volume-button');
const volumeIcons = volumeButton.querySelectorAll('.volume-button use');
const volumeMute = volumeButton.querySelector('use[href="#volume-mute"]');
const volumeLow = volumeButton.querySelector('use[href="#volume-low"]');
const volumeHigh = volumeButton.querySelector('use[href="#volume-high"]');


function updateVolume() {
    if (audio.muted) {
        audio.muted = false;
    }
    audio.volume = volume.value;
}

function updateVolumeIcon() {
    volumeIcons.forEach(icon => {
        icon.classList.add('hidden');
    });

    volumeButton.setAttribute('data-title', 'Mute (m)')

    if (audio.muted || audio.volume === 0) {
        volumeMute.classList.remove('hidden');
        volumeButton.setAttribute('data-title', 'Unmute (m)')
    } else if (audio.volume > 0 && audio.volume <= 0.5) {
        volumeLow.classList.remove('hidden');
    } else {
        volumeHigh.classList.remove('hidden');
    }
}


function toggleMute() {
    audio.muted = !audio.muted;

    if (audio.muted) {
        volume.setAttribute('data-volume', volume.value);
        volume.value = 0;
    } else {
        volume.value = volume.dataset.volume;
    }

    updateVolumeIcon();
}

volume.addEventListener('input', updateVolume);
// audio.addEventListener('volumechange', updateVolumeIcon);
volumeButton.addEventListener('click', toggleMute);






