import Logo from '@/assets/svg/logo.svg';
import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function CalculatorLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Calculators',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="[category]/[id]" 
        options={{ 
          title: 'Calculator',
          headerShown: true,
          headerTitleAlign: 'left',
          headerTitle: () => (
            <View style={styles.headerTitle}>
              <Logo width={28} height={28} />
              <Text style={styles.headerText}>Caldoc</Text>
            </View>
          ),
        }} 
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    fontSize: 18,
    fontFamily: 'DMSans_600SemiBold',
    color: '#111111',
  },
});
