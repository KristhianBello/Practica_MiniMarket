import 'react-native-reanimated';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';

import { CartProvider } from '@/context/CartContext';

export default function RootLayout() {
  return (
    <CartProvider>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="product/[id]"
          options={{
            title: 'Detalle del producto',
            headerBackTitle: 'Volver',
            headerBackVisible: true,
          }}
        />
        <Stack.Screen
          name="checkout"
          options={{ title: 'Resumen de compra', headerBackTitle: 'Volver' }}
        />
      </Stack>
      <Toast />
    </CartProvider>
  );
}
