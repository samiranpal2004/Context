// This script runs on every webpage you visit
// It captures page information when the background script asks for it

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'capturePage') {
    // Capture the current page info
    const pageData = {
      url: window.location.href,
      title: document.title,
      domain: window.location.hostname,
      
      // Get the page's favicon (little icon)
      favicon: getFavicon(),
      
      // Detect what type of page this is
      pageType: detectPageType(),
      
      // Get any text the user selected (highlighted)
      selectedText: getSelectedText()
    };
    
    // Send back to background script
    sendResponse(pageData);
  }
  return true;
});

// Get the favicon URL
function getFavicon() {
  const link = document.querySelector('link[rel*="icon"]');
  return link ? link.href : '';
}

// Detect what kind of page this is
function detectPageType() {
  const url = window.location.href;
  const domain = window.location.hostname;
  
  if (domain.includes('youtube.com')) return 'video';
  if (domain.includes('github.com')) return 'repository';
  if (domain.includes('stackoverflow.com')) return 'qa';
  if (domain.includes('amazon.com')) return 'product';
  if (url.includes('/docs')) return 'documentation';
  if (document.querySelector('article')) return 'article';
  
  return 'webpage';
}

// Get selected text or page description
function getSelectedText() {
  // First, check if user selected any text
  const selection = window.getSelection().toString().trim();
  if (selection) return selection;
  
  // Otherwise, get page description from meta tag
  const meta = document.querySelector('meta[name="description"]');
  return meta ? meta.content : '';
}

console.log('✅ Context content script loaded');