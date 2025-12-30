import { ThemedText } from '@/components/ThemedText';
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { CalculatorValues, InputField } from '../config/calculator';

interface CalculatorFormProps {
  fields: InputField[];
  values: CalculatorValues;
  onChange: (field: string, value: string | boolean) => void;
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
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitHovered, setIsSubmitHovered] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <ThemedText style={styles.title}>Input Values</ThemedText>
        <TouchableOpacity onPress={onReset} style={styles.resetButton}>
          <ThemedText style={styles.resetButtonText}>Reset</ThemedText>
        </TouchableOpacity>
      </View>
      {fields.map((field) => {
        const fieldKey = field.id || field.label;
        const fieldType = field.type || 'number';
        const fieldValue = values[fieldKey];
        const isFocused = focusedField === fieldKey;

        if (fieldType === 'checkbox') {
          const checked = Boolean(fieldValue);
          return (
            <TouchableOpacity
              key={fieldKey}
              style={[styles.checkboxContainer, checked && styles.checkboxContainerChecked]}
              onPress={() => onChange(fieldKey, !checked)}
              activeOpacity={0.85}
            >
              <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                {checked && <View style={styles.checkboxIndicator} />}
              </View>
              <ThemedText style={styles.checkboxLabel}>{field.label}</ThemedText>
            </TouchableOpacity>
          );
        }

        return (
          <View key={fieldKey} style={styles.inputContainer}>
            <ThemedText style={styles.label}>{field.label}</ThemedText>
            <View style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused]}>
              <TextInput
                style={styles.input}
                placeholder={field.placeholder || 'Enter value'}
                placeholderTextColor="#999"
                keyboardType={field.keyboardType || 'decimal-pad'}
                value={typeof fieldValue === 'string' ? fieldValue : ''}
                onChangeText={(text) => onChange(fieldKey, text)}
                onFocus={() => setFocusedField(fieldKey)}
                onBlur={() => setFocusedField((prev) => (prev === fieldKey ? null : prev))}
                underlineColorAndroid="transparent"
                selectionColor="#3D50B5"
              />
              {field.unit ? <ThemedText style={styles.unit}>{field.unit}</ThemedText> : null}
            </View>
          </View>
        );
      })}

      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

      <Pressable 
        style={({ pressed }) => [
          styles.submitButton,
          isSubmitHovered && Platform.OS === 'web' && styles.submitButtonHover,
          pressed && styles.submitButtonPressed,
        ]}
        onPress={onSubmit}
        onHoverIn={() => setIsSubmitHovered(true)}
        onHoverOut={() => setIsSubmitHovered(false)}
      >
        <ThemedText style={styles.submitButtonText}>Calculate</ThemedText>
      </Pressable>
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
  inputWrapperFocused: {
    borderColor: '#3D50B5',
    backgroundColor: '#F6F8FF',
    shadowColor: '#3D50B5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: '#333',
    fontFamily: 'DMSans_400Regular',
    paddingVertical: 0,
    ...Platform.select({
      web: {
        outlineWidth: 0,
        outlineColor: 'transparent',
      },
    }),
  },
  unit: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'DMSans_400Regular',
    marginLeft: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 16,
  },
  checkboxContainerChecked: {
    borderColor: '#3D50B5',
    backgroundColor: '#F6F8FF',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#C4C4C4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    borderColor: '#3D50B5',
    backgroundColor: '#3D50B5',
  },
  checkboxIndicator: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    fontFamily: 'DMSans_500Medium',
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
  submitButtonHover: {
    backgroundColor: '#3444A3',
    transform: [{ translateY: -1 }],
    shadowColor: '#3D50B5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  submitButtonPressed: {
    backgroundColor: '#2D3A8D',
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'DMSans_600SemiBold',
  },
});
