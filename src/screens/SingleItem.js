import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const SingleItem = ({route}) => {
  const {itemId} = route?.params; // Assuming you pass itemId in navigation params

  return (
    <View>
      <Text>SingleItem</Text>
    </View>
  );
};

export default SingleItem;

const styles = StyleSheet.create({});
