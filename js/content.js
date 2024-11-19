let lastMousePosition = { x: 0, y: 0 };
const smallMovementRange = 2; // Movement range in pixels (± this value)
const idleThreshold = 30000; // 30 seconds of inactivity considered idle
let lastActivityTimestamp = Date.now();
let userActive = false;
let isExtensionEnabled = false; // Flag to control simulation

// Detect user activity (mouse move or keydown)
const resetIdleTimer = () => {
  userActive = true;
  lastActivityTimestamp = Date.now();
};

// Add event listeners for mouse and keyboard activity
window.addEventListener("mousemove", resetIdleTimer);
window.addEventListener("keydown", resetIdleTimer);

// Function to simulate mouse movement
const moveMouse = () => {
  const currentTime = Date.now();

  // Only simulate movement if the user has been idle for the defined threshold
  if (isExtensionEnabled && currentTime - lastActivityTimestamp > idleThreshold) {
    // Small random movement within a small range from the last known mouse position
    const randomOffsetX = (Math.random() * 2 - 1) * smallMovementRange;
    const randomOffsetY = (Math.random() * 2 - 1) * smallMovementRange;

    const currentMouseEvent = new MouseEvent("mousemove", {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: lastMousePosition.x + randomOffsetX,
      clientY: lastMousePosition.y + randomOffsetY,
    });

    document.body.dispatchEvent(currentMouseEvent);

    // Update the last mouse position after the movement
    lastMousePosition.x = currentMouseEvent.clientX;
    lastMousePosition.y = currentMouseEvent.clientY;

    console.log(`Mouse moved slightly to X: ${lastMousePosition.x}, Y: ${lastMousePosition.y}`);
  } else {
    console.log("User is active, skipping simulation.");
  }
};

// Initialize the lastMousePosition when user first interacts with the page
window.addEventListener("mousemove", (event) => {
  lastMousePosition.x = event.clientX;
  lastMousePosition.y = event.clientY;
});

// Simulate mouse movement every 1 minute (60000 ms) if idle
setInterval(moveMouse, 60000); // Adjust interval as needed

// Listen for messages from the popup to toggle extension state
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'enable') {
    isExtensionEnabled = true;
    console.log("Teams Always Active: Simulation is enabled.");
  } else if (message.action === 'disable') {
    isExtensionEnabled = false;
    console.log("Teams Always Active: Simulation is disabled.");
  }
});
