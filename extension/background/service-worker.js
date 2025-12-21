// Background script - runs in the background, handles Ctrl+J

const API_URL = 'http://localhost:5000/api';

// Listen for Ctrl+J keyboard shortcut
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'save-memory') {
    console.log('🔥 Ctrl+J pressed! Saving page...');
    await saveCurrentPage();
  }
});

// Main function: Save the current page as a memory
async function saveCurrentPage() {
  try {
    // Step 1: Get the API key from storage
    const { apiKey } = await chrome.storage.local.get('apiKey');
    
    if (!apiKey) {
      showNotification('⚠️ Setup Required', 'Please set your API key in the extension popup first.');
      return;
    }
    
    // Step 2: Get the current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Step 3: Ask content script to capture page data
    const pageData = await chrome.tabs.sendMessage(tab.id, { action: 'capturePage' });
    
    console.log('📄 Captured page:', pageData);
    
    // Step 4: Show loading notification
    showNotification('⏳ Saving...', 'Analyzing page with AI...');
    
    // Step 5: Send to your backend API
    const response = await fetch(`${API_URL}/memories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify(pageData)
    });
    
    const result = await response.json();
    
    // Step 6: Show result
    if (result.success) {
      const memory = result.data.memory;
      showNotification(
        '✅ Memory Saved!', 
        `${memory.title}\n\n${memory.summary}\n\nTags: ${memory.tags.join(', ')}`
      );
      console.log('✅ Memory saved:', memory);
    } else {
      throw new Error(result.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    showNotification('❌ Error', `Failed to save: ${error.message}`);
  }
}

// Helper: Show a notification
function showNotification(title, message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: '../assets/icon48.png',
    title: title,
    message: message,
    priority: 2
  });
}

console.log('✅ Context background script loaded');