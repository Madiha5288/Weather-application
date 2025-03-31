
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './mobile.css';
import { useNetworkStatus } from './hooks/use-network';

// Add this for mobile device detection
const isCapacitorApp = 
  typeof (window as any).Capacitor !== 'undefined' && 
  (window as any).Capacitor.isNative;

if (isCapacitorApp) {
  document.documentElement.classList.add('capacitor');
}

// Set offline class on body when offline
const updateOfflineStatus = () => {
  if (!navigator.onLine) {
    document.body.classList.add('offline');
  } else {
    document.body.classList.remove('offline');
  }
};

window.addEventListener('online', updateOfflineStatus);
window.addEventListener('offline', updateOfflineStatus);
updateOfflineStatus();

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  });
}

// Wait for the deviceready event if in a Capacitor environment
const startApp = () => {
  createRoot(document.getElementById("root")!).render(<App />);
};

if (isCapacitorApp) {
  document.addEventListener('deviceready', startApp, false);
} else {
  startApp();
}
