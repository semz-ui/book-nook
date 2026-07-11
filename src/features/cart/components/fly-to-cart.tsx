/**
 * VIEW + animation infra — the "fly to cart" effect.
 *
 * A root-level provider renders a full-screen overlay. When `flyToCart` is
 * called with a start position + cover image, a Reanimated ghost animates from
 * that point up toward the header cart icon while shrinking and fading out.
 */

import { Image } from 'expo-image';
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type FlyParams = {
  coverUrl: string;
  /** Window coordinates of the ghost's starting top-left corner. */
  startX: number;
  startY: number;
  size?: number;
};

type FlyToCartContextValue = { flyToCart: (params: FlyParams) => void };

const FlyToCartContext = createContext<FlyToCartContextValue>({ flyToCart: () => {} });

export const useFlyToCart = () => useContext(FlyToCartContext);

const GHOST_SIZE = 48;
const DURATION = 650;

export function FlyToCartProvider({ children }: { children: ReactNode }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [flight, setFlight] = useState<FlyParams | null>(null);

  const progress = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  // Approximate the header cart icon (top-right).
  const targetX = width - 52;
  const targetY = insets.top - 29;

  const clear = useCallback(() => setFlight(null), []);

  const flyToCart = useCallback(
    (params: FlyParams) => {
      setFlight(params);
      /* eslint-disable react-hooks/immutability -- Reanimated shared values are
         designed to be mutated imperatively on demand; the React Compiler
         immutability rule doesn't model UI-thread shared values. */
      startX.value = params.startX;
      startY.value = params.startY;
      progress.value = 0;
      progress.value = withTiming(
        1,
        { duration: DURATION, easing: Easing.inOut(Easing.quad) },
        (finished) => {
          if (finished) scheduleOnRN(clear);
        },
      );
      /* eslint-enable react-hooks/immutability */
    },
    [clear, progress, startX, startY],
  );

  const ghostStyle = useAnimatedStyle(() => {
    const p = progress.value;
    const x = startX.value + (targetX - startX.value) * p;
    const y = startY.value + (targetY - startY.value) * p;
    return {
      transform: [{ translateX: x }, { translateY: y }, { scale: 1 - 0.7 * p }],
      opacity: 1 - 0.6 * p,
    };
  });

  return (
    <FlyToCartContext.Provider value={{ flyToCart }}>
      {children}
      {flight && (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1000,
              borderRadius: 6,
              // Soft lift while airborne.
              boxShadow: '0 6px 16px rgba(0,0,0,0.35)',
            },
            ghostStyle,
          ]}>
          <Image
            source={flight.coverUrl}
            style={{
              width: flight.size ?? GHOST_SIZE,
              height: (flight.size ?? GHOST_SIZE) * 1.5,
              borderRadius: 6,
            }}
          />
        </Animated.View>
      )}
    </FlyToCartContext.Provider>
  );
}
