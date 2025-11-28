const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const configDir = path.join(process.env.APPDATA || '.', 'LashunTweakPro');

function checkExecutionPolicy() {
  try {
    const output = execSync('powershell.exe -Command "Get-ExecutionPolicy"', { encoding: 'utf-8' }).trim();
    return { policy: output, needsChange: !['RemoteSigned', 'Bypass'].includes(output) };
  } catch (err) {
    return { policy: 'Unknown', needsChange: true, error: err.message };
  }
}

function setPolicy() {
  execSync('powershell.exe -Command "Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force"');
}

function ensureConfig() {
  fs.mkdirSync(configDir, { recursive: true });
  fs.writeFileSync(path.join(configDir, 'settings.json'), JSON.stringify({ created: new Date().toISOString() }, null, 2));
}

function checkDependencies() {
  const missing = [];
  try { execSync('powershell.exe -Command "$PSVersionTable.PSVersion"'); } catch { missing.push('PowerShell'); }
  try { execSync('node -v'); } catch { missing.push('Node.js'); }
  return missing;
}

function run() {
  console.log('Lashun Tweak Pro PRO EDITION installer');
  const policy = checkExecutionPolicy();
  console.log('Execution policy:', policy.policy);
  if (policy.needsChange) {
    console.log('Adjusting execution policy to RemoteSigned...');
    setPolicy();
  }

  console.log('Creating config directory at', configDir);
  ensureConfig();

  const missing = checkDependencies();
  if (missing.length) {
    console.error('Missing dependencies:', missing.join(', '));
    process.exit(1);
  }
  console.log('All dependencies present.');
  console.log('Setup completed.');
}

if (require.main === module) {
  run();
}

module.exports = { run };
