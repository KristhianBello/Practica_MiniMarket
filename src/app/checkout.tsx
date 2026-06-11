import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { AnimatedPressable } from '@/components/AnimatedPressable';
import { EmptyState } from '@/components/EmptyState';
import { AppColors } from '@/constants/colors';
import { useCart } from '@/context/CartContext';
import { getProductById } from '@/data/products';

export default function CheckoutScreen() {
  const { cart, getTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <EmptyState
          iconName="receipt-outline"
          title="No hay productos"
          message="Agrega productos al carrito antes de confirmar tu compra."
        />
      </SafeAreaView>
    );
  }

  const total = getTotal();

  const handleConfirm = async () => {
    await clearCart();
    Toast.show({
      type: 'success',
      text1: '¡Compra confirmada!',
      text2: 'Gracias por tu compra en MiniMarket',
    });
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Animated.ScrollView contentContainerStyle={styles.content}>
        <Animated.Text entering={FadeIn.duration(300)} style={styles.sectionTitle}>
          Resumen de tu compra
        </Animated.Text>

        {cart.map((item, index) => {
          const product = getProductById(item.id);
          return (
            <Animated.View
              key={item.id}
              entering={FadeInDown.duration(350)
                .delay(index * 80)
                .springify()}
              style={styles.itemRow}>
              <View style={styles.thumbnailWrapper}>
                {product ? (
                  <Image source={product.image} style={styles.thumbnail} contentFit="cover" />
                ) : (
                  <View style={styles.thumbnailPlaceholder} />
                )}
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQty}>
                  {item.quantity} x ${item.price.toFixed(2)}
                </Text>
              </View>
              <Text style={styles.itemSubtotal}>${(item.price * item.quantity).toFixed(2)}</Text>
            </Animated.View>
          );
        })}

        <View style={styles.divider} />

        <Animated.View
          entering={FadeInDown.delay(cart.length * 80 + 100).springify()}
          style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total a pagar</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </Animated.View>
      </Animated.ScrollView>

      <View style={styles.footer}>
        <AnimatedPressable style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Confirmar compra</Text>
        </AnimatedPressable>
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
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.text,
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: AppColors.card,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  thumbnailWrapper: {
    width: 56,
    height: 56,
    borderRadius: 8,
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
  itemInfo: {
    flex: 1,
    minWidth: 0,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.text,
  },
  itemQty: {
    fontSize: 13,
    color: AppColors.textSecondary,
    marginTop: 4,
  },
  itemSubtotal: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.border,
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: AppColors.card,
    borderRadius: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.text,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: AppColors.primary,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
    backgroundColor: AppColors.card,
  },
  confirmButton: {
    backgroundColor: AppColors.success,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
