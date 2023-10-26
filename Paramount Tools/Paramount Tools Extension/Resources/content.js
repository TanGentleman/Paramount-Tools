// The season to select
const selectedSeason = 16;

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
async function clickPlayer(count) {
	if (count === 3) {
		console.log("I think it's done! Stop checking.");
		return null;
	}
	const player = document.querySelector('div.start-panel-click-overlay');
	if (!player) {
		console.log("Player element not found");
		return false;
	}
	else {
		player.click();
		console.log('Clicked player')
		return true;
	}
}

async function playButton() {
	// this function needs a way to detect of the video has been fully started
  let videoStarted = document.querySelector('.start-panel-click-overlay');
  if (videoStarted === null) {
		console.log('Video started earlier than expected.');
		return false;
	}
  let success;
  let count = 0
  for (let i = 0; i < 8; i++) {
	success = await clickPlayer(count);
	if (success === null) {
		console.log('Video started!');
		success = true;
		break;
	}
	const delayTime = getRandomDelay(500, 700);
	if (success === true) {
		console.log(`Delaying ${delayTime}ms`);
		count++;
		await delay(delayTime);
	}
	else {
		console.log('Play button missing, trying delay again.');
		await delay(delayTime);
	}
  }
  return success;
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

// PREREQ ELEMENTS:
// const parentElement = document.querySelector('.controls-bottom-right');
// const volumeButton = parentElement.querySelector('.controls-volume-slider');
async function addNextButton () {
	const button = document.createElement('button');
	button.classList.add('controls-bottom-btn');
	button.innerHTML = '<span style="font-weight: bold; color: white;"> Next    |</span>';
	button.addEventListener('click', playNextEpisode);
	const parentElement = document.querySelector('.controls-bottom-right');
	const volumeButton = parentElement.querySelector('.controls-volume-slider');
	parentElement.insertBefore(button, volumeButton);
}

async function checkPlayButtonExistenceWithRetries(maxRetries) {
	let retries = 0;
	while (retries < maxRetries) {
		const button = document.querySelector('.start-panel-big-play-button');
		if (button) {
			return true;
		}
		else {
			retries++;
			const delayTime = getRandomDelay(400, 600);
			await delay(delayTime);
		}
	}
	console.log('Element not found after maximum retries.');
	return false;
}

// PREREQ ELEMENTS:
// const subtitlesButton = document.querySelector('.top-menu-btn.btn-audio-cc');
// const parent = document.querySelector('.top-menu-container');
async function subtitleReplacer() {
	const subtitlesButton = document.querySelector('.top-menu-btn.btn-audio-cc');
	const clonedButton = subtitlesButton.cloneNode(true);
	if (subtitlesButton && clonedButton) {
		console.log('yay!');
	}
	try {
		clonedButton.addEventListener('click', toggleSubtitles);
		const parent = document.querySelector('.top-menu-container');
		parent.insertBefore(clonedButton, subtitlesButton.nextSibling);
		subtitlesButton.style.display = 'none';
		console.log('Subtitles button replaced');
	}
	catch (e) {
		console.log('Error replacing subtitles button:' + e);
	}
}

function handleClick() {
	// Handle the click event here
	console.log('Document clicked!');

	// Remove the event listener after it has been triggered
	document.removeEventListener('click', handleClick);
	startVideo();
  }
  

async function startVideo() {
	// Try to make sure player is fully loaded before this stuff?
	console.log('enjoy video! :)');
	const delayTime = getRandomDelay(1500, 2000);
	console.log(`Delaying ${delayTime}ms`);
	await delay(delayTime);
	await playButton();
	// check if the play button wrapper still exists
	const videoStarted = document.querySelector('.start-panel-click-overlay');
	if (videoStarted !== null) {
		console.log('Video did not start, exiting.');
		// maybe make a backup click event with the rest of the functions here?
		document.addEventListener('click', handleClick);
		return;
	}
	// check if all prerequisite elements exist

	// Create a new button element
	await addNextButton();
	await createPlaybackSpeedToggler();
	console.log('Starting sub button')
	const delayTime2 = getRandomDelay(5000, 6200);
	await delay(delayTime2);
	subtitleReplacer();
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
  const button = document.createElement('button');
  button.classList.add('controls-bottom-btn');
  const buttonText = " | Speed";
  button.innerHTML = `<span style="font-weight: bold; color: white;">${buttonText}</span>`;
  function togglePlaybackSpeed() {
	currentSpeedIndex = (currentSpeedIndex + 1) % playbackSpeeds.length;
	const currSpeed = playbackSpeeds[currentSpeedIndex];
	videoPlayer.playbackRate = currSpeed;
	console.log(`Playback speed changed to ${currSpeed}x`);
	let tempButtonText = "";
	if (currSpeed !== 1) {
		tempButtonText = ` | Speed: ${currSpeed}x`;
	}
	else {
		tempButtonText = " | Speed";
	}
	// Modify the innerHTML to include an inline style for positioning
	button.innerHTML = `<span style="font-weight: bold; color: white;">${tempButtonText}</span>`;
  }
  button.addEventListener('click', togglePlaybackSpeed);
  const parentElement = document.querySelector('.controls-bottom-center-wrapper');
  const fastForwardButton = parentElement.querySelector('.btn-fast-forward');
  parentElement.insertBefore(button, fastForwardButton.nextSibling);
}

// PREREQ ELEMENTS:
// const menuPanel = document.querySelector('.audio-cc-panel-menu-section');
// const subtitlesButton = document.querySelector('.top-menu-btn.btn-audio-cc');
// const closeButton = document.querySelector('.audio-cc-panel-btn-close');
// const offButton = document.getElementById('off-btn');
// const englishButton = document.getElementById('english-btn');
async function toggleSubtitles() {
	// check if in subtitle panel, if not, click it
	const menuPanel = document.querySelector('.audio-cc-panel-menu-section');

	if (menuPanel && menuPanel.classList.contains('show')) {
	// The menu panel is active
		console.log('Menu panel is active');
	}
	else {
	// The menu panel is not active
		console.log('Menu panel is not active');
		const subtitlesButton = document.querySelector('.top-menu-btn.btn-audio-cc');
		subtitlesButton.click();
		await delay(300);
	}

	const closeButton = document.querySelector('.audio-cc-panel-btn-close');
	const offButton = document.getElementById('off-btn');
	
	let englishButton = document.getElementById('english-btn');
	if (englishButton === null) {
		englishButton = document.getElementById('english-(u.s.)-btn');
	}
	
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
}

async function on_video_page() {
	const foundVid = await checkPlayButtonExistenceWithRetries(6);
	if (foundVid) {
		startVideo();
	}
	else {
		console.log('Video not found');
		document.addEventListener('click', handleClick);
		return;
	}
}

if (window.location.href.includes('https://www.paramountplus.com/shows/video/')) {
	on_video_page();
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



// ideas to reorganize:
// Once the play button has been clicked 3 times, check for the existence of all elements.
// Use a while loop to check for the existence of all elements.
// If all elements exist, run the rest of the script.
// Do not allow running script duplicate times!
