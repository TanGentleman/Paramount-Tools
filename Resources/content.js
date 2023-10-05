// The season to select
const selectedSeason = 9;

function checkSeason() {
 // returns season like -> "Season 7"
 const button = document.querySelector('.filter.js-filter');
 if (!button) {
   console.log('Season button not found');
   return null;
 }
 try {
   const buttonSeason = button.textContent.trim();
   console.log(`Current season: ${buttonSeason}`)
   return buttonSeason;
 }
 catch (e) {
   console.log('buttonSeason text content not found');
   return null;
 }
}
// Function to select the season in the dropdown
function selectSeason() {
 const dropdown = document.getElementById('season_filterDD');
 // if default season does not match desired season, select season option
 if (checkSeason() === `Season ${selectedSeason}`) {
	 console.log("correct season already selected.");
   return;
 }
console.log("selecting season now.");
 const seasonOption = dropdown.querySelector(`[data-value="${selectedSeason}"]`);
 if (seasonOption) {
   seasonOption.click();
 } else {
   console.log('Season option not found');
 }
}

// Function to trigger "Show More" button click after a random delay
function triggerShowMore() {
 const showMoreButton = document.querySelector('.button.secondary.focusable.load-more-button.js-load-more');

 if (showMoreButton) {
   showMoreButton.click();
 } else {
   console.error('Show More button not found');
 }
}

// Generate a random delay between min and max (inclusive)
function getRandomDelay(min, max) {
 return Math.floor(Math.random() * (max - min + 1) + min);
}
function delay(ms) {
 return new Promise(resolve => setTimeout(resolve, ms));
}

async function selectSeasonAndExpand() {
	selectSeason();
	const delayTime = getRandomDelay(500, 1000);
	await delay(delayTime);
	triggerShowMore();
}
// Find the main play button element
function clickPlayer() {
	const player = document.querySelector('div.start-panel-click-overlay');
	if (!player) {
		console.log("Player element not found");
		return false;
	}
	player.click();
	return true;
  }

async function playButton() {
  let success = false;
  for (let i = 0; i < 6; i++) {
    success = clickPlayer();
    const delayTime = getRandomDelay(500, 700);
    if (success) {
        await delay(delayTime);
        console.log(`Delaying ${delayTime}ms`);
    }
    else {
        console.log('Play button not found');
        // break;
    }
  }
  return success;
}

function triggerShowMore() {
    const showMoreButton = document.querySelector('.button.secondary.focusable.load-more-button.js-load-more');

    if (showMoreButton) {
        showMoreButton.click();
    } else {
        console.log('Show More button not found');
    }
}


// Function to fetch subTitle text
function fetchSubTitle() {
    const subTitleElement = document.querySelector('.movie__sub-metadata .subTitle');
    if (subTitleElement) {
        return subTitleElement.textContent;
    } else {
        console.log('subTitle not found');
        return null;
    }
}

function clickNextEpisode(episode) {
    const nextEpisodeNumber = episode + 1;
    const nextEpisode = `Episode ${nextEpisodeNumber}`;
    console.log(nextEpisode);
    const nextEpisodeElement = document.querySelector(`abbr[title="${nextEpisode}"]`);
    if (nextEpisodeElement) {
        // Find the parent a element and click it
        const parentLink = nextEpisodeElement.closest('a');
        if (parentLink) {
            parentLink.click();
        } else {
            console.log('Parent link not found');
        }
    } 
    else {
        console.log('Next episode link not found');
    }
}

// Function to find and click the next episode link
function playNextEpisode() {
    const subTitle = fetchSubTitle();
    if (subTitle) {
        const match = subTitle.match(/(\d+)/g);
        const [season, episode] = match.map(Number);
        console.log(season, episode)
        if (episode >= 10) {
            triggerShowMore();
            const delay = getRandomDelay(1000, 1500);
            setTimeout(() => {
                clickNextEpisode(episode);
            }, delay);
        } else {
            clickNextEpisode(episode);
        }
    } else {
        console.log('SubTitle not found');
    }
}

