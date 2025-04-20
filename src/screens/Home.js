import React from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import VideoPlayer from '../components/VideoPlayer';
import {useGetDogsQuery} from '../store/apiSlice';

const Home = () => {
  const {data, error, isFetching} = useGetDogsQuery();

  const video1 =
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';
  const video2 =
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Home</Text>

      <VideoPlayer
        source={{
          uri: video1,
        }}
      />

      {/* <DeepVideoPlayer
        source={{
          uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        }}
      /> */}
      {/* <WorldClassVideoPlayer
        source={{
          uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        }}
      /> */}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({});
