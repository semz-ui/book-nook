import '@/global.css';

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { CartButton } from '@/features/cart/components/cart-button';
import { FlyToCartProvider } from '@/features/cart/components/fly-to-cart';
import { Colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <FlyToCartProvider>
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.text,
              headerTitleStyle: { color: colors.text },
              contentStyle: { backgroundColor: colors.background },
              headerRight: () => <CartButton />,
            }}>
            <Stack.Screen name="index" options={{ title: 'Book Nook' }} />
            <Stack.Screen name="book/[id]" options={{ title: 'Details' }} />
            <Stack.Screen name="cart" options={{ title: 'Your Cart' }} />
            <Stack.Screen name="checkout" options={{ title: 'Checkout' }} />
          </Stack>
        </FlyToCartProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
