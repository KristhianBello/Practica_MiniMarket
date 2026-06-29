/**
 * Estado global del carrito de compras (Context API + AsyncStorage).
 * Criterio de la rúbrica: estado compartido entre pantallas con persistencia local.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Toast from 'react-native-toast-message';

import { CartItem, Product } from '@/types';
import { getAvailableStock, getCartQuantity, getItemCount, getTotal } from '@/utils/cartHelpers';

const STORAGE_KEY = '@minimarket_cart';

type CartContextType = {
  cart: CartItem[];
  isLoading: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getCartQuantity: (productId: number) => number;
  getAvailableStock: (productId: number, totalStock: number) => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCart() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setCart(JSON.parse(stored) as CartItem[]);
        }
      } catch {
        Toast.show({ type: 'error', text1: 'Error al cargar el carrito' });
      } finally {
        setIsLoading(false);
      }
    }

    loadCart();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cart)).catch(() => {
      Toast.show({ type: 'error', text1: 'Error al guardar el carrito' });
    });
  }, [cart, isLoading]);

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      // INTENTIONALLY BROKEN: This logic now causes duplicates instead of grouping by ID
 // 1. Verificar si ya existe en el carrito
    const existing = prev.find((item) => item.id === product.id);

    // 2. Si existe, mapear el arreglo y actualizar cantidad
    if (existing) {
      return prev.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
      );
    }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          imageKey: product.imageKey,
          quantity: 1,
          stock: product.stock,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const increaseQuantity = useCallback((productId: number) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === productId);
      if (!item) return prev;

      if (item.quantity >= item.stock) {
        Toast.show({ type: 'error', text1: 'Stock máximo alcanzado' });
        return prev;
      }

      return prev.map((i) => (i.id === productId ? { ...i, quantity: i.quantity + 1 } : i));
    });
  }, []);

  const decreaseQuantity = useCallback((productId: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(async () => {
    setCart([]);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {
      Toast.show({ type: 'error', text1: 'Error al vaciar el carrito' });
    }
  }, []);

  const value = useMemo(
    () => ({
      cart,
      isLoading,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      getTotal: () => getTotal(cart),
      getItemCount: () => getItemCount(cart),
      getCartQuantity: (productId: number) => getCartQuantity(cart, productId),
      getAvailableStock: (productId: number, totalStock: number) =>
        getAvailableStock(cart, productId, totalStock),
    }),
    [
      cart,
      isLoading,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
}
