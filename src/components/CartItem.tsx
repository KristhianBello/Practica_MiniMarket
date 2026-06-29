import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft, Layout } from 'react-native-reanimated';

import { AnimatedPressable } from '@/components/AnimatedPressable';
import { getProductImage } from '@/api/products';
import { AppColors } from '@/constants/colors';
import { CartItem } from '@/types';

type CartItemRowProps = {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export function CartItemRow({ item, onIncrease, onDecrease, onRemove }: CartItemRowProps) {
  const subtotal = item.price * item.quantity;
  const image = getProductImage(item.imageKey);

  return (
    <Animated.View
      entering={FadeInRight.duration(300).springify()}
      exiting={FadeOutLeft.duration(250)}
      layout={Layout.springify()}
      style={styles.container}>
      <View style={styles.thumbnailWrapper}>
        <Image source={image} style={styles.thumbnail} contentFit="cover" />
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.price}>${item.price.toFixed(2)} c/u</Text>
        <Text style={styles.subtotal}>Subtotal: ${subtotal.toFixed(2)}</Text>
      </View>

      <View style={styles.actions}>
        <View style={styles.quantityControls}>
          <AnimatedPressable style={styles.qtyButton} scaleTo={0.9} onPress={onDecrease}>
            <Text style={styles.qtyButtonText}>−</Text>
          </AnimatedPressable>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <AnimatedPressable style={styles.qtyButton} scaleTo={0.9} onPress={onIncrease}>
            <Text style={styles.qtyButtonText}>+</Text>
          </AnimatedPressable>
        </View>
        <AnimatedPressable style={styles.removeButton} scaleTo={0.95} onPress={onRemove}>
          <Text style={styles.removeText}>Eliminar</Text>
        </AnimatedPressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.card,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnailWrapper: {
    width: 72,
    height: 72,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: AppColors.border,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    flex: 1,
    backgroundColor: AppColors.border,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.text,
    marginBottom: 4,
  },
  price: {
    fontSize: 13,
    color: AppColors.textSecondary,
  },
  subtotal: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.primary,
    marginTop: 4,
  },
  actions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  qtyButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: AppColors.background,
    borderWidth: 1,
    borderColor: AppColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.text,
  },
  quantity: {
    fontSize: 15,
    fontWeight: '600',
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  removeText: {
    fontSize: 12,
    color: AppColors.danger,
    fontWeight: '500',
  },
});
