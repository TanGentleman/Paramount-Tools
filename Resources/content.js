browser.runtime.sendMessage({ greeting: "hello" }).then((response) => {
   console.log("Received response: ", response);
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
   console.log("Received request: ", request);
});


// The season to select
const selectedSeason = 7;

// Function to select the season in the dropdown
function selectSeason() {
  const dropdown = document.getElementById('season_filterDD');
  const seasonOption = dropdown.querySelector(`[data-value="${selectedSeason}"]`);

  if (seasonOption) {
    seasonOption.click();
  } else {
    console.error('Season option not found');
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
