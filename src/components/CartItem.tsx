import { Pressable, StyleSheet, Text, View } from 'react-native';

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

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)} c/u</Text>
        <Text style={styles.subtotal}>Subtotal: ${subtotal.toFixed(2)}</Text>
      </View>

      <View style={styles.actions}>
        <View style={styles.quantityControls}>
          <Pressable style={styles.qtyButton} onPress={onDecrease}>
            <Text style={styles.qtyButtonText}>−</Text>
          </Pressable>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <Pressable style={styles.qtyButton} onPress={onIncrease}>
            <Text style={styles.qtyButtonText}>+</Text>
          </Pressable>
        </View>
        <Pressable style={styles.removeButton} onPress={onRemove}>
          <Text style={styles.removeText}>Eliminar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
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
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: AppColors.background,
    borderWidth: 1,
    borderColor: AppColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.text,
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  removeText: {
    fontSize: 13,
    color: AppColors.danger,
    fontWeight: '500',
  },
});
