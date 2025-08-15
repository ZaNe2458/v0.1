# Car Wash Finder - React Native Expo App

A mobile application built with React Native and Expo that helps users find nearby car wash locations in Ulaanbaatar, Mongolia.

## Features

- **Interactive Map**: View car wash locations on a native map using react-native-maps
- **Bottom Sheet Modal**: Smooth bottom sheet modal with car wash details using @gorhom/bottom-sheet
- **Car Type Selection**: Choose from different vehicle types with visual feedback
- **Image Gallery**: Browse photos of car wash facilities
- **Contact Information**: Phone, email, hours, and address for each location

## Tech Stack

- **React Native** with Expo SDK 53
- **@gorhom/bottom-sheet** for smooth bottom sheet modals
- **react-native-maps** for native map functionality
- **react-native-reanimated** for smooth animations
- **react-native-gesture-handler** for gesture recognition

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI: `npm install -g @expo/cli`
- Expo Go app on your phone (available on App Store and Google Play)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Scan the QR code with Expo Go app to run on your phone

### Development Commands

- `npm start` - Start Expo dev server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator (macOS only)
- `npm run web` - Run in web browser

## Project Structure

```
CarWashFinder/
├── App.js              # Main application component
├── assets/             # Images and icons
├── babel.config.js     # Babel configuration
├── metro.config.js     # Metro bundler configuration
└── package.json        # Dependencies and scripts
```

## Data

The app currently uses static data for car wash locations. In a production app, this could be replaced with:
- API calls to a backend service
- Integration with mapping services
- Real-time data updates

## Location Data

Currently includes 2 car wash locations in Ulaanbaatar:
- Shine Car Wash (District Bayanzurkh)
- Premium Auto Wash (Khan-Uul District)

## Car Types Supported

- Small cars (Жижиг тэрэг)
- Medium cars (Дунд оврын)  
- Jeeps (Жийп)
- Large SUVs (Том оврын жийп)
- Vans (Транзит)
- Motorcycles (Мотоцикл)

## Native Features

This React Native version provides:
- Native map performance
- Smooth gesture-based interactions
- Device-optimized UI components
- Better performance than web version
- Native iOS and Android look and feel

## Future Enhancements

- Push notifications for nearby car washes
- User reviews and ratings
- Booking system integration
- GPS navigation integration
- Offline map support
- User location tracking