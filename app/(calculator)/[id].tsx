import { ThemedText } from '@/components/ThemedText';
import { CALCULATIONS } from '@/data/calculations';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useState, useEffect } from 'react';
import { Keyboard, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { loadCalculatorConfig } from '@/app/calculator/config';
import { CalculatorConfig } from '@/app/calculator/config/calculator';
import { CalculatorForm } from '@/app/calculator/components/CalculatorForm';
import { CalculatorResult } from '@/app/calculator/components/CalculatorResult';

type Tab = 'calculator' | 'facts';

export default function CalculatorScreen() {
  const { id } = useLocalSearchParams();
  const calculator = CALCULATIONS.find(calc => calc.id === id);
  
  const [activeTab, setActiveTab] = useState<Tab>('calculator');
  const [config, setConfig] = useState<CalculatorConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<{ result: number; interpretation: string } | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await loadCalculatorConfig(id as string);
        setConfig(config);
        setError(null);
      } catch (err) {
        setError(`Failed to load calculator: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [id]);

  if (!calculator) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.text}>Calculator not found</ThemedText>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.text}>Loading calculator...</ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.error}>{error}</ThemedText>
      </View>
    );
  }

  if (!config) {
    return null;
  }

  const handleCalculate = () => {
    const validationError = config.validate(values);
    if (validationError) {
      setError(validationError);
      return;
    }

    const calculationResult = config.calculate(values);
    setResult(calculationResult);
    setError(null);
  };

  const handleValueChange = (field: string, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <CalculatorForm
            fields={config.fields}
            values={values}
            onChange={handleValueChange}
            error={error}
            onSubmit={handleCalculate}
          />
          
          {result && (
            <CalculatorResult
              result={result.result}
              interpretation={result.interpretation}
              unit={config.resultUnit}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
  error: {
    fontSize: 18,
    color: '#f00',
  },
}); 