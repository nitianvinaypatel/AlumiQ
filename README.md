# AlumiQ - Alumni Networking Platform

AlumiQ is a comprehensive mobile application designed to connect alumni from educational institutions, facilitating networking, job referrals, and professional growth opportunities.

## 🌟 Features

- **Authentication System**: Secure login, signup, and password recovery
- **Home Feed**: Personalized content feed for alumni updates and news
- **Job Opportunities**: Browse and apply for jobs shared by fellow alumni
- **Referral System**: Request and provide referrals within your alumni network
- **Networking**: Connect with other alumni based on interests, industry, or graduation year
- **Notifications**: Stay updated with real-time notifications about connections, job opportunities, and more
- **Profile Management**: Customize your professional profile with education, experience, and skills

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: React Context API and Redux Toolkit
- **Animations**: React Native Reanimated and Moti
- **UI Components**: Custom components with Expo Vector Icons
- **API Integration**: RESTful API integration with fetch
- **Storage**: AsyncStorage for local data persistence

## 📱 Supported Platforms

<p>
  <!-- iOS -->
  <img alt="Supports Expo iOS" longdesc="Supports Expo iOS" src="https://img.shields.io/badge/iOS-4630EB.svg?style=flat-square&logo=APPLE&labelColor=999999&logoColor=fff" />
  <!-- Android -->
  <img alt="Supports Expo Android" longdesc="Supports Expo Android" src="https://img.shields.io/badge/Android-4630EB.svg?style=flat-square&logo=ANDROID&labelColor=A4C639&logoColor=fff" />
  <!-- Web -->
  <img alt="Supports Expo Web" longdesc="Supports Expo Web" src="https://img.shields.io/badge/web-4630EB.svg?style=flat-square&logo=GOOGLE-CHROME&labelColor=4285F4&logoColor=fff" />
</p>

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/alumiq.git
   cd alumiq
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server

   ```bash
   npm start
   # or
   yarn start
   ```

4. Run on your preferred platform
   ```bash
   # For iOS
   npm run ios
   # For Android
   npm run android
   # For Web
   npm run web
   ```

## 📁 Project Structure

- `/app` - Main application screens and navigation
  - `/(auth)` - Authentication screens (login, signup, forgot-password)
  - `/(tabs)` - Main tab navigation screens
  - `/(pages)` - Additional screens
  - `/store` - Redux store configuration
- `/components` - Reusable UI components
- `/constants` - Application constants and configuration
- `/contexts` - React Context providers
- `/services` - API services and integrations
- `/helpers` - Utility functions and helpers
- `/assets` - Images, fonts, and other static assets

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
