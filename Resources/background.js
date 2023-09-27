// browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   console.log("Received request: ", request);
//   let episode;
//   // const lastWatchedEpisode = Fetch current episode here from local storage or somehow
//   safari.extension.settings.lastWatchedEpisode = "Episode 1";
//   const lastWatchedEpisode = safari.extension.settings.lastWatchedEpisode;
//   if (lastWatchedEpisode) {
//       episode = lastWatchedEpisode;
//   }
//   else {
//       episode = "Episode 1";
//   }
//   // send episode
//   if (request.greeting === "hello")
//       sendResponse({ farewell: episode });
// //        sendResponse({ farewell: "goodbye" });
// });

