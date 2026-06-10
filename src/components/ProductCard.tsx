import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/colors';
import { Product } from '@/types';

type ProductCardProps = {
  product: Product;
  onPress: () => void;
  onAddToCart: () => void;
};

export function ProductCard({ product, onPress, onAddToCart }: ProductCardProps) {
  const outOfStock = product.stock <= 0;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: product.image }} style={styles.image} contentFit="cover" />
      <View style={styles.content}>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <Text style={styles.stock}>Stock: {product.stock}</Text>
        <Pressable
          style={[styles.button, outOfStock && styles.buttonDisabled]}
          onPress={(e) => {
            e.stopPropagation?.();
            if (!outOfStock) onAddToCart();
          }}
          disabled={outOfStock}>
          <Text style={styles.buttonText}>{outOfStock ? 'Sin stock' : 'Agregar'}</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: AppColors.card,
    borderRadius: 12,
    overflow: 'hidden',
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    maxWidth: '48%',
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
