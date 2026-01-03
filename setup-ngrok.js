/**
 * ngrok Setup Helper
 * 
 * This script helps set up ngrok tunnels for sharing your app.
 * Make sure ngrok is installed: npm install -g ngrok
 */

import { spawn } from 'child_process';

console.log('🚀 Setting up ngrok tunnels...\n');

// Check if ngrok is installed
const checkNgrok = spawn('ngrok', ['version'], { shell: true });

checkNgrok.on('error', (error) => {
  console.error('❌ ngrok is not installed!');
  console.error('Please install ngrok:');
  console.error('  1. Download from: https://ngrok.com/download');
  console.error('  2. Or install via: npm install -g ngrok\n');
  process.exit(1);
});

checkNgrok.on('close', (code) => {
  if (code === 0) {
    console.log('✅ ngrok is installed\n');
    console.log('📋 Instructions:');
    console.log('  1. Make sure your backend is running: npm run dev');
    console.log('  2. Make sure your frontend is running: cd frontend && npm run dev');
    console.log('  3. In a new terminal, run: ngrok http 3001');
    console.log('  4. Share the ngrok URL with your team\n');
    console.log('💡 Tip: If backend needs separate tunnel, run: ngrok http 3000\n');
  }
});

