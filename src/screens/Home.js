import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

const Home = () => {
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
        <Text style={{padding: 20, backgroundColor: 'red'}}>Home</Text>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({});
