/**
 * VIEW — animated shimmer placeholders shown while data loads.
 */

import { useEffect } from 'react';
import { View, type DimensionValue } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

type SkeletonProps = {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  className?: string;
};

/** A single pulsing block. */
export function Skeleton({ width = '100%', height = 16, radius = 8, className }: SkeletonProps) {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, [opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      className={`bg-element ${className ?? ''}`}
      style={[{ width, height, borderRadius: radius }, style]}
    />
  );
}

/** A row of skeletons matching the BookCard layout. */
export function BookCardSkeleton() {
  return (
    <View className="flex-row gap-three rounded-four bg-element/50 p-three">
      <Skeleton width={64} height={96} radius={8} />
      <View className="flex-1 justify-center gap-two">
        <Skeleton width="80%" height={14} />
        <Skeleton width="50%" height={12} />
        <Skeleton width="30%" height={12} />
      </View>
    </View>
  );
}

/** A full list of card skeletons for the browse screen. */
export function BookListSkeleton({ count = 7 }: { count?: number }) {
  return (
    <View className="gap-three px-four pt-two">
      {Array.from({ length: count }, (_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </View>
  );
}
