import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AnimatedPressable } from '@/components/AnimatedPressable';
import { AppColors } from '@/constants/colors';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

type ProductCardProps = {
  product: Product;
  index?: number;
  onPress: () => void;
  onAddToCart: () => void;
};

export function ProductCard({ product, index = 0, onPress, onAddToCart }: ProductCardProps) {
  const { getAvailableStock, getCartQuantity } = useCart();
  const availableStock = getAvailableStock(product.id, product.stock);
  const inCart = getCartQuantity(product.id);
  const outOfStock = availableStock <= 0;

  return (
    <Animated.View
      entering={FadeInDown.duration(300)
        .delay(index * 60)
        .springify()}
      style={styles.cardWrapper}>
      <AnimatedPressable style={styles.card} onPress={onPress} scaleTo={0.98}>
        <Image source={product.image} style={styles.image} contentFit="cover" />
        <View style={styles.content}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <Text style={[styles.stock, outOfStock && styles.stockEmpty]}>
            Stock: {availableStock}
            {inCart > 0 ? ` (${inCart} en carrito)` : ''}
          </Text>
          <AnimatedPressable
            style={[styles.button, outOfStock && styles.buttonDisabled]}
            scaleTo={0.92}
            onPress={(e) => {
              e.stopPropagation?.();
              if (!outOfStock) onAddToCart();
            }}
            disabled={outOfStock}>
            <Text style={styles.buttonText}>{outOfStock ? 'Sin stock' : 'Agregar'}</Text>
          </AnimatedPressable>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    flex: 1,
    maxWidth: '48%',
    margin: 8,
  },
  card: {
    flex: 1,
    backgroundColor: AppColors.card,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: AppColors.border,
  },
  content: {
    padding: 12,
    gap: 4,
  },
  category: {
    fontSize: 11,
    fontWeight: '600',
    color: AppColors.primary,
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.text,
    minHeight: 36,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.text,
  },
  stock: {
    fontSize: 12,
    color: AppColors.textSecondary,
  },
  stockEmpty: {
    color: AppColors.danger,
    fontWeight: '600',
  },
  button: {
    marginTop: 8,
    backgroundColor: AppColors.primary,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: AppColors.textSecondary,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
