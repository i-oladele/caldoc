import { ThemedText } from '@/components/ThemedText';
import { CALCULATIONS } from '@/data/calculations';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, SafeAreaView, TouchableOpacity } from 'react-native';
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

  if (!config) {
    return null;
  }

  const handleCalculate = () => {
    try {
      const validationError = config.validate(values);
      if (validationError) {
        throw new Error(validationError);
      }
      const calculationResult = config.calculate(values);
      setResult(calculationResult);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during calculation');
      setResult(null);
    }
  };

  const handleValueChange = (field: string, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setValues({});
    setResult(null);
    setError(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>{calculator?.name}</ThemedText>
          <ThemedText style={styles.subtitle}>{calculator?.description}</ThemedText>
          
          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'calculator' && styles.activeTab]}
              onPress={() => setActiveTab('calculator')}
            >
              <ThemedText style={[styles.tabText, activeTab === 'calculator' && styles.activeTabText]}>
                Calculator
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'facts' && styles.activeTab]}
              onPress={() => setActiveTab('facts')}
            >
              <ThemedText style={[styles.tabText, activeTab === 'facts' && styles.activeTabText]}>
                Facts
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {activeTab === 'calculator' ? (
          <View style={styles.content}>
            <CalculatorForm
              fields={config.fields}
              values={values}
              onChange={handleValueChange}
              onSubmit={handleCalculate}
              onReset={handleReset}
              error={error}
            />
            <CalculatorResult
              result={result?.result || null}
              interpretation={result?.interpretation || ''}
              resultUnit={config.resultUnit}
              error={error}
            />
          </View>
        ) : (
          <View style={styles.factsContainer}>
            {config.formula && (
              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Formula</ThemedText>
                <ThemedText style={styles.formulaText}>{config.formula}</ThemedText>
              </View>
            )}
            {config.references && config.references.length > 0 && (
              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>References</ThemedText>
                {config.references.map((ref, index) => (
                  <ThemedText key={index} style={styles.referenceText}>
                    • {ref}
                  </ThemedText>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  header: {
    padding: 24,
    paddingBottom: 0,
  },
  title: {
    fontSize: 28,
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'DMSans_700Bold',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
    fontFamily: 'DMSans_400Regular',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3D50B5',
  },
  tabText: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'DMSans_500Medium',
  },
  activeTabText: {
    color: '#3D50B5',
    fontWeight: '600',
    fontFamily: 'DMSans_600SemiBold',
  },
  content: {
    padding: 20,
  },
  factsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    marginTop: 0,
    marginHorizontal: 8, // Increased width by reducing horizontal margin
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
    fontFamily: 'DMSans_600SemiBold',
  },
  formulaText: {
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    fontFamily: 'DMSans_400Regular',
    lineHeight: 24,
  },
  referenceText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 20,
    fontFamily: 'DMSans_400Regular',
  },
  error: {
    color: '#FF3B30',
    textAlign: 'center',
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    fontSize: 16,
    fontFamily: 'DMSans_400Regular',
  },
  text: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    padding: 20,
    fontFamily: 'DMSans_400Regular',
  },
}); 