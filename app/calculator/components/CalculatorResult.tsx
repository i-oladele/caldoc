import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface CalculatorResultProps {
  result: number | null;
  interpretation: string;
  resultUnit: string;
  error?: string | null;
  formula?: string;
}

export const CalculatorResult: React.FC<CalculatorResultProps> = ({
  result,
  interpretation,
  resultUnit,
  error,
  formula = '1 kilogram = 2.20462 pounds',
}) => {
  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.resultSection}>
        <ThemedText style={styles.sectionTitle}>Result</ThemedText>
        <View style={styles.resultValueContainer}>
          <ThemedText style={styles.resultValue}>
            {result !== null ? result.toFixed(2) : '--'}
          </ThemedText>
          <ThemedText style={styles.resultUnit}>{resultUnit}</ThemedText>
        </View>
      </View>
      
      {interpretation && (
        <View style={styles.interpretationSection}>
          <ThemedText style={styles.interpretationText}>{interpretation}</ThemedText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    marginHorizontal: 8,
    padding: 24,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 16,
    fontFamily: 'DMSans_500Medium',
    textAlign: 'center',
  },
  resultSection: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'DM-Sans',
    marginBottom: 12,
  },
  resultValueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    minHeight: 44,
  },
  resultValue: {
    fontSize: 32,
    fontFamily: 'DMSans_700Bold',
    color: '#3D50B5',
    lineHeight: 36,
    paddingBottom: 2,
  },
  resultUnit: {
    fontSize: 20,
    color: '#666',
    fontFamily: 'DMSans_400Regular',
    marginLeft: 6,
    marginBottom: 4,
    paddingBottom: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
  interpretationSection: {
    marginTop: 16,
    marginBottom: 8,
  },
  interpretationText: {
    fontSize: 20,
    color: '#000000',
    lineHeight: 28,
    fontFamily: 'DMSans_400Regular',
    marginTop: 2,
  },
});
