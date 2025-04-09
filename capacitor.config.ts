import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sgeede.focus.security',
  appName: 'focus_security',
  webDir: 'www',
  plugins: {
    App: {
      appUrlOpen: {
        enabled: true,
        schemes: ['focussecurity']
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
          'android.permission.READ_CONTACTS': 'We need access to your contacts for the app functionality.',
          'android.permission.CAMERA': 'We need access to your camera for the app functionality.',
          'android.permission.RECORD_AUDIO': 'We need access to your contacts for the app functionality.',
          'android.permission.READ_EXTERNAL_STORAGE': 'We need access to your contacts for the app functionality.',
          'android.permission.WRITE_EXTERNAL_STORAGE': 'We need access to your contacts for the app functionality.',
        }
      },
    },
  },
};

export default config;