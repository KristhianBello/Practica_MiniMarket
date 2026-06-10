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
import { getItemCount, getTotal } from '@/utils/cartHelpers';

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
    if (product.stock <= 0) {
      Toast.show({ type: 'error', text1: 'Producto sin stock disponible' });
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        if (existing.quantity >= product.stock) {
          Toast.show({ type: 'error', text1: 'Stock máximo alcanzado' });
          return prev;
        }

        Toast.show({ type: 'success', text1: 'Producto agregado', text2: product.name });
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      Toast.show({ type: 'success', text1: 'Producto agregado', text2: product.name });
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
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
