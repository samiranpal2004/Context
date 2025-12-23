import { useState, useEffect } from "react";

export function useApiKey() {
  const [apiKey, setApiKey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApiKey = async () => {
      try {
        if (typeof chrome !== "undefined" && chrome.storage) {
          chrome.storage.local.get("apiKey", (result) => {
            setApiKey(result.apiKey || null);
            setLoading(false);
          });

          // Listen for changes to API key
          const listener = (changes, area) => {
            if (area === "local" && changes.apiKey) {
              setApiKey(changes.apiKey.newValue);
            }
          };
          chrome.storage.onChanged.addListener(listener);

          return () => {
            chrome.storage.onChanged.removeListener(listener);
          };
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading API key:", error);
        setLoading(false);
      }
    };

    loadApiKey();
  }, []);

  const saveApiKey = (newApiKey) => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.set({ apiKey: newApiKey }, () => {
        setApiKey(newApiKey);
      });
    }
  };

  return { apiKey, loading, saveApiKey, hasApiKey: !!apiKey };
}

export default useApiKey;
