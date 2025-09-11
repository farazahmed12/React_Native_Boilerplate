import React from 'react';
import {StyleSheet} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeBaseProvider} from 'native-base';
import {SkyflowProvider} from 'skyflow-react-native';
import DuplicateItemsRtk from './src/screens/DuplicateItemsRtk';
import Quill from './src/screens/Quill';
import SkyFlowScreen from './src/screens/SkyFlow';
import {persistor, store} from './src/store';

const App = () => {
  const config = {
    vaultID: 'string', // ID of the vault that the client should connect to.
    vaultURL: 'string', // URL of the vault that the client should connect to.
    getBearerToken: 'helperFunc', // Helper function that retrieves a Skyflow bearer token from your backend.
    options: {
      // logLevel: LogLevel.DEBUG, // Optional, if not specified default is ERROR.
      // env: Env.DEV, // Optional, if not specified default is PROD.
    },
  };
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
    <SkyflowProvider config={config}>
      <NativeBaseProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <NavigationContainer>
              <Stack.Navigator initialRouteName="SkyFlowScreen">
                <Stack.Screen
                  name="DuplicateItemsRtk"
                  component={DuplicateItemsRtk}
                />
                <Stack.Screen name="Quill" component={Quill} />
                <Stack.Screen name="SkyFlowScreen" component={SkyFlowScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </PersistGate>
        </Provider>
      </NativeBaseProvider>
    </SkyflowProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
