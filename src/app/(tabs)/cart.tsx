import { useEffect } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedPressable } from '@/components/AnimatedPressable';
import { CartItemRow } from '@/components/CartItem';
import { EmptyState } from '@/components/EmptyState';
import { AppColors } from '@/constants/colors';
import { useCart } from '@/context/CartContext';

function AnimatedTotal({ total }: { total: number }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = 0.92;
    opacity.value = 0.6;
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    opacity.value = withTiming(1, { duration: 200 });
  }, [total, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text style={[styles.totalAmount, animatedStyle]}>
      ${total.toFixed(2)}
    </Animated.Text>
  );
}

export default function CartScreen() {
  const {
    cart,
    isLoading,
    getTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={AppColors.primary} />
      </View>
    );
  }

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <EmptyState
          iconName="cart-outline"
          title="Tu carrito está vacío"
          message="Explora el catálogo y agrega productos para comenzar tu compra."
        />
      </SafeAreaView>
    );
  }

  const total = getTotal();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Animated.FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        itemLayoutAnimation={LinearTransition.springify()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <CartItemRow
            item={item}
            onIncrease={() => increaseQuantity(item.id)}
            onDecrease={() => decreaseQuantity(item.id)}
            onRemove={() => removeFromCart(item.id)}
          />
        )}
        ListFooterComponent={
          <Animated.View entering={FadeIn.duration(300)} style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <AnimatedTotal total={total} />
            </View>

            <AnimatedPressable
              style={styles.checkoutButton}
              onPress={() => router.push('/checkout')}>
              <Text style={styles.checkoutText}>Ir a resumen</Text>
            </AnimatedPressable>

            <AnimatedPressable style={styles.clearButton} onPress={clearCart}>
              <Text style={styles.clearText}>Vaciar carrito</Text>
            </AnimatedPressable>
          </Animated.View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.background,
  },
  list: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: AppColors.card,
    padding: 16,
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
  checkoutButton: {
    backgroundColor: AppColors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  clearButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  clearText: {
    color: AppColors.danger,
    fontSize: 15,
    fontWeight: '600',
  },
});
