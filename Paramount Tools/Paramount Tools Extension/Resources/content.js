/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
// Adjust these for your preference!
const CURRENT_SHOW = 'survivor'; // Must be the exact show name from the URL
const CURRENT_SEASON = 17;

// CONFIGURATION CONSTANTS
const BASE_URL = 'https://www.paramountplus.com';
const DEFAULT_SHOW = 'survivor';
const VALID_SHOW_URL = `${BASE_URL}/shows/${
	CURRENT_SHOW?.length < 50 ? CURRENT_SHOW : DEFAULT_SHOW
}`;
const VALID_VIDEO_URL = `${BASE_URL}/shows/video`;

// Generate a random delay between min and max (inclusive)
function getRandomDelay(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

async function delay(ms) {
	// eslint-disable-next-line no-promise-executor-return
	await new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForElement(selector, maxRetries = 1, byID = false) {
	// Returns the element if found in up to maxRetries times, otherwise returns null
	// Waits a random delay between 400 and 600 ms between retries
	let retries = 0;
	while (retries < maxRetries) {
		const element = byID ? document.getElementById(selector) : document.querySelector(selector);
		if (element) {
			return element;
		}
		retries+=1;
		const delayTime = getRandomDelay(400, 600);
		await delay(delayTime);
	}
	if (maxRetries > 1) console.log('Element not found after maximum retries.');
	return null;
}

async function triggerShowMore() {
	const showMoreButton = await waitForElement(
		'.button.secondary.focusable.load-more-button.js-load-more',
	);
	if (showMoreButton) {
		showMoreButton.click();
	}
	else {
		console.log('Show More button not found');
	}
}

async function checkSeason() {
	// returns season like -> "Season 7"
	const button = await waitForElement('button[title="Drop down button for season filter"]');

	if (!button) {
		console.log('season number element not found');
		return null;
	}
	try {
		const buttonSeason = button.textContent.trim();
		console.log(`Current season: ${buttonSeason}`);
		return buttonSeason;
	}
	catch (e) {
		console.log('buttonSeason text content not found');
		return null;
	}
}
// Function to select the season in the dropdown
async function selectSeason() {
	// if default season does not match desired season, select season option
	const defaultSeason = 1;
	// choose CURRENT_SEASON if that is a valid int > 0, otherwise choose 1
	const seasonChoice = CURRENT_SEASON > 0 ? CURRENT_SEASON : defaultSeason;

	if (await checkSeason() === `Season ${seasonChoice}`) {
		console.log('correct season already selected.');
		return seasonChoice;
	}
	console.log('changing season now.');
	const dropdown = await waitForElement('season_filterDD', 1, true);
	const seasonButton = dropdown?.querySelector(`[data-value="${seasonChoice}"]`);
	if (seasonButton) {
		seasonButton.click();
		return seasonChoice;
	}
		console.log('Season option not found. Beep!');
		return seasonChoice;
	
}

async function selectSeasonAndExpand() {
	const seasonNumber = selectSeason();
	if (seasonNumber > 10) {
		const delayTime = getRandomDelay(300, 500);
		await delay(delayTime);
		triggerShowMore();
		console.log('Season expanded')
	}
}

async function videoLoaded() {
	const nextButton = document.getElementById('nextButton');
	if (nextButton) {
		console.log('Script already injected. Do you still need to press play?');
		return true;
	}
	// should i change below lines?
	const button = await waitForElement('.controls-bottom-btn');
	// see if button is disabled
	if (button) {
		if (button.classList.contains('disabled')) {
			console.log('Video is not loaded');
			return false;
		}
		return true;
	}
	return false;
}

async function playButton() {
	if (await videoLoaded()) {
		console.log('Video already loaded');
		// DOUBLE CHECK WHAT HAPPENS HERE IF VIDEO IS ALREADY LOADED
		return true;
	}
	let count = 0;
	for (let i = 0; i < 8; i+=1) {
		const playButtonFrame = await waitForElement('.start-panel-click-overlay');
		if (playButtonFrame) {
			playButtonFrame.click();
			count+=1;
		}
		else {
			console.log('Play div panel not found');
		}
		if (count >= 2) {
			if (await videoLoaded()) {
				console.log('Video loaded');
				return true;
			}
		}
		const delayTime = getRandomDelay(600, 700);
		await delay(delayTime);
	}
	return false;
}

// Function to fetch subTitle text
async function fetchSubTitle() {
	const subTitleElement = await waitForElement(
		'.movie__sub-metadata .subTitle',
	);
	if (subTitleElement) {
		return subTitleElement.textContent;
	}
		console.log('subTitle not found');
		return null;
	
}
async function clickEpisode(episode, direction) {
	// direction can be 'next' or 'last'
	// episode is the current episode number
	let episodeNumber;
	let episodeText;
	if (direction === 'next') {
		episodeNumber = episode + 1;
		episodeText = `Episode ${episodeNumber}`;
	}
	else if (direction === 'last') {
		if (episode === 1) {
			console.log('Already on the first episode');
			return null;
		}
		episodeNumber = episode - 1;
		episodeText = `Episode ${episodeNumber}`;
	}
	else {
		console.log('Invalid direction');
		return null;
	}
	console.log(episodeText);
	const episodeElement = await waitForElement(`abbr[title="${episodeText}"]`);
	if (episodeElement) {
		const parentLink = episodeElement.closest('a');
		if (parentLink) {
			parentLink.click();
			return true;
		}
		console.log('Parent link not found');
		return false;
	}
	console.log('Episode link not found');
	return false;
}

async function getEpisodeNumber() {
	const subTitle = await fetchSubTitle();
	if (subTitle) {
		const match = subTitle.match(/(\d+)/g);
		const [season, episode] = match.map(Number);
		console.log(season, episode);
		return episode;
	}
	console.log('SubTitle not found');
	return null;
}
// Function to find and click the next episode link
async function playNextEpisode() {
	const episode = await getEpisodeNumber();
	if (!episode) {
		console.log('Episode not found, cannot play next episode');
		return null;
	}
	if (episode >= 10) {
		await triggerShowMore();
		const delayTime = getRandomDelay(1000, 1500);
		await delay(delayTime);
	}
	const success = await clickEpisode(episode, 'next');
	console.log(`Episode ${episode} clicked: ${success}`);
	return null;
}

async function playLastEpisode() {
	const episode = await getEpisodeNumber();
	if (!episode) {
		console.log('Episode not found, cannot play last episode');
		return null;
	}
	if (episode >= 10) {
		await triggerShowMore();
		const delayTime = getRandomDelay(1000, 1500);
		await delay(delayTime);
	}
	const success = await clickEpisode(episode, 'last');
	console.log(`Episode ${episode} clicked: ${success}`);
	return null;
}

// PREREQ ELEMENTS:
// const parentElement = document.querySelector('.controls-bottom-right');
// const volumeButton = parentElement.querySelector('.controls-volume-slider');
async function addNextButton() {
	const button = document.createElement('button');
	button.id = 'nextButton';
	button.classList.add('controls-bottom-btn');
	button.innerHTML =
		'<span style="font-weight: bold; color: white;"> Next    |</span>';
	button.addEventListener('click', playNextEpisode);
	const parentElement = await waitForElement('.controls-bottom-right');
	const volumeButton = parentElement.querySelector('.controls-volume-slider');
	parentElement.insertBefore(button, volumeButton);
}

async function addPreviousButton() {
	const button = document.createElement('button');
	button.id = 'previousButton';
	button.classList.add('controls-bottom-btn');
	button.innerHTML =
		'<span style="font-weight: bold; color: white;">|    Previous</span>';
	button.addEventListener('click', playLastEpisode);
	const parentElement = await waitForElement('.controls-bottom-right');
	const volumeButton = parentElement.querySelector('.controls-volume-slider');
	parentElement.insertBefore(button, volumeButton);
}
	
async function createPlaybackSpeedToggler() {
	const videoPlayer = document.querySelector('video');
	const playbackSpeeds = [1, 1.25, 1.5];
	let currentSpeedIndex = 0;
	const button = document.createElement('button');
	button.classList.add('controls-bottom-btn');
	const buttonText = ' | Speed';
	button.innerHTML = `<span style="font-weight: bold; color: white;">${buttonText}</span>`;
	function togglePlaybackSpeed() {
		currentSpeedIndex = (currentSpeedIndex + 1) % playbackSpeeds.length;
		const currSpeed = playbackSpeeds[currentSpeedIndex];
		videoPlayer.playbackRate = currSpeed;
		console.log(`Playback speed changed to ${currSpeed}x`);
		let tempButtonText = '';
		if (currSpeed !== 1) {
			tempButtonText = ` | Speed: ${currSpeed}x`;
		}
		else {
			tempButtonText = ' | Speed';
		}
		// Modify the innerHTML to include an inline style for positioning
		button.innerHTML = `<span style="font-weight: bold; color: white;">${tempButtonText}</span>`;
	}
	button.addEventListener('click', togglePlaybackSpeed);
	const parentElement = document.querySelector(
		'.controls-bottom-center-wrapper',
	);
	const fastForwardButton = parentElement.querySelector('.btn-fast-forward');
	parentElement.insertBefore(button, fastForwardButton.nextSibling);
}

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
		const subtitlesButton = document.querySelector(
			'.top-menu-btn.btn-audio-cc',
		);
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
	const englishSelected =
		englishButton.getAttribute('aria-selected') === 'true';
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

async function subtitleReplacer() {
	const subtitlesButton = document.querySelector(
		'.top-menu-btn.btn-audio-cc',
	);
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
		console.log(`Error replacing subtitles button:${  e}`);
	}
}
async function handleClick() {
	// Handle the click event here
	console.log('Document clicked!');
	// Remove the event listener after it has been triggered
	document.removeEventListener('click', handleClick);
	if (await videoLoaded()) {
		return;
	}
	startVideo();
}
async function startVideo() {
	// Try to make sure player is fully loaded before this stuff?
	if (await videoLoaded()) {
		console.log('Video already loaded');
		return;
	}
	console.log('Beginning function startVideo!');
	const vidStarted = await playButton();
	if (!vidStarted) {
		console.log('Video did not start, setting a handleClick function.');
		// maybe make a backup click event with the rest of the functions here?
		document.addEventListener('click', handleClick);
		return;
	}

	// check if all prerequisite elements exist

	// Create a new button element
	await addNextButton();
	await addPreviousButton();
	await createPlaybackSpeedToggler();
	console.log('Starting sub button');
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

async function onVideoPage() {
	if (await videoLoaded()) {
		console.log('Video already loaded');
		return;
	}
	const foundVid = await waitForElement('.start-panel-big-play-button', 12);
	if (foundVid) {
		const delayTime = getRandomDelay(1500, 2000);
		console.log(`Delaying ${delayTime}ms`);
		await delay(delayTime);
		startVideo();
	}
	else {
		console.log('Video not found');
		document.addEventListener('click', handleClick);
	}
}

if (window.location.href.includes(VALID_VIDEO_URL)) {
	onVideoPage();
}
 else if (window.location.href.includes(VALID_SHOW_URL)) {
	if (isUserSignedIn()) {
		console.log(`User is signed in! Setting season.`);
		selectSeasonAndExpand();
	}
 else {
		console.log('User is not signed in.');
	}
}
 else {
	console.log('No need to run any scripts here :)');
}

// Do not allow running script duplicate times!
