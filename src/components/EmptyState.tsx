import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import { AppColors } from '@/constants/colors';

type EmptyStateProps = {
  title: string;
  message: string;
  iconName?: keyof typeof Ionicons.glyphMap;
};

export function EmptyState({
  title,
  message,
  iconName = 'cart-outline',
}: EmptyStateProps) {
  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
      <Animated.View entering={ZoomIn.duration(500).springify()} style={styles.iconWrapper}>
        <Ionicons name={iconName} size={56} color={AppColors.textSecondary} />
      </Animated.View>
      <Animated.Text entering={FadeIn.delay(150).duration(400)} style={styles.title}>
        {title}
      </Animated.Text>
      <Animated.Text entering={FadeIn.delay(250).duration(400)} style={styles.message}>
        {message}
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconWrapper: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: AppColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
