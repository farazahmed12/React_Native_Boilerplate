import React from 'react';
import {StyleSheet} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

import {NativeBaseProvider} from 'native-base';
import Home from './src/screens/Home';
import {persistor, store} from './src/store';

const App = () => {
  return (
    <NativeBaseProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Home />
        </PersistGate>
      </Provider>
    </NativeBaseProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
