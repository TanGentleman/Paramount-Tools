browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received request: ", request);
    const lastWatchedEpisode = localStorage.getItem("lastWatchedEpisode");
    if (request.greeting === "hello")
        sendResponse({ farewell: "goodbye" });
//        sendResponse({ farewell: "goodbye" });
});
function
// Retrieve the last watched episode from storage
const lastWatchedEpisode = localStorage.getItem("lastWatchedEpisode");

// Perform action based on the value of lastWatchedEpisode
if (lastWatchedEpisode === "Episode 5") {
  // Run a specific function for Episode 5
  functionForEpisode5();
} else if (lastWatchedEpisode === "Episode 6") {
  // Run a specific function for Episode 6
  functionForEpisode6();
}

safari.extension.addEventListener("message", function (event) {
  if (event.name === "episodeWatched") {
    // Handle the message and store the last watched episode
    const lastWatchedEpisode = event.message.episode;
    // Store the value using localStorage or any other desired storage mechanism
    localStorage.setItem("lastWatchedEpisode", lastWatchedEpisode);
  }
});
