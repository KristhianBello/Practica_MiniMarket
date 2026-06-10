import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppColors } from '@/constants/colors';
import { useCart } from '@/context/CartContext';
import { getProductById } from '@/data/products';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addToCart } = useCart();
  const product = getProductById(Number(id));

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Producto no encontrado</Text>
      </SafeAreaView>
    );
  }

  const outOfStock = product.stock <= 0;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: product.image }} style={styles.image} contentFit="cover" />

        <View style={styles.details}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <Text style={styles.stock}>
            Stock disponible: {product.stock} {product.stock === 1 ? 'unidad' : 'unidades'}
          </Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.button, outOfStock && styles.buttonDisabled]}
          disabled={outOfStock}
          onPress={() => addToCart(product)}>
          <Text style={styles.buttonText}>
            {outOfStock ? 'Sin stock disponible' : 'Agregar al carrito'}
          </Text>
        </Pressable>
        <Pressable style={styles.backLink} onPress={() => router.back()}>
          <Text style={styles.backLinkText}>Volver al catálogo</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  content: {
    paddingBottom: 24,
  },
  image: {
    width: '100%',
    height: 280,
    backgroundColor: AppColors.border,
  },
  details: {
    padding: 20,
    gap: 8,
  },
  category: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.primary,
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: AppColors.text,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: AppColors.primary,
    marginTop: 4,
  },
  stock: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginTop: 4,
  },
  description: {
    fontSize: 15,
    color: AppColors.text,
    lineHeight: 24,
    marginTop: 12,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
    backgroundColor: AppColors.card,
    gap: 8,
  },
  button: {
    backgroundColor: AppColors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: AppColors.textSecondary,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  backLink: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  backLinkText: {
    color: AppColors.textSecondary,
    fontSize: 14,
  },
  error: {
    fontSize: 16,
    color: AppColors.danger,
    textAlign: 'center',
    marginTop: 40,
  },
});
