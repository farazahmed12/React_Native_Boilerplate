import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import socketManager from '../Socket/SocketManager';
import {useGetDogsQuery} from '../store/apiSlice';

const Home = () => {
  const {data, error, isFetching} = useGetDogsQuery();

  const video1 =
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';
  const video2 =
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  // Somewhere in your component
  const socket = socketManager.getSocket(); // ✅ recommended

  const onPress = () => {
    console.log('Socket connected:', socket?.connected); // for debugging

    if (socket && socket.connected) {
      socket.emit('hello', {message: 'Hello from React !'});
    } else {
      console.log('❌ Socket is not connected. Trying to reconnect...');
      socketManager.connect('user_123'); // Trigger reconnect if needed
    }
  };

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      edges={['top']}
      style={{
        flex: 1,
        backgroundColor: 'red',
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'orange',
        }}>
        <Text onPress={onPress} style={{padding: 20, backgroundColor: 'red'}}>
          Home
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({});
