import { router } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CartItemRow } from '@/components/CartItem';
import { EmptyState } from '@/components/EmptyState';
import { AppColors } from '@/constants/colors';
import { useCart } from '@/context/CartContext';

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
          title="Tu carrito está vacío"
          message="Explora el catálogo y agrega productos para comenzar tu compra."
        />
      </SafeAreaView>
    );
  }

  const total = getTotal();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
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
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
            </View>

            <Pressable style={styles.checkoutButton} onPress={() => router.push('/checkout')}>
              <Text style={styles.checkoutText}>Ir a resumen</Text>
            </Pressable>

            <Pressable style={styles.clearButton} onPress={clearCart}>
              <Text style={styles.clearText}>Vaciar carrito</Text>
            </Pressable>
          </View>
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
