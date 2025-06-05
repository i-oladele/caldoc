import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Keyboard, TouchableOpacity } from 'react-native';
import { InputField } from '../config/calculator';
import { ThemedText } from '@/components/ThemedText';

interface CalculatorFormProps {
  fields: InputField[];
  values: { [key: string]: string };
  onChange: (field: string, value: string) => void;
  error?: string | null;
  onSubmit: () => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  fields,
  values,
  onChange,
  error,
  onSubmit
}) => {
  return (
    <View style={styles.container}>
      {fields.map((field) => (
        <View key={field.label} style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <ThemedText style={styles.label}>{field.label}</ThemedText>
            <ThemedText style={styles.unit}>{field.unit}</ThemedText>
          </View>
          <TextInput
            style={styles.input}
            placeholder={field.placeholder}
            keyboardType={field.keyboardType}
            value={values[field.label]}
            onChangeText={(text) => onChange(field.label, text)}
          />
        </View>
      ))}
      
      {error && (
        <ThemedText style={styles.error}>{error}</ThemedText>
      )}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={onSubmit}
        >
          <ThemedText style={styles.submitButtonText}>Calculate</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  unit: {
    fontSize: 14,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  error: {
    color: '#ff3b30',
    marginTop: 8,
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