async function addNextButton () {
    const button = document.createElement('button');
    button.classList.add('controls-bottom-btn');
    button.innerHTML = '<span style="font-weight: bold; color: white;"> Next</span>';
    button.addEventListener('click', playNextEpisode);
    const parentElement = document.querySelector('.controls-bottom-right');
    const volumeButton = parentElement.querySelector('.controls-volume-slider');
    parentElement.insertBefore(button, volumeButton);
}

async function checkPlayButtonExistenceWithRetries(maxRetries) {
    let retries = 0;
    while (retries < maxRetries) {
        const button = document.querySelector('.top-menu-btn.btn-audio-cc');
        if (button) {
            return true;
        }
        retries++;
        const delayTime = getRandomDelay(400, 600);
        await delay(delayTime);
    }
    console.log('Element not found after maximum retries.');
    return false;
}
async function onVideo() {
    await checkPlayButtonExistenceWithRetries(6);
    await delay(1000)
    // Try to make sure player is fully loaded before this stuff?
	console.log('enjoy video! :)');
	// const delayTime = getRandomDelay(1500, 2000);
	// console.log(`Delaying ${delayTime}ms`);
	// await delay(delayTime);
	await playButton();
	// Create a new button element
	await addNextButton();
  	await createPlaybackSpeedToggler();
    console.log('Starting sub button')
    const subtitlesButton = document.querySelector('.top-menu-btn.btn-audio-cc');
    const clonedButton = subtitlesButton.cloneNode(true);
    clonedButton.addEventListener('click', toggleSubtitles);
    const parent = document.querySelector('.top-menu-container');
    parent.insertBefore(clonedButton, subtitlesButton.nextSibling);
    subtitlesButton.style.display = 'none';
}

function isUserSignedIn() {
  const button = document.querySelector('.current-userprofile-anchor');
  if (button !== null) {
    return true;
  }
  return false;
}
async function createPlaybackSpeedToggler() {
  const videoPlayer = document.querySelector('video');
  const playbackSpeeds = [1, 1.25, 1.5];
  let currentSpeedIndex = 0;

  function togglePlaybackSpeed() {
	// set 
    currentSpeedIndex = (currentSpeedIndex + 1) % playbackSpeeds.length;
    videoPlayer.playbackRate = playbackSpeeds[currentSpeedIndex];
    console.log(`Playback speed changed to ${playbackSpeeds[currentSpeedIndex]}`);
  }

  const button = document.createElement('button');
  button.classList.add('controls-bottom-btn');
  button.innerHTML = '<span style="font-weight: bold; color: white;"> Speed</span>';
  button.addEventListener('click', togglePlaybackSpeed);

  const parentElement = document.querySelector('.controls-bottom-center-wrapper');
  const fastForwardButton = parentElement.querySelector('.btn-fast-forward');
  parentElement.insertBefore(button, fastForwardButton.nextSibling);
}


async function toggleSubtitles() {
    const closeButton = document.querySelector('.audio-cc-panel-btn-close');
    const offButton = document.getElementById('off-btn');
    const englishButton = document.getElementById('english-btn');

    const offSelected = offButton.getAttribute('aria-selected') === 'true';
    const englishSelected = englishButton.getAttribute('aria-selected') === 'true';
    // check if they're the same
    if (offSelected === true) {
        console.log('Subtitles are off, toggling to English');
        englishButton.click();
    }
    else if (englishSelected === true) {
        console.log('Subtitles are English, toggling to Off');
        offButton.click();
    }
    else {
        console.log('Subtitles are neither Off or English, something is wrong');
    }
    const delayTime = getRandomDelay(300, 500);
    await delay(delayTime);

    // console.log('Subtitles toggled to ' + (englishSelected ? 'English' : 'Off'));
    closeButton.click();
};

if (window.location.href.includes('https://www.paramountplus.com/shows/video/')) {
  onVideo();
}

else if (window.location.href.includes('https://www.paramountplus.com/shows/survivor/')) {
  // should check if signed in, then load config
  if (isUserSignedIn()) {
    console.log(`User is signed in! Setting survivor season ${selectedSeason}.`);
    selectSeasonAndExpand();
  } 
  else {
    console.log('User is not signed in.');
  }
}
else {
	console.log("No need to run any scripts here :)");
}

