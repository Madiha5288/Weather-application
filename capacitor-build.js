
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure the dist directory exists
if (!fs.existsSync(path.join(__dirname, 'dist'))) {
  console.error('Error: dist directory does not exist. Run "npm run build" first.');
  process.exit(1);
}

console.log('🔄 Building Android app...');

// Run npx capacitor commands in sequence
const commands = [
  'npx capacitor add android',
  'npx capacitor copy android',
  'npx capacitor sync android',
  'npx capacitor open android'
];

// Execute commands in sequence
let currentCommandIndex = 0;

function runNextCommand() {
  if (currentCommandIndex >= commands.length) {
    console.log('✅ Android build process completed!');
    console.log('📱 To run on a device: Connect your Android device via USB, enable debugging, and run from Android Studio');
    return;
  }

  const command = commands[currentCommandIndex];
  console.log(`⚙️ Running: ${command}`);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error: ${error.message}`);
      console.log('Check that you have Android Studio installed and JDK configured correctly.');
      process.exit(1);
    }
    
    if (stderr) {
      console.error(`⚠️ Warning: ${stderr}`);
    }
    
    if (stdout) {
      console.log(stdout);
    }
    
    currentCommandIndex++;
    runNextCommand();
  });
}

runNextCommand();
