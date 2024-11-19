// Load the current state from storage
chrome.storage.sync.get("isEnabled", (data) => {
  const isEnabled = data.isEnabled || false; // Default to false if not set
  const checkbox = document.getElementById("always-available");
  checkbox.checked = isEnabled; // Set checkbox state based on stored value
  toggleExtension(isEnabled); // Enable or disable based on checkbox state
});

// Event listener for checkbox changes
document.getElementById("always-available").addEventListener("change", (event) => {
  // Check if the current tab is a Teams page
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentUrl = tabs[0].url;

    if (currentUrl.includes("teams.microsoft.com")) {
      // Teams page, toggle extension state
      const isEnabled = event.target.checked;
      chrome.storage.sync.set({ isEnabled: isEnabled }); // Store the checkbox state
      toggleExtension(isEnabled); // Enable or disable simulation
      // Hide non-Teams message if on Teams page
      document.getElementById("non-teams-message").style.display = "none";
    } else {
      // Not a Teams page, show the message
      document.getElementById("non-teams-message").style.display = "block";
      // Optionally reset the checkbox to the last known state
      const lastKnownState = event.target.checked ? true : false;
      document.getElementById("always-available").checked = lastKnownState;
    }
  });
});

// Function to start or stop simulation
function toggleExtension(isEnabled) {
  if (isEnabled) {
    // Enable the extension to simulate mouse movements
    isExtensionEnabled = true;
    console.log("Teams Always Active: Simulation is enabled.");
  } else {
    // Disable the extension
    isExtensionEnabled = false;
    console.log("Teams Always Active: Simulation is disabled.");
  }
}
