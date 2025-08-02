# Car Wash Finder Application

## Overview

This project now includes both a web-based application and a React Native Expo mobile app for finding nearby car wash services in Ulaanbaatar, Mongolia. The web version uses React with Leaflet for mapping, while the mobile version uses React Native with native maps and bottom sheet components for optimal mobile experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (August 2, 2025)

- ✓ Updated React Native app with professional booking interface
- ✓ Added service type selection with pricing (Premium 45,000₮, Exterior 25,000₮, Interior 35,000₮)
- ✓ Implemented worker selection grid with photos and ratings
- ✓ Added appointment scheduling display
- ✓ Fixed dependency issues by simplifying to use standard React Native Modal
- ✓ Replaced complex bottom sheet libraries with reliable native components
- ✓ Created comprehensive local setup guide for users
- ✓ Professional card-based UI matching modern booking app standards

## System Architecture

### Web Application Architecture
- **Framework**: React 18 (loaded via CDN)
- **Build Process**: No build system - uses Babel standalone for JSX transformation in the browser
- **Styling**: Bootstrap 5 + custom CSS for responsive design
- **Component Structure**: Modular React components with global window object exports

### Mobile Application Architecture (NEW)
- **Framework**: React Native with Expo SDK 53
- **Build Process**: Metro bundler with Babel preset for Expo
- **Navigation**: Native map integration with react-native-maps
- **UI Components**: @gorhom/bottom-sheet for modal interactions
- **Animations**: react-native-reanimated for smooth gestures
- **Development**: Expo Go app for instant testing via QR code

### Technology Stack
- **Web UI**: React with functional components and hooks
- **Mobile UI**: React Native components with native performance
- **Web Mapping**: Leaflet.js for interactive maps and markers
- **Mobile Mapping**: react-native-maps for native map experience
- **Web Styling**: Bootstrap 5.3 + Font Awesome icons + custom CSS
- **Mobile Styling**: React Native StyleSheet with platform-specific optimizations
- **Data Storage**: Static JavaScript objects (no database) - same data for both platforms
- **Web Deployment**: Static files served directly from web server
- **Mobile Deployment**: Expo build service for app store distribution

## Key Components

### 1. App Component (`src/App.js`)
- Main application container
- Manages modal state and car wash selection
- Coordinates communication between MapView and BottomSheetModal

### 2. MapView Component (`src/components/MapView.js`)
- Renders interactive Leaflet map centered on Ulaanbaatar, Mongolia
- Displays custom markers for car wash locations
- Handles marker click events and tooltips
- Uses OpenStreetMap tiles for base map

### 3. BottomSheetModal Component (`src/components/BottomSheetModal.js`)
- Displays detailed information about selected car wash
- Implements modal with slide-up animation
- Handles keyboard (Escape) and overlay click events for closing
- Supports car type selection interface

### 4. Data Layer (`src/data/carWashData.js`)
- Static data structure containing car wash locations
- Includes location coordinates, contact info, hours, and images
- Car type definitions for service categorization

## Data Flow

1. **Initialization**: App loads with MapView showing all car wash markers
2. **User Interaction**: User clicks on a map marker
3. **Event Handling**: MapView triggers `onMarkerClick` callback
4. **State Update**: App component updates `selectedCarWash` state and opens modal
5. **Modal Display**: BottomSheetModal renders with selected location details
6. **Closing**: User can close modal via overlay click, handle click, or Escape key

## External Dependencies

### CDN Resources
- **React/ReactDOM**: 18.x from unpkg.com
- **Babel Standalone**: For JSX transformation
- **Leaflet**: 1.9.4 for mapping functionality
- **Bootstrap**: 5.3.0 for UI components and responsive grid
- **Font Awesome**: 6.4.0 for icons

### Third-party Services
- **OpenStreetMap**: Tile provider for map rendering
- **Unsplash**: External image hosting for car wash photos

## Deployment Strategy

### Current Setup
- **Type**: Static website with no server-side processing
- **Structure**: Single HTML file with linked JavaScript and CSS assets
- **Hosting**: Can be deployed to any static web hosting service

### Deployment Considerations
- All dependencies loaded via CDN - requires internet connection
- No build process needed - files can be served directly
- Cross-origin considerations for external image loading
- Mobile-responsive design ready for various screen sizes

### Scalability Limitations
- Static data storage limits dynamic content updates
- No user authentication or personalization features
- No backend API for real-time data or user interactions
- Limited to predefined car wash locations

## Development Notes

The application follows a simple architecture suitable for a proof-of-concept or small-scale deployment. The use of CDN-loaded dependencies and browser-based JSX transformation makes it easy to develop and deploy but may not be optimal for production applications requiring build optimization, offline capabilities, or complex state management.