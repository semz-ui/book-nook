/**
 * VIEW — search input with a leading glyph and a clear button.
 */

import { SymbolView } from 'expo-symbols';
import { Pressable, TextInput, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export function SearchBar({ value, onChangeText, placeholder = 'Search' }: SearchBarProps) {
  const theme = useTheme();

  return (
    <View className="flex-row items-center gap-two rounded-full bg-element px-three py-two">
      <SymbolView
        tintColor={theme.textSecondary}
        name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
        size={18}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        className="flex-1 py-one text-[16px]"
        style={{ color: theme.text }}
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel="Search books"
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText('')}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={8}
          className="active:opacity-60">
          <SymbolView
            tintColor={theme.textSecondary}
            name={{ ios: 'xmark.circle.fill', android: 'cancel', web: 'cancel' }}
            size={18}
          />
        </Pressable>
      )}
    </View>
  );
}
