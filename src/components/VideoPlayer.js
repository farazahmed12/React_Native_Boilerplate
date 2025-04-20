import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';

const {width} = Dimensions.get('window');

const VideoPlayer = ({source}) => {
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [error, setError] = useState(false);

  const togglePause = () => setPaused(prev => !prev);

  const toggleMute = () => {
    setMuted(prev => !prev);
    videoRef.current?.setVolume(muted ? 1 : 0);
  };

  const toggleFullscreen = () => {
    videoRef.current?.presentFullscreenPlayer?.();
    setIsFullscreen(!isFullscreen);
  };

  const seekBy = seconds => {
    const nextTime = currentTime + seconds;
    videoRef.current?.seek(Math.max(0, nextTime));
  };

  const onLoad = data => {
    setDuration(data.duration);
    setError(false);
    setBuffering(false);
  };

  const onProgress = data => {
    setCurrentTime(data.currentTime);
  };

  const formatTime = seconds => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        togglePause();
      }}
      style={styles.container}>
      <Video
        source={source}
        ref={videoRef}
        style={styles.video}
        resizeMode="cover"
        paused={paused}
        onLoad={onLoad}
        onProgress={onProgress}
        volume={muted ? 0 : 1}
        controls={false}
        onEnd={() => setPaused(true)}
        onBuffer={({isBuffering}) => setBuffering(isBuffering)}
        onError={() => {
          console.log('Video error');
          setError(true);
          setPaused(true);
        }}
        onFullscreenPlayerDidDismiss={() => {
          setPaused(true);
          setIsFullscreen(false);
        }}
      />

      {/* Centered play button when paused */}
      {paused && !error && !buffering && (
        <TouchableOpacity
          onPress={() => setPaused(false)}
          style={styles.playButton}>
          <Icon name="play-circle" size={64} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Buffering UI */}
      {buffering && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {/* Error UI */}
      {error && (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={36} color="red" />
          <Text style={styles.errorText}>Failed to load video</Text>
        </View>
      )}

      {/* Controls */}
      {!paused && !buffering && !error && (
        <View style={styles.controlWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.controls}>
            <TouchableOpacity
              onPress={() => seekBy(-10)}
              style={styles.controlBtn}>
              <Icon name="play-back" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={togglePause} style={styles.controlBtn}>
              <Icon name={paused ? 'play' : 'pause'} size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => seekBy(10)}
              style={styles.controlBtn}>
              <Icon name="play-forward" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleMute} style={styles.controlBtn}>
              <Icon
                name={muted ? 'volume-mute' : 'volume-high'}
                size={24}
                color="#fff"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleFullscreen}
              style={styles.controlBtn}>
              <Icon
                name={isFullscreen ? 'contract' : 'expand'}
                size={24}
                color="#fff"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => videoRef.current?.seek(0)}
              style={styles.controlBtn}>
              <Icon name="refresh" size={24} color="#fff" />
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* Timestamp */}
      {!error && (
        <Text style={styles.timestamp}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.4,
    height: width * 0.4,
    backgroundColor: '#000',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 10,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -32,
    marginLeft: -32,
    zIndex: 2,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
    backgroundColor: '#00000080',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  errorText: {
    color: 'white',
    marginTop: 8,
    fontSize: 14,
  },
  controlWrapper: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    right: 6,
    zIndex: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
  },

  controlBtn: {
    padding: 8,
    backgroundColor: '#00000080',
    borderRadius: 50,
  },
  timestamp: {
    position: 'absolute',
    bottom: 6,
    right: 10,
    color: '#fff',
    fontSize: 12,
    backgroundColor: '#00000080',
    paddingHorizontal: 6,
    borderRadius: 4,
  },
});

export default VideoPlayer;
