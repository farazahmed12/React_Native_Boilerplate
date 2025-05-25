// ScrollViewHeader
import React, {useRef} from 'react';
import {Animated, StatusBar, StyleSheet, Text, View} from 'react-native';

const HEADER_MAX_HEIGHT = 150;
const HEADER_MIN_HEIGHT = 0; // Can also be 50 if you want it to remain partially visible
const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function ScrollViewHeader() {
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Collapsible Header */}
      <Animated.View style={[styles.header, {height: headerHeight}]}>
        <Text style={styles.headerText}>Collapsing Header</Text>
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false}, // height uses layout, not transform
        )}
        scrollEventThrottle={16}>
        {Array.from({length: 20}, (_, i) => (
          <View key={i} style={styles.item}>
            <Text>Item {i + 1}</Text>
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#4682B4',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  headerText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    paddingTop: 40,
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 50,
  },
  item: {
    padding: 20,
    backgroundColor: '#F8F8F8',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
