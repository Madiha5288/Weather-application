
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add this for mobile device detection
const isCapacitorApp = 
  typeof (window as any).Capacitor !== 'undefined' && 
  (window as any).Capacitor.isNative;

if (isCapacitorApp) {
  document.documentElement.classList.add('capacitor');
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
