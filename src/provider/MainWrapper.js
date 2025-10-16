import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {useEffect} from 'react';
import {Platform} from 'react-native';
import {useDispatch} from 'react-redux';

const MainWrapper = ({children}) => {
  const dispatch = useDispatch();

  // **************** Notification Permission Start ****************
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    console.log('authStatus:', authStatus);
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  };

  // Handle navigation based on notification data
  const handleNavigationBasedOnFlag = (flag, payload) => {
    console.log('==========================>');
    console.log('Navigation triggered!');
    console.log('Flag:', flag);
    console.log('Payload:', payload);
    console.log('==========================>');

    // Your navigation logic will go here
    // Example:
    // if (flag === 'ORDER') {
    //   navigate to order details with payload
    // } else if (flag === 'MESSAGE') {
    //   navigate to chat with payload
    // }
  };

  // First useEffect for setting up messaging and FCM token
  useEffect(() => {
    const initializeMessaging = async () => {
      const permissionGranted = await requestUserPermission();
      if (permissionGranted) {
        await messaging().registerDeviceForRemoteMessages();

        if (Platform.OS === 'ios') {
          const apnsToken = await messaging().getAPNSToken();
          console.log('APNs Token:', apnsToken || 'Failed to get APNs token.');
        }

        const fcmToken = await messaging().getToken();
        console.log('FCM Token:', fcmToken);
      }

      // Check if app was opened from a notification (KILLED STATE)
      const initialNotification = await messaging().getInitialNotification();
      if (initialNotification) {
        console.log('App opened from KILLED state via notification');
        const payload = initialNotification?.data?.payload
          ? JSON.parse(initialNotification.data.payload)
          : null;
        handleNavigationBasedOnFlag(initialNotification?.data?.flag, payload);
      }
    };

    initializeMessaging();

    // FOREGROUND: When notification arrives while app is open
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('Foreground message received:', remoteMessage);

      // Display the notification
      const notificationId = await notifee.displayNotification({
        title: remoteMessage.notification?.title || 'New Message',
        body: remoteMessage.notification?.body || 'You have a new message',
        data: remoteMessage.data, // Pass the data to notifee
        android: {
          channelId: 'default',
        },
        ios: {
          sound: 'default',
        },
      });
    });

    // Clean up
    return () => {
      unsubscribeOnMessage();
    };
  }, [dispatch]);

  // Second useEffect for background notifications and tap handling
  useEffect(() => {
    // BACKGROUND: App is in background, user taps notification
    const unsubscribeOpenedApp = messaging().onNotificationOpenedApp(
      async remoteMessage => {
        console.log('App opened from BACKGROUND state via notification');
        const payload = remoteMessage?.data?.payload
          ? JSON.parse(remoteMessage.data.payload)
          : null;
        handleNavigationBasedOnFlag(remoteMessage?.data?.flag, payload);
      },
    );

    // FOREGROUND: User taps on the displayed notification (notifee event)
    const unsubscribeNotifeePress = notifee.onForegroundEvent(
      async ({type, detail}) => {
        if (type === notifee.EventType.PRESS) {
          console.log('User tapped notification in FOREGROUND');
          const payload = detail.notification?.data?.payload
            ? JSON.parse(detail.notification.data.payload)
            : null;
          handleNavigationBasedOnFlag(detail.notification?.data?.flag, payload);
        }
      },
    );

    // Background message handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background message received:', remoteMessage);
      await notifee.displayNotification({
        title: remoteMessage.notification?.title || 'New Message',
        body: remoteMessage.notification?.body || 'You have a new message',
        data: remoteMessage.data, // Important: Pass data to notifee
        android: {
          channelId: 'default',
        },
        ios: {
          sound: 'default',
        },
      });
    });

    // Clean up
    return () => {
      unsubscribeOpenedApp();
      unsubscribeNotifeePress();
    };
  }, []);

  // **************** Notification Permission End ****************
  return children;
};

export default MainWrapper;
