import React, {useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';

import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const QRCodeScan = () => {
  const device = useCameraDevice('back');
  const {hasPermission, requestPermission} = useCameraPermission();
  const [isScanning, setIsScanning] = useState(true);
  const [codes, setCodes] = useState([]);
  const [isCameraActive, setIsCameraActive] = useState(true);

  // Animation values
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const borderOpacity = useSharedValue(0);
  const cornerOpacity = useSharedValue(0);
  const successScale = useSharedValue(0);
  const successOpacity = useSharedValue(0);

  React.useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const showAlert = (type, value) => {
    Alert.alert('Code Scanned Successfully', `Type: ${type}\nValue: ${value}`, [
      {
        text: 'OK',
        onPress: () => {
          scale.value = 0;
          opacity.value = 0;
          borderOpacity.value = 0;
          cornerOpacity.value = 0;
          successScale.value = 0;
          successOpacity.value = 0;
          setCodes([]);

          setIsCameraActive(true);
          setTimeout(() => setIsScanning(true), 500);
        },
      },
    ]);
  };

  const startScanAnimation = (type, value) => {
    scale.value = withTiming(1, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });

    opacity.value = withTiming(1, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });

    borderOpacity.value = withDelay(
      200,
      withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      }),
    );

    cornerOpacity.value = withDelay(
      400,
      withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      }),
    );

    // Phase 4: Success animation (final phase)
    successScale.value = withDelay(
      700,
      withSequence(
        withTiming(1.1, {
          duration: 200,
          easing: Easing.out(Easing.cubic),
        }),
        withTiming(1, {
          duration: 200,
          easing: Easing.inOut(Easing.cubic),
        }),
      ),
    );

    successOpacity.value = withDelay(
      700,
      withSequence(
        withTiming(1, {
          duration: 200,
        }),
        withDelay(
          300,
          withTiming(0, {
            duration: 200,
          }),
        ),
      ),
    );

    // Show alert after all animations complete
    setTimeout(() => {
      runOnJS(showAlert)(type, value);
    }, 1400);
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      if (!isScanning || codes?.length === 0) {
        return;
      }

      // Immediately freeze the camera and stop scanning

      setCodes(codes);
      setIsScanning(false);
      setIsCameraActive(false);
      console.log('Scanned codes:', codes);

      const value = codes[0]?.value;
      const type = codes[0]?.type;

      console.log(`Type: ${type}, Value: ${value}`);

      // Start the professional animation sequence on frozen frame
      setTimeout(() => {
        startScanAnimation(type, value);
      }, 100);
    },
  });

  const frameAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
      opacity: opacity.value,
      borderWidth: 2,
      borderColor: '#44ff00',
      borderRadius: 8,
      backgroundColor: 'rgba(0, 255, 136, 0.1)',
    };
  });

  // Success checkmark animation
  const successAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: successScale.value}],
      opacity: successOpacity.value,
    };
  });

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Requesting camera permission...
        </Text>
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>No camera device found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isCameraActive}
        codeScanner={codeScanner}
      />

      {/* Scanning instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          Position QR code within the frame
        </Text>
      </View>

      {codes?.[0]?.frame && (
        <View
          style={{
            position: 'absolute',
            left: codes[0].frame.x - codes?.[0]?.frame?.width * 1,
            top: codes[0].frame.y + codes?.[0]?.frame?.height * 0.5,
            width: codes[0].frame.height + codes?.[0]?.frame?.width,
            height: codes[0].frame.height + codes?.[0]?.frame?.width,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {/* Main detection frame */}
          <Animated.View
            style={[
              frameAnimatedStyle,
              {
                position: 'absolute',
                width: codes[0].frame?.height + codes?.[0]?.frame?.width,
                height: codes[0].frame?.height + codes?.[0]?.frame?.width,
              },
            ]}
          />

          {/* Success checkmark */}
          <Animated.View style={[successAnimatedStyle]}>
            <View style={styles.successCheckmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  permissionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  instructionsContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  instructionsText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#00ff88',
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
  cornerDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00ff88',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#00ff88',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
  },

  successCheckmark: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00ff88',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00ff88',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  checkmarkText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default QRCodeScan;
