import LogoIcon from '@/assets/svg/logo.svg';
import { TYPOGRAPHY } from '@/constants/theme';
import { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { ThemedText } from './ThemedText';

const { width } = Dimensions.get('window');

export function CustomSplash() {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Start animation sequence
    scale.value = withSequence(
      withSpring(1.1, { damping: 15 }),
      withSpring(1, { damping: 12 })
    );
    
    // Fade in
    opacity.value = withTiming(1, { duration: 800 });
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { 
        translateY: withSpring(opacity.value === 1 ? 0 : 20, {
          damping: 15,
          stiffness: 100,
        })
      }
    ],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, iconStyle]}>
        <LogoIcon width={80} height={80} fill="#FFFFFF" />
      </Animated.View>
      <Animated.View style={textStyle}>
        <ThemedText style={styles.title}>Caldoc</ThemedText>
        <ThemedText style={styles.subtitle}>Medical Calculations Made Easy</ThemedText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3D50B5',
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    ...TYPOGRAPHY.h1,
    textAlign: 'center',
    marginBottom: 8,
    color: '#FFFFFF',
  },
  subtitle: {
    ...TYPOGRAPHY.body1,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    maxWidth: width * 0.8,
  },
}); 