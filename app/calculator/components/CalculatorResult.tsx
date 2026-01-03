import { CalculationStatus } from '@/app/calculator/config/calculator';
import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface CalculatorResultProps {
  result: number | null;
  interpretation: string;
  resultUnit: string;
  status?: CalculationStatus;
}

const STATUS_STYLES = {
  success: {
    container: {
      backgroundColor: '#F0FDF4',
      borderColor: '#86EFAC',
    },
    value: '#15803D',
  },
  warning: {
    container: {
      backgroundColor: '#FFFBEB',
      borderColor: '#FDE68A',
    },
    value: '#B45309',
  },
  danger: {
    container: {
      backgroundColor: '#FEF2F2',
      borderColor: '#FCA5A5',
    },
    value: '#B91C1C',
  },
} as const;

export const CalculatorResult: React.FC<CalculatorResultProps> = ({
  result,
  interpretation,
  resultUnit,
  status,
}) => {
const statusStyles = status ? STATUS_STYLES[status] : null;
  const interpretationLines = interpretation ? interpretation.split('\n') : [];

  return (
    <View style={[styles.container, statusStyles?.container]}>
      <View style={styles.resultSection}>
        <ThemedText style={styles.sectionTitle}>Result</ThemedText>
        <View style={styles.resultValueContainer}>
          <ThemedText style={[styles.resultValue, statusStyles && { color: statusStyles.value }]}>
            {result !== null ? result.toFixed(2) : '--'}
          </ThemedText>
          <ThemedText style={styles.resultUnit}>{resultUnit}</ThemedText>
        </View>
      </View>
      
      {interpretation && (
        <View style={styles.interpretationSection}>
          {interpretationLines.map((line, index) => {
            if (!line.trim()) {
              return <View key={`line-${index}`} style={styles.interpretationSpacer} />;
            }

            const isProbabilityLine = line.toLowerCase().startsWith('probability of appendicitis');
            return (
              <ThemedText
                key={`line-${index}`}
                style={[styles.interpretationText, isProbabilityLine && styles.interpretationTextBold]}
              >
                {line}
              </ThemedText>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
  interpretationTextBold: {
    fontFamily: 'DMSans_700Bold',
  },
  interpretationSpacer: {
    height: 8,
  },
});
