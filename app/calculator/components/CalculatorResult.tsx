import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface CalculatorResultProps {
  result: number;
  interpretation: string;
  unit: string;
}

export const CalculatorResult: React.FC<CalculatorResultProps> = ({
  result,
  interpretation,
  unit
}) => {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Result</ThemedText>
      <View style={styles.valueContainer}>
        <ThemedText style={styles.value}>{result}</ThemedText>
        <ThemedText style={styles.unit}>{unit}</ThemedText>
      </View>
      <ThemedText style={styles.interpretation}>{interpretation}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: '600',
  },
  unit: {
    fontSize: 18,
    marginLeft: 4,
    fontWeight: '500',
  },
  interpretation: {
    fontSize: 16,
    color: '#333',
  },
});
