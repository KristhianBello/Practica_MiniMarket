import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { EmptyState } from '@/components/EmptyState';
import { AppColors } from '@/constants/colors';
import { useCart } from '@/context/CartContext';

export default function CheckoutScreen() {
  const { cart, getTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <EmptyState
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
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Resumen de tu compra</Text>

        {cart.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQty}>
                {item.quantity} x ${item.price.toFixed(2)}
              </Text>
            </View>
            <Text style={styles.itemSubtotal}>${(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total a pagar</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Confirmar compra</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: AppColors.card,
    padding: 16,
    borderRadius: 10,
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
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
