import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'focus_security',
  webDir: 'www',
  plugins: {
    App: {
      appUrlOpen: {
        schemes: ['FocusSecurity']
      }
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    Contacts: {
      ios: {
        // Configure specific settings for iOS (like request permissions)
        permissions: {
          NSContactsUsageDescription: 'This app needs access to your contacts to display them.'
        }
      },
      android: {
        // Configure specific settings for Android (like runtime permissions)
        permissions: {
          'android.permission.READ_CONTACTS': 'We need access to your contacts for the app functionality.'
        }
      },
    },
  },
};

export default config;
