# Running Car Wash Finder Locally

This guide will help you run the React Native Expo app on your local computer after downloading the project.

## Prerequisites

Before you start, make sure you have these installed on your computer:

### 1. Install Node.js
- Download and install Node.js from: https://nodejs.org/
- Choose the LTS (Long Term Support) version
- Verify installation by opening terminal/command prompt and typing:
  ```bash
  node --version
  npm --version
  ```

### 2. Install Expo CLI
Open your terminal/command prompt and run:
```bash
npm install -g @expo/cli
```

### 3. Install Expo Go on Your Phone
- **Android**: Download from Google Play Store
- **iPhone**: Download from App Store
- Search for "Expo Go" and install it

## Setting Up the Project

### Step 1: Navigate to Project Folder
After downloading and extracting the zip file, open terminal/command prompt and navigate to the CarWashFinder folder:
```bash
cd path/to/CarWashFinder
```
(Replace `path/to/CarWashFinder` with the actual path where you extracted the files)

### Step 2: Install Dependencies
Run this command to install all required packages:
```bash
npm install
```
This will install:
- React Native components
- Expo SDK
- Maps functionality
- Bottom sheet components
- Animation libraries

### Step 3: Start the Development Server
Run the app with:
```bash
npm start
```
or
```bash
expo start
```

## Running the App

After running `npm start`, you'll see:
1. A QR code in your terminal
2. Development server interface
3. Options to run on different platforms

### Option 1: Run on Your Phone (Recommended)
1. Open Expo Go app on your phone
2. Scan the QR code displayed in your terminal
3. The app will download and run on your phone

### Option 2: Run in Web Browser
Press `w` in the terminal to open in your web browser
(Note: Some features may work differently in web)

### Option 3: Run on Android Emulator
- Install Android Studio
- Set up Android emulator
- Press `a` in terminal to run on Android

### Option 4: Run on iOS Simulator (Mac only)
- Install Xcode
- Press `i` in terminal to run on iOS simulator

## Project Structure

```
CarWashFinder/
├── App.js              # Main app component
├── assets/             # Images and icons
├── babel.config.js     # Babel configuration
├── metro.config.js     # Metro bundler config
├── package.json        # Dependencies
├── README.md           # Project documentation
└── LOCAL_SETUP.md      # This setup guide
```

## Common Issues and Solutions

### Issue: "Command not found: expo"
**Solution**: Install Expo CLI globally:
```bash
npm install -g @expo/cli
```

### Issue: "Module not found" errors
**Solution**: Make sure you installed dependencies:
```bash
npm install
```

### Issue: Metro bundler fails to start
**Solution**: Clear npm cache and reinstall:
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

### Issue: QR code doesn't work
**Solutions**:
1. Make sure your phone and computer are on the same WiFi network
2. Try running with tunnel mode: `expo start --tunnel`
3. Manually enter the URL shown in terminal into Expo Go

### Issue: App crashes on phone
**Solutions**:
1. Shake your phone to open developer menu
2. Select "Reload" to restart the app
3. Check terminal for error messages

## Development Commands

- `npm start` - Start development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator (Mac only)
- `npm run web` - Run in web browser

## Making Changes

1. Edit files in your code editor (VS Code, etc.)
2. Save changes
3. App will automatically reload on your phone
4. If it doesn't reload, shake phone and select "Reload"

## Features Included

The app includes:
- Interactive map with car wash locations in Ulaanbaatar
- Bottom sheet modal with car wash details
- Car type selection (small car, SUV, van, motorcycle, etc.)
- Image gallery for each location
- Contact information (phone, email, hours, address)

## Need Help?

If you encounter issues:
1. Check that Node.js and Expo CLI are properly installed
2. Make sure all dependencies are installed with `npm install`
3. Ensure your phone and computer are on the same network
4. Try restarting the development server with `npm start`

The app is designed to work smoothly with Expo Go for easy testing and development!