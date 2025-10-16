import notifee, {AndroidImportance} from '@notifee/react-native';
import {setBackgroundMessageHandler} from '@react-native-firebase/messaging';
import {Platform} from 'react-native';

// Ensure notification channel exists for Android
const setupChannel = async () => {
  if (Platform.OS === 'android') {
    try {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
      console.log('Notification channel created: default');
    } catch (error) {
      console.error('Failed to create notification channel:', error);
    }
  }
};

// Background message handler with error handling
const setupBackgroundHandler = () => {
  try {
    if (typeof setBackgroundMessageHandler !== 'function') {
      console.error(
        'setBackgroundMessageHandler is not a function, Firebase messaging may not be initialized',
      );
      return;
    }

    setBackgroundMessageHandler(async remoteMessage => {
      try {
        console.log('Background message:', remoteMessage);
        await setupChannel();
        await notifee.displayNotification({
          title: remoteMessage.notification?.title || 'New Message',
          body: remoteMessage.notification?.body || 'You have a new message',
          android: {
            channelId: 'default',
            importance: AndroidImportance.HIGH,
            pressAction: {
              id: 'default',
              launchActivity: 'default',
            },
          },
          ios: {
            sound: 'default',
          },
          data: remoteMessage.data,
        });
      } catch (error) {
        console.error('Background message handler error:', error);
      }
    });
    console.log('Background handler initialized successfully');
  } catch (error) {
    console.error('Failed to set background handler:', error);
  }
};

// Initialize the handler only if the module is available
export default setupBackgroundHandler;
