const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const NodeCache = require('node-cache');

const app = express();
const PORT = process.env.PORT || 4350;
const cache = new NodeCache({ stdTTL: 1 });

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

const scriptsPath = process.env.SCRIPTS_PATH || path.join(__dirname, '..', 'scripts');

const sanitizeString = (val) => {
  if (typeof val !== 'string') return '';
  return val.replace(/[^\w\s\.-]/g, '').trim();
};

const runPowerShell = (scriptName, args = []) => {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(scriptsPath, scriptName);
    if (!fs.existsSync(fullPath)) {
      return reject(new Error(`Script not found: ${fullPath}`));
    }
    const psArgs = ['-ExecutionPolicy', 'Bypass', '-File', fullPath, ...args];
    const ps = spawn('powershell.exe', psArgs, { windowsHide: true });
    let stdout = '';
    let stderr = '';

    ps.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    ps.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    ps.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(stderr || `PowerShell exited with code ${code}`));
      }
      try {
        const parsed = JSON.parse(stdout.trim());
        resolve(parsed);
      } catch (err) {
        resolve(stdout.trim());
      }
    });

    ps.on('error', (err) => reject(err));
  });
};

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:3000 http://127.0.0.1:3000");
  next();
});

app.use('/api/system', require('./routes/system')(runPowerShell, cache));
app.use('/api/process', require('./routes/process')(runPowerShell, sanitizeString));
app.use('/api/cleanup', require('./routes/cleanup')(runPowerShell));
app.use('/api/startup', require('./routes/startup')(runPowerShell, sanitizeString));
app.use('/api/fps', require('./routes/fps')(runPowerShell));
app.use('/api/ai', require('./routes/ai')(sanitizeString));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));
app.get('*', (req, res) => {
  const filePath = path.join(__dirname, '..', 'frontend', 'build', 'index.html');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'Frontend build not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Lashun Tweak Pro backend running on port ${PORT}`);
});
