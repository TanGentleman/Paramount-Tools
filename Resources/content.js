// The season to select
const selectedSeason = 15;

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

async function delayAndClick() {
  const delayTime = getRandomDelay(1200, 1500);
  console.log(`Delaying ${delayTime}ms`);
  await delay(delayTime);
  const success = clickPlayer();
  return success;
}

async function playButton() {
  let success = false;
  for (let i = 0; i < 3; i++) {
    const delayTime = getRandomDelay(1200, 1500);
    console.log(`Delaying ${delayTime}ms`);
    await delay(delayTime);
    success = clickPlayer();
    if (!success) {
      break;
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
function addButton () {
    const newButton = document.createElement('button');
    newButton.textContent = 'Play next episode';
    newButton.addEventListener('click', playNextEpisode);
    
    // Style the button
    newButton.style.position = 'fixed';
    newButton.style.top = '20px';
    newButton.style.right = '20px';
    newButton.style.zIndex = '999';
    
    // Append the next episode button to your HTML
    const menuContainer = document.querySelector('.top-menu-hint.menu-link-container');
    if (menuContainer) {
      const parentContainer = menuContainer.parentNode;
      parentContainer.insertBefore(newButton, menuContainer.nextSibling);
      console.log('Next episode button added');
    } 
    else {
      console.log('Menu container not found');
    }
}
async function onVideo() {
	console.log('enjoy video :)');
	const delayTime = getRandomDelay(1200, 1500);
	console.log(`Delaying ${delayTime}ms`);
	await delay(delayTime);
	await playButton();
	// Create a new button element
	addButton();
}

function isUserSignedIn() {
  const button = document.querySelector('.current-userprofile-anchor');
  if (button !== null) {
    return true;
  }
  return false;
}


if (window.location.href.includes('https://www.paramountplus.com/shows/video/')) {
  onVideo()
	// document.addEventListener('click', () => console.log('u clicked'));
}

else if (window.location.href.includes('https://www.paramountplus.com/shows/survivor/')) {
  // should check if signed in, then load config
  if (isUserSignedIn()) {
    console.log(`User is signed in! Setting survivor season ${selectedSeason}.`);
    selectSeasonAndExpand();
  } 
  else {
    console.log('User is not signed in');
  }
}
else {
	console.log("No need to run any scripts here :)");
}

