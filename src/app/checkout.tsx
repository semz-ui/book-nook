/**
 * VIEW — Checkout screen. Thin over the useCheckout ViewModel.
 * Shows order summary + shipping form, submitting/error/success states.
 */

import { Link } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { ActivityIndicator, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BookPrice } from '@/features/books/components/book-price';
import type { ShippingDetails } from '@/features/checkout/models/order';
import { useCheckout } from '@/features/checkout/viewmodels/use-checkout';
import { useTheme } from '@/hooks/use-theme';

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'words';
}) {
  const theme = useTheme();
  return (
    <View className="gap-one">
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        className="rounded-four border border-border bg-element px-three py-three text-[16px]"
        style={{ color: theme.text }}
        accessibilityLabel={label}
      />
    </View>
  );
}

export default function CheckoutScreen() {
  const { form, setField, isFormValid, totalItems, totalPrice, isSubmitting, isSuccess, error, order, submit } =
    useCheckout();
  const theme = useTheme();

  if (isSuccess && order) {
    return (
      <ThemedView className="flex-1 items-center justify-center gap-three px-four">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-selected">
          <SymbolView
            tintColor={theme.primary}
            name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
            size={48}
          />
        </View>
        <ThemedText type="subtitle" className="text-center text-[26px] leading-[32px]">
          Order confirmed
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" className="text-center">
          Thanks, {order.shipping.fullName.split(' ')[0]}! Your order{' '}
          <ThemedText type="smallBold">{order.id}</ThemedText> is on its way.
        </ThemedText>
        <BookPrice value={order.total} type="subtitle" className="text-[22px]" />
        <Link href="/" asChild>
          <Pressable className="mt-two rounded-full bg-primary px-five py-three active:opacity-70">
            <ThemedText themeColor="primaryForeground" type="smallBold">
              Continue shopping
            </ThemedText>
          </Pressable>
        </Link>
      </ThemedView>
    );
  }

  const fields: {
    key: keyof ShippingDetails;
    label: string;
    placeholder: string;
    keyboardType?: 'default' | 'email-address';
    autoCapitalize?: 'none' | 'words';
  }[] = [
    { key: 'fullName', label: 'Full name', placeholder: 'Ada Lovelace', autoCapitalize: 'words' },
    { key: 'email', label: 'Email', placeholder: 'ada@example.com', keyboardType: 'email-address', autoCapitalize: 'none' },
    { key: 'address', label: 'Shipping address', placeholder: '123 Book St, Lagos' },
  ];

  return (
    <ThemedView className="flex-1">
      <ScrollView contentContainerClassName="gap-four p-four" keyboardShouldPersistTaps="handled">
        <View
          className="gap-three rounded-four bg-element p-four"
          style={{ boxShadow: '0 2px 10px rgba(11,26,43,0.06)' }}>
          <ThemedText type="smallBold">Order summary</ThemedText>
          <View className="flex-row items-center justify-between">
            <ThemedText type="small" themeColor="textSecondary">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </ThemedText>
            <BookPrice value={totalPrice} type="subtitle" className="text-[22px] leading-[26px]" />
          </View>
        </View>

        <View className="gap-three">
          <ThemedText type="smallBold">Shipping details</ThemedText>
          {fields.map((f) => (
            <Field
              key={f.key}
              label={f.label}
              value={form[f.key]}
              onChangeText={(t) => setField(f.key, t)}
              placeholder={f.placeholder}
              keyboardType={f.keyboardType}
              autoCapitalize={f.autoCapitalize}
            />
          ))}
        </View>

        {error && (
          <View className="flex-row items-center gap-two rounded-four bg-selected px-three py-two">
            <SymbolView
              tintColor="#E5484D"
              name={{ ios: 'exclamationmark.triangle.fill', android: 'warning', web: 'warning' }}
              size={16}
            />
            <ThemedText type="small" style={{ color: '#E5484D' }} className="flex-1">
              {error}
            </ThemedText>
          </View>
        )}
      </ScrollView>

      <View
        className="border-t border-border bg-background"
        style={{ boxShadow: '0 -4px 16px rgba(11,26,43,0.06)' }}>
        <SafeAreaView edges={['bottom']}>
          <View className="gap-two p-four">
            <Pressable
              onPress={submit}
              disabled={!isFormValid || isSubmitting}
              className={`h-14 flex-row items-center justify-center gap-two rounded-full ${isFormValid && !isSubmitting ? 'bg-primary active:opacity-70' : 'bg-element'}`}
              style={isFormValid && !isSubmitting ? { boxShadow: '0 6px 16px rgba(32,138,239,0.35)' } : undefined}
              accessibilityRole="button"
              accessibilityLabel="Place order">
              {isSubmitting ? (
                <ActivityIndicator color={theme.primaryForeground} />
              ) : (
                <>
                  <SymbolView
                    tintColor={isFormValid ? theme.primaryForeground : theme.textSecondary}
                    name={{ ios: 'lock.fill', android: 'lock', web: 'lock' }}
                    size={16}
                  />
                  <ThemedText themeColor={isFormValid ? 'primaryForeground' : 'textSecondary'} type="smallBold">
                    Place Order · {`$${totalPrice.toFixed(2)}`}
                  </ThemedText>
                </>
              )}
            </Pressable>
            <ThemedText type="small" themeColor="textSecondary" className="text-center">
              Secure checkout · your details are encrypted
            </ThemedText>
          </View>
        </SafeAreaView>
      </View>
    </ThemedView>
  );
}
