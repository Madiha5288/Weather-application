
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.weatherapp.app',
  appName: 'Weather Application',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#121212",
      showSpinner: true,
      spinnerColor: "#ffffff",
    },
  }
};

export default config;
