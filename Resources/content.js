// The season to select
const selectedSeason = 7;

function checkSeason() {
 // returns season like -> "Season 7"
 const button = document.querySelector('.filter.js-filter');
 if (!button) {
   console.error('Season button not found');
   return null;
 }
 try {
   const buttonSeason = button.textContent.trim(); // Get the text content of the button and remove any leading/trailing whitespace
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

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function delayAndClick() {
  const delayTime = getRandomDelay(1200, 1500);
  console.log(`Delaying ${delayTime}ms`);
  await delay(delayTime);
  const success = clickPlayer();
  return success;
}

async function playButton() {
  const success1 = await delayAndClick();
  const success2 = await delayAndClick();
  const success3 = await delayAndClick();
}
function handleClick() {
	// Find the duration element
	console.log('u clicked');
}
  

if (window.location.href.includes('https://www.paramountplus.com/shows/video/')) {
  console.log('enjoy video :)');
  playButton();
	// document.addEventListener('click', () => console.log('u clicked'));
}

else if (window.location.href.includes('https://www.paramountplus.com/shows/survivor/')) {
	console.log('Detected survivor! Setting season.');
	selectSeasonAndExpand();
}
else {
	console.log("No need to run any scripts here :)");
}

