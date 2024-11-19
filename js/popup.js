// Load the current state from storage
chrome.storage.sync.get("isEnabled", (data) => {
  const isEnabled = data.isEnabled || false; // Default to false if not set
  const checkbox = document.getElementById("always-available");
  checkbox.checked = isEnabled; // Set checkbox state based on stored value
});

// Event listener for checkbox changes
document.getElementById("always-available").addEventListener("change", (event) => {
  const isEnabled = event.target.checked;

  // Save the checkbox state
  chrome.storage.sync.set({ isEnabled: isEnabled });

  // Send a message to the content script to enable or disable simulation
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentUrl = tabs[0].url;

    if (currentUrl.includes("teams.microsoft.com")) {
      // Teams page, toggle extension state
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: toggleExtensionInContentScript,
        args: [isEnabled],
      });
    } else {
      // Not a Teams page, show the message
      document.getElementById("non-teams-message").style.display = "block";
      document.getElementById("always-available").checked = false;
    }
  });
});

// Function to send state change to content script
function toggleExtensionInContentScript(isEnabled) {
  chrome.runtime.sendMessage({ action: isEnabled ? 'enable' : 'disable' });
}
