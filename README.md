# Lashun Tweak Pro PRO EDITION

Windows PC Tweaker featuring Electron UI, React + Tailwind frontend, Node/Express backend, and PowerShell automation. Bundles an installer and EXE build via electron-builder.

## Project Structure
```
LashunTweakPro/
 ├─ installer/        # Setup wizard and automation
 ├─ electron/         # Electron shell (builds EXE)
 ├─ backend/          # Express API serving system controls
 ├─ frontend/         # React + Tailwind SPA
 ├─ scripts/          # PowerShell automation scripts
 └─ README.md
```

## Development
1. Start backend:
   ```bash
   cd backend
   npm install
   node index.js
   ```
2. Start frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```
3. Electron development (loads http://localhost:3000):
   ```bash
   cd electron
   npm install
   npm start
   ```

## Build Windows EXE
```
cd electron
npm install
npm run build:exe
```
The build bundles backend, scripts, and the compiled frontend into `electron/dist/`.

## Installer Wizard
The `installer` folder includes `wizard.html` and `setup.js`. Run `node setup.js` on Windows to ensure PowerShell policy and config folders are ready, or open `wizard.html` to execute the same steps with a UI.

## Packaging to ZIP
After building or preparing the folders, zip the project from the repository root:
```
zip -r LashunTweakPro.zip LashunTweakPro/
```
The resulting archive is ready to distribute with scripts, backend, frontend build, and the EXE output (once built).
