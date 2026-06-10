import { Tabs } from 'expo-router';
import { Text } from 'react-native';

import { AppColors } from '@/constants/colors';
import { useCart } from '@/context/CartContext';

function TabIcon({ label }: { label: string }) {
  return <Text style={{ fontSize: 20 }}>{label}</Text>;
}

export default function TabLayout() {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: AppColors.primary,
        tabBarInactiveTintColor: AppColors.textSecondary,
        tabBarStyle: {
          backgroundColor: AppColors.card,
          borderTopColor: AppColors.border,
        },
        headerStyle: { backgroundColor: AppColors.card },
        headerTintColor: AppColors.text,
        headerTitleStyle: { fontWeight: '700' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Catálogo',
          tabBarIcon: () => <TabIcon label="🏪" />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Carrito',
          tabBarIcon: () => <TabIcon label="🛒" />,
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
          tabBarBadgeStyle: { backgroundColor: AppColors.badge },
        }}
      />
    </Tabs>
  );
}
