import { CartItem } from '@/types';

export function getTotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getItemCount(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartQuantity(cart: CartItem[], productId: number): number {
  return cart.find((item) => item.id === productId)?.quantity ?? 0;
}

/** Stock restante = stock del catálogo − unidades ya en el carrito */
export function getAvailableStock(cart: CartItem[], productId: number, totalStock: number): number {
  return Math.max(0, totalStock - getCartQuantity(cart, productId));
}
