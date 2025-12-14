# Installing Node.js and npm on Windows

## Step 1: Download Node.js

1. Go to the official Node.js website: **https://nodejs.org/**
2. You'll see two download buttons:
   - **LTS** (Recommended) - This is the stable version
   - **Current** - Latest features (may have bugs)
   
3. **Click the LTS button** to download the Windows installer

## Step 2: Install Node.js

1. Run the downloaded installer (e.g., `node-v20.x.x-x64.msi`)
2. Click "Next" through the installation wizard
3. **Important**: Make sure "Add to PATH" is checked (it should be by default)
4. Click "Install" (you may need administrator privileges)
5. Wait for installation to complete
6. Click "Finish"

## Step 3: Verify Installation

1. Open a **new** Command Prompt or PowerShell window
   - Close any existing terminals and open a fresh one
   - This is important so it picks up the new PATH

2. Check Node.js version:
   ```bash
   node --version
   ```
   Should show something like: `v20.x.x`

3. Check npm version:
   ```bash
   npm --version
   ```
   Should show something like: `10.x.x`

## Step 4: Navigate to Your Project

```bash
cd "C:\Users\vishw\OneDrive\Desktop\AI Closet APP"
```

## Step 5: Install Project Dependencies

```bash
npm install
```

This will install all the packages needed for the AI Closet app.

## Troubleshooting

### "node is not recognized"
- Make sure you opened a **new** terminal window after installing
- Restart your computer if needed
- Check that Node.js was added to PATH during installation

### Installation Issues
- Make sure you downloaded the correct version (64-bit for most modern Windows PCs)
- Run the installer as Administrator (right-click → Run as administrator)
- Disable antivirus temporarily if installation fails

### Check if Already Installed
Sometimes Node.js might already be installed. Try:
```bash
node --version
npm --version
```

If these commands work, you're all set!


