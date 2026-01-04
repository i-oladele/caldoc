import { CalculatorForm } from '@/app/calculator/components/CalculatorForm';
import { CalculatorResult } from '@/app/calculator/components/CalculatorResult';
import { CalculationResult, CalculatorValues } from '@/app/calculator/config/calculator';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

type Tab = 'calculator' | 'facts';

export default function CalculatorScreen() {
  const { category, id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>('calculator');
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [values, setValues] = useState<CalculatorValues>({});
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToResult = () => {
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });
  };

  useEffect(() => {
    const loadCalculator = async () => {
      try {
        // Static import map for calculator configs
        const calculatorImports = {
          // Format: 'category/calculatorId': () => import('@/app/calculator/config/categories/category/calculatorId'),
          // Example: 'cardiac/cardiac-output': () => import('@/app/calculator/config/categories/cardiac/cardiac-output'),
          
          //Cardiology
          'cardiology/cardiac-output': () => 
            require('@/app/calculator/config/categories/cardiology/cardiac-output'),
          'cardiology/abi': () => 
            require('@/app/calculator/config/categories/cardiology/abi'),
          'cardiology/cha2ds2-vasc': () => 
            require('@/app/calculator/config/categories/cardiology/cha2ds2-vasc'),
          'cardiology/cha2ds2': () => 
            require('@/app/calculator/config/categories/cardiology/cha2ds2'),
          'cardiology/framingham': () => 
            require('@/app/calculator/config/categories/cardiology/framingham'),
          'cardiology/friedewald': () => 
            require('@/app/calculator/config/categories/cardiology/friedewald'),
          'cardiology/map': () => 
            require('@/app/calculator/config/categories/cardiology/map'),
          'cardiology/qtc': () => 
            require('@/app/calculator/config/categories/cardiology/qtc'),
          'cardiology/reynolds': () => 
            require('@/app/calculator/config/categories/cardiology/reynolds'),

          //Critical Care
          'critical-care/apache-ii': () => 
            require('@/app/calculator/config/categories/critical-care/apache-ii'),
          'critical-care/estimated-blood-loss': () => 
            require('@/app/calculator/config/categories/critical-care/estimated-blood-loss'),
          'critical-care/lactate-clearance': () => 
            require('@/app/calculator/config/categories/critical-care/lactate-clearance'),
          'critical-care/shock-index': () => 
            require('@/app/calculator/config/categories/critical-care/shock-index'),
          'critical-care/shock-volume': () => 
            require('@/app/calculator/config/categories/critical-care/shock-volume'),
          'critical-care/sofa': () => 
            require('@/app/calculator/config/categories/critical-care/sofa'),
          
          //Gastroenterology
          'gastroenterology/glasgow-blatchford': () => 
            require('@/app/calculator/config/categories/gastroenterology/glasgow-blatchford'),
          
          //General
          'general/bmi': () => 
            require('@/app/calculator/config/categories/general/bmi'),
          'general/bsa': () => 
            require('@/app/calculator/config/categories/general/bsa'),
          'general/ibw': () => 
            require('@/app/calculator/config/categories/general/ibw'),
          'general/estimated-blood-volume': () => 
            require('@/app/calculator/config/categories/general/estimated-blood-volume'),
          
          //Hematology
          'hematology/hematocrit': () => 
            require('@/app/calculator/config/categories/hematology/hematocrit'),
          'hematology/warfarin-dose': () => 
            require('@/app/calculator/config/categories/hematology/warfarin-dose'),
          'hematology/wells-dvt': () => 
            require('@/app/calculator/config/categories/hematology/wells-dvt'),
          

          //Hepatology
          'hepatology/child-pugh': () => 
            require('@/app/calculator/config/categories/hepatology/child-pugh'),
          'hepatology/alp-ratio': () => 
            require('@/app/calculator/config/categories/hepatology/alp-ratio'),
          'hepatology/meld': () => 
            require('@/app/calculator/config/categories/hepatology/meld'),

          //Metabolism
          'metabolism/anion-gap': () => 
            require('@/app/calculator/config/categories/metabolism/anion-gap'),
          'metabolism/corrected-anion-gap': () => 
            require('@/app/calculator/config/categories/metabolism/corrected-anion-gap'),
          'metabolism/transferrin-saturation': () => 
            require('@/app/calculator/config/categories/metabolism/transferrin-saturation'),
          'metabolism/serum-osmolality': () => 
            require('@/app/calculator/config/categories/metabolism/serum-osmolality'),
          'metabolism/corrected-calcium': () => 
            require('@/app/calculator/config/categories/metabolism/corrected-calcium'),
          
          //Nephrology
          'nephrology/creatinine-clearance': () => 
            require('@/app/calculator/config/categories/nephrology/creatinine-clearance'),
          'nephrology/egfr': () => 
            require('@/app/calculator/config/categories/nephrology/egfr'),
          'nephrology/fen': () => 
            require('@/app/calculator/config/categories/nephrology/fen'),
          'nephrology/trp': () => 
            require('@/app/calculator/config/categories/nephrology/trp'),
          
          //Neurology
          'neurology/gcs': () => 
            require('@/app/calculator/config/categories/neurology/gcs'),
          
          //Obstetrics
          'obstetrics/gestational-age': () => 
            require('@/app/calculator/config/categories/obstetrics/gestational-age'),
          
          //Pediatrics
          'pediatrics/apgar': () => 
            require('@/app/calculator/config/categories/pediatrics/apgar'),
          'pediatrics/bmi-percentile': () => 
            require('@/app/calculator/config/categories/pediatrics/bmi-percentile'),
          'pediatrics/child-dose': () => 
            require('@/app/calculator/config/categories/pediatrics/child-dose'),
          'pediatrics/pediatric-gcs': () => 
            require('@/app/calculator/config/categories/pediatrics/pediatric-gcs'),
          
          //Pharmacology
          'pharmacology/infusion-rate': () => 
            require('@/app/calculator/config/categories/pharmacology/infusion-rate'),
          'pharmacology/gravity-infusion': () => 
            require('@/app/calculator/config/categories/pharmacology/gravity-infusion'),
          'pharmacology/naranjo': () => 
            require('@/app/calculator/config/categories/pharmacology/naranjo'),
          
          //Respiratory
          'respiratory/ahi': () => 
            require('@/app/calculator/config/categories/respiratory/ahi'),
          'respiratory/alveolar-gas': () => 
            require('@/app/calculator/config/categories/respiratory/alveolar-gas'),
          'respiratory/blood-oxygen': () => 
            require('@/app/calculator/config/categories/respiratory/blood-oxygen'),
          'respiratory/curb65': () => 
            require('@/app/calculator/config/categories/respiratory/curb65'),
          'respiratory/curb-65': () => 
            require('@/app/calculator/config/categories/respiratory/curb65'),
          'respiratory/oxygenation-index': () => 
            require('@/app/calculator/config/categories/respiratory/oxygenation-index'),
          'respiratory/p50': () => 
            require('@/app/calculator/config/categories/respiratory/p50'),
          'respiratory/tcpo2-pao2': () => 
            require('@/app/calculator/config/categories/respiratory/tcpo2-pao2'),
          'respiratory/tcpo2': () => 
            require('@/app/calculator/config/categories/respiratory/tcpo2'),
          'respiratory/tidal-volume': () => 
            require('@/app/calculator/config/categories/respiratory/tidal-volume'),
          
          //Surgery
          'surgery/alvarado': () => 
            require('@/app/calculator/config/categories/surgery/alvarado'),
        };

        const importPath = `${category}/${id}`;
        console.log('Looking for calculator:', importPath);
        console.log('Available calculators:', Object.keys(calculatorImports));
        
        const importFn = calculatorImports[importPath as keyof typeof calculatorImports];

        if (!importFn) {
          console.error('Available calculator keys:', Object.keys(calculatorImports));
          throw new Error(`Calculator not found: ${importPath}`);
        }

        const module = await importFn();
        const configKey = `${id.toString().replace(/-([a-z])/g, (g) => g[1].toUpperCase())}Config`;
        setConfig(module[configKey]);
        setFormError(null);
      } catch (err) {
        console.error('Error loading calculator:', err);
        setFormError(`Failed to load calculator: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    loadCalculator();
  }, [category, id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.text}>Loading calculator...</ThemedText>
      </View>
    );
  }

  if (formError || !config) {
    return (
      <View style={styles.container}>
        <ThemedText style={[styles.text, styles.error]}>{formError || 'Calculator not found'}</ThemedText>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentWrapper}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>{config.name}</ThemedText>
            <ThemedText style={styles.description}>{config.description}</ThemedText>
          </View>

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
                Info
              </ThemedText>
            </TouchableOpacity>
          </View>

          {activeTab === 'calculator' ? (
            <View style={styles.content}>
              <CalculatorForm
                fields={config.fields}
                values={values}
                onChange={(field, value) => {
                  // Clear error for this field when user types
                  if (errors[field]) {
                    const newErrors = { ...errors };
                    delete newErrors[field];
                    setErrors(newErrors);
                  }
                  setValues(prev => ({ ...prev, [field]: value }));
                }}
                onReset={() => {
                  setValues({});
                  setErrors({});
                  setFormError(null);
                  setResult(null);
                }}
                onSubmit={(e) => {
                  e?.preventDefault?.(); // Prevent form submission
                  try {
                    // Clear previous errors
                    setErrors({});
                    setFormError(null);
                    
                    // Validate form
                    const validationErrors = config.validate(values);
                    
                    if (validationErrors) {
                      if (typeof validationErrors === 'string') {
                        // For backward compatibility with string errors
                        setFormError(validationErrors);
                      } else if (Object.keys(validationErrors).length > 0) {
                        // Set field-specific errors
                        setErrors(validationErrors);
                        // Also show the first error as a form-level error
                        const firstErrorKey = Object.keys(validationErrors)[0];
                        const firstError = validationErrors[firstErrorKey];
                        setFormError(`Error: ${firstError}`);
                        // Scroll to the first error
                        setTimeout(() => {
                          const element = document.getElementById(`field-${firstErrorKey}`);
                          element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 100);
                      }
                      setResult(null);
                      return false; // Prevent form submission
                    }
                    
                    // If validation passes, calculate the result
                    const calculationResult = config.calculate(values);
                    setResult(calculationResult);
                    scrollToResult();
                    return true; // Allow form submission
                  } catch (err) {
                    setFormError(`Calculation error: ${err instanceof Error ? err.message : 'Unknown error'}`);
                    setResult(null);
                    return false; // Prevent form submission
                  }
                }}
                errors={errors}
              />
              {result && (
                <CalculatorResult 
                  result={result.result} 
                  interpretation={result.interpretation} 
                  resultUnit={config.resultUnit}
                  error={formError}
                  status={result.status}
                />
              )}
            </View>
          ) : (
            <View style={styles.factsContainer}>
              {config.formula && (
                <View style={styles.section}>
                  <ThemedText style={styles.sectionTitle}>Formula</ThemedText>
                  <ThemedText style={styles.formula}>{config.formula}</ThemedText>
                </View>
              )}
              {config.references && config.references.length > 0 && (
                <View style={styles.section}>
                  <ThemedText style={styles.sectionTitle}>References</ThemedText>
                  {config.references.map((ref: string, index: number) => (
                    <ThemedText key={index} style={styles.reference}>
                      • {ref}
                    </ThemedText>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
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
  contentWrapper: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    flexGrow: 1,
    padding: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3D50B5',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#3D50B5',
    fontWeight: '600',
  },
  factsContainer: {
    padding: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  formula: {
    fontFamily: 'Courier',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 4,
    color: '#333',
    marginBottom: 8,
  },
  reference: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
    lineHeight: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  error: {
    color: '#D32F2F',
  },
});
