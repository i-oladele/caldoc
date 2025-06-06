import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { InputField } from '../config/calculator';
import { ThemedText } from '@/components/ThemedText';

interface CalculatorFormProps {
  fields: InputField[];
  values: { [key: string]: string };
  onChange: (field: string, value: string) => void;
  error?: string | null;
  onSubmit: () => void;
  onReset: () => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  fields,
  values,
  onChange,
  error,
  onSubmit,
  onReset,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <ThemedText style={styles.title}>Input Values</ThemedText>
        <TouchableOpacity onPress={onReset} style={styles.resetButton}>
          <ThemedText style={styles.resetButtonText}>Reset</ThemedText>
        </TouchableOpacity>
      </View>
      {fields.map((field) => (
        <View key={field.label} style={styles.inputContainer}>
          <ThemedText style={styles.label}>{field.label}</ThemedText>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
              value={values[field.label]}
              onChangeText={(text) => onChange(field.label, text)}
            />
            <ThemedText style={styles.unit}>{field.unit}</ThemedText>
          </View>
        </View>
      ))}
      

      
      <TouchableOpacity 
        style={styles.submitButton}
        onPress={onSubmit}
        activeOpacity={0.8}
      >
        <ThemedText style={styles.submitButtonText}>Calculate</ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    marginHorizontal: 8, // Increased width by reducing horizontal margin
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    fontFamily: 'DMSans_600SemiBold',
  },
  resetButton: {
    padding: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#F5F5F5',
  },
  resetButtonText: {
    color: '#3D50B5',
    fontSize: 14,
    fontFamily: 'DMSans_500Medium',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#4A4A4A',
    marginBottom: 8,
    fontFamily: 'DMSans_500Medium',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: '#333',
    fontFamily: 'DMSans_400Regular',
    paddingVertical: 0,
  },
  unit: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'DMSans_400Regular',
    marginLeft: 8,
  },
  error: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 8,
    fontFamily: 'DMSans_500Medium',
  },
  submitButton: {
    backgroundColor: '#3D50B5',
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'DMSans_600SemiBold',
  },
});
