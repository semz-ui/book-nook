// RTL v14 auto-registers its Jest matchers on import of the main entry — no extra import needed.

// reanimated (Collapsible's Animated.View / FadeIn). AnimatedIcon is stubbed per-test because it
// uses Keyframe + worklets that the mock doesn't cover.
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// Official safe-area jest mock: SafeAreaProvider/SafeAreaView passthrough + zeroed insets.
jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock'),
);

// Native SF Symbols view has no meaningful test output — render nothing.
jest.mock('expo-symbols', () => ({ SymbolView: () => null }));
