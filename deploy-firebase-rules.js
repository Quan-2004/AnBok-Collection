// Script để deploy Firebase Rules
// Chạy lệnh: firebase deploy --only database

const { exec } = require('child_process');

console.log('Deploying Firebase Rules...');

exec('firebase deploy --only database', (error, stdout, stderr) => {
  if (error) {
    console.error('Error deploying Firebase rules:', error);
    return;
  }
  
  if (stderr) {
    console.error('Stderr:', stderr);
  }
  
  console.log('Firebase rules deployed successfully!');
  console.log('Stdout:', stdout);
}); 