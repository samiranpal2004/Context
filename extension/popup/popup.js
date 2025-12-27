// Popup script - handles API key setup

const apiKeyInput = document.getElementById("apiKeyInput");
const saveBtn = document.getElementById("saveBtn");
const changeBtn = document.getElementById("changeBtn");
const openSidepanelBtn = document.getElementById("openSidepanelBtn");
const setupSection = document.getElementById("setup");
const successSection = document.getElementById("success");
const messageDiv = document.getElementById("message");

// When popup opens, check if API key already exists
chrome.storage.local.get("apiKey", (result) => {
  if (result.apiKey) {
    // API key exists, show success section
    showSuccess();
  } else {
    // No API key, show setup section
    showSetup();
  }
});

// Save button clicked
saveBtn.addEventListener("click", async () => {
  const apiKey = apiKeyInput.value.trim();

  // Validate input
  if (!apiKey) {
    showMessage("Please enter an API key", "error");
    return;
  }

  if (!apiKey.startsWith("ctx_")) {
    showMessage('Invalid format. API key should start with "ctx_"', "error");
    return;
  }

  // Verify API key with backend
  try {
    const response = await fetch(
      "https://context-alpha-vert.vercel.app/api/auth/verify-api-key",
      {
        headers: {
          "x-api-key": apiKey,
        },
      }
    );

    const result = await response.json();

    if (result.success) {
      // Save to Chrome storage
      chrome.storage.local.set({ apiKey }, () => {
        showMessage("API key saved!", "success");
        setTimeout(showSuccess, 1000);
      });
    } else {
      showMessage("Invalid API key", "error");
    }
  } catch (error) {
    showMessage("Cannot connect to backend. Is it running?", "error");
  }
});

// Change button clicked
changeBtn.addEventListener("click", () => {
  showSetup();
  apiKeyInput.value = "";
  apiKeyInput.focus();
});

// Open sidepanel button clicked
openSidepanelBtn.addEventListener("click", async () => {
  try {
    // Get current window
    const window = await chrome.windows.getCurrent();
    // Open sidepanel
    await chrome.sidePanel.open({ windowId: window.id });
    // Close popup
    window.close();
  } catch (error) {
    console.error("Error opening sidepanel:", error);
    showMessage("Could not open sidepanel", "error");
  }
});

// Show setup section
function showSetup() {
  setupSection.classList.remove("hidden");
  successSection.classList.add("hidden");
}

// Show success section
function showSuccess() {
  setupSection.classList.add("hidden");
  successSection.classList.remove("hidden");
}

// Show message
function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type}`;
  messageDiv.classList.remove("hidden");

  // Hide after 3 seconds
  setTimeout(() => {
    messageDiv.classList.add("hidden");
  }, 3000);
}
