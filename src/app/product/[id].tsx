import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fetchProductById } from '@/api/products';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { ImageViewerModal } from '@/components/ImageViewerModal';
import { ProductDetailsSection } from '@/components/ProductDetailsSection';
import { AppColors } from '@/constants/colors';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

function goToCatalog() {
  if (router.canGoBack()) {
    router.back();
    return;
  }

  router.replace('/(tabs)');
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addToCart, getAvailableStock, getCartQuantity } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      try {
        setError('');
        setIsLoading(true);
        const data = await fetchProductById(Number(id));
        if (active) {
          setProduct(data);
        }
      } catch {
        if (active) {
          setError('No se pudo cargar el producto desde la API.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      active = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={AppColors.primary} />
        <Text style={styles.loadingText}>Consultando endpoint del producto...</Text>
      </SafeAreaView>
    );
  }

  if (!product || error) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.error}>{error || 'Producto no encontrado'}</Text>
        <AnimatedPressable style={styles.errorBackButton} onPress={goToCatalog}>
          <Text style={styles.errorBackText}>Volver al catalogo</Text>
        </AnimatedPressable>
      </SafeAreaView>
    );
  }

  const availableStock = getAvailableStock(product.id, product.stock);
  const inCart = getCartQuantity(product.id);
  const outOfStock = availableStock <= 0;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View entering={FadeIn.duration(400)}>
          <Pressable
            style={styles.imageWrapper}
            onPress={() => setImageViewerVisible(true)}
            accessibilityLabel="Ver imagen en tamano completo"
            accessibilityRole="button">
            <Image source={product.image} style={styles.image} contentFit="cover" />
            <View style={styles.imageOverlay}>
              <Ionicons name="expand-outline" size={22} color="#FFFFFF" />
              <Text style={styles.imageOverlayText}>Ver imagen</Text>
            </View>
          </Pressable>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(100).duration(400).springify()}
          style={styles.details}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <Text style={[styles.stock, outOfStock && styles.stockEmpty]}>
            Stock disponible: {availableStock} {availableStock === 1 ? 'unidad' : 'unidades'}
            {inCart > 0 ? ` - ${inCart} en tu carrito` : ''}
          </Text>
          {product.integrante ? (
            <Text style={styles.integrante}>Registrado por: {product.integrante}</Text>
          ) : null}
          <Text style={styles.description}>{product.description}</Text>

          <ProductDetailsSection
            longDescription={product.longDescription}
            specifications={product.specifications}
          />
        </Animated.View>
      </ScrollView>

      <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.footer}>
        <AnimatedPressable
          style={[styles.button, outOfStock && styles.buttonDisabled]}
          disabled={outOfStock}
          scaleTo={0.94}
          onPress={() => addToCart(product)}>
          <Text style={styles.buttonText}>
            {outOfStock ? 'Sin stock disponible' : 'Agregar al carrito'}
          </Text>
        </AnimatedPressable>
        <AnimatedPressable style={styles.backLink} scaleTo={0.98} onPress={goToCatalog}>
          <Ionicons name="arrow-back" size={18} color={AppColors.primary} />
          <Text style={styles.backLinkText}>Volver al catalogo</Text>
        </AnimatedPressable>
      </Animated.View>

      <ImageViewerModal
        visible={imageViewerVisible}
        image={product.image}
        title={product.name}
        onClose={() => setImageViewerVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.background,
    padding: 24,
  },
  loadingText: {
    color: AppColors.textSecondary,
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  content: {
    paddingBottom: 24,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 280,
    backgroundColor: AppColors.border,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  imageOverlayText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
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
  stockEmpty: {
    color: AppColors.danger,
    fontWeight: '600',
  },
  integrante: {
    color: AppColors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  backLinkText: {
    color: AppColors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  error: {
    fontSize: 16,
    color: AppColors.danger,
    textAlign: 'center',
  },
  errorBackButton: {
    marginTop: 16,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  errorBackText: {
    color: AppColors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
});
