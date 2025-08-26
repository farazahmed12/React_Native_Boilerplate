import React from 'react';
import {StyleSheet} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeBaseProvider} from 'native-base';
import DuplicateItemsRtk from './src/screens/DuplicateItemsRtk';
import Quill from './src/screens/Quill';
import {persistor, store} from './src/store';

const App = () => {
  const userId = 'user_122223'; // Replace with actual user ID from storage or auth

  console.log('App started');

  console.log('App started222');
  // useEffect(() => {
  //   // Connect to socket when app launches
  //   socketManager.connect(userId);

  //   // Handle app state changes
  //   const appStateListener = AppState.addEventListener(
  //     'change',
  //     nextAppState => {
  //       if (nextAppState === 'active') {
  //         console.log('[AppState] App came to foreground');
  //         if (!socketManager.getSocket()?.connected) {
  //           socketManager.connect(userId); // Reconnect if needed
  //         }
  //       }
  //     },
  //   );

  //   // Optionally handle network change manually (already inside socketManager too)
  //   const netInfoUnsubscribe = NetInfo.addEventListener(state => {
  //     if (state.isConnected && !socketManager.getSocket()?.connected) {
  //       console.log('[NetInfo] Network back, reconnecting socket...');
  //       socketManager.connect(userId);
  //     }
  //   });

  //   // Cleanup
  //   return () => {
  //     appStateListener.remove();
  //     netInfoUnsubscribe();
  //     socketManager.disconnect();
  //   };
  // }, []);

  const Stack = createNativeStackNavigator();

  return (
    <NativeBaseProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Quill">
              <Stack.Screen
                name="DuplicateItemsRtk"
                component={DuplicateItemsRtk}
              />
              <Stack.Screen name="Quill" component={Quill} />
            </Stack.Navigator>
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </NativeBaseProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
