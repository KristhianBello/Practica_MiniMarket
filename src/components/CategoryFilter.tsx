import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { AnimatedPressable } from '@/components/AnimatedPressable';
import { AppColors } from '@/constants/colors';

type CategoryFilterProps = {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
};

function CategoryChip({
  category,
  isActive,
  onSelect,
}: {
  category: string;
  isActive: boolean;
  onSelect: () => void;
}) {
  const progress = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isActive ? 1 : 0, { duration: 200 });
  }, [isActive, progress]);

  const chipStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [AppColors.card, AppColors.primary],
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [AppColors.border, AppColors.primary],
    ),
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [AppColors.text, '#FFFFFF']),
  }));

  return (
    <AnimatedPressable onPress={onSelect} scaleTo={0.94}>
      <Animated.View style={[styles.chip, chipStyle]}>
        <Animated.Text style={[styles.chipText, textStyle]}>{category}</Animated.Text>
      </Animated.View>
    </AnimatedPressable>
  );
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <Animated.View style={styles.wrapper}>
      <Animated.View style={styles.container}>
        {categories.map((category) => (
          <CategoryChip
            key={category}
            category={category}
            isActive={category === selected}
            onSelect={() => onSelect(category)}
          />
        ))}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 0,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    minHeight: 38,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
