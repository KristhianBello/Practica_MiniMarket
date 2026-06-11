import { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import { AppColors } from '@/constants/colors';
import { useCart } from '@/context/CartContext';

type TabIconProps = {
  focused: boolean;
  color: string;
  size: number;
  filledName: keyof typeof Ionicons.glyphMap;
  outlineName: keyof typeof Ionicons.glyphMap;
  pulse?: boolean;
};

function TabBarIcon({
  focused,
  color,
  size,
  filledName,
  outlineName,
  pulse = false,
}: TabIconProps) {
  const scale = useSharedValue(focused ? 1.1 : 1);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.1 : 1, { damping: 12, stiffness: 200 });
  }, [focused, scale]);

  useEffect(() => {
    if (pulse) {
      scale.value = withSequence(
        withSpring(1.25, { damping: 8, stiffness: 300 }),
        withSpring(1.1, { damping: 12, stiffness: 200 }),
      );
    }
  }, [pulse, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name={focused ? filledName : outlineName} size={size} color={color} />
    </Animated.View>
  );
}

function CartTabIcon({
  color,
  size,
  focused,
}: {
  color: string;
  size: number;
  focused: boolean;
}) {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const prevCount = useRef(itemCount);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (itemCount > prevCount.current) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 400);
      prevCount.current = itemCount;
      return () => clearTimeout(timer);
    }
    prevCount.current = itemCount;
  }, [itemCount]);

  return (
    <TabBarIcon
      focused={focused}
      color={color}
      size={size}
      filledName="cart"
      outlineName="cart-outline"
      pulse={pulse}
    />
  );
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
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              size={size}
              filledName="storefront"
              outlineName="storefront-outline"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Carrito',
          tabBarIcon: ({ color, size, focused }) => (
            <CartTabIcon color={color} size={size} focused={focused} />
          ),
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
          tabBarBadgeStyle: { backgroundColor: AppColors.badge },
        }}
      />
    </Tabs>
  );
}
