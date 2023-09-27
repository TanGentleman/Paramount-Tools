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

async function main() {
 await selectSeason();
 const delayTime = getRandomDelay(500, 1000);
 await delay(delayTime);
 triggerShowMore();
}

if (!window.location.href.includes('https://www.paramountplus.com/shows/survivor/')) {
   console.log("No need to run any scripts here :)");
}
else {
   console.log('Extension active on paramount plus!');
   main();
}
