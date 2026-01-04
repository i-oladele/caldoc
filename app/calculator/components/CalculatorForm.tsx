import { ThemedText } from '@/components/ThemedText';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { CalculatorValues, InputField } from '../config/calculator';

interface CalculatorFormProps {
  fields: InputField[];
  values: CalculatorValues;
  onChange: (field: string, value: string | boolean) => void;
  onSubmit: () => void;
  onReset: () => void;
  errors?: Record<string, string>;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  fields,
  values,
  onChange,
  onSubmit,
  onReset,
  errors = {},
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitHovered, setIsSubmitHovered] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      input[type="date"]:focus {
        outline: none !important;
        box-shadow: none !important;
      }
      input[type="date"]::-webkit-calendar-picker-indicator:focus {
        background-color: transparent;
      }
      input[type="date"]::-moz-focus-inner {
        border: 0;
      }
      .date-input-no-outline:focus {
        outline: none;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRefs = useRef<{[key: string]: any}>({});

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSubmit();
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    // Clear error for this field when user types
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      // @ts-ignore - We need to update the errors prop
      if (onChange) onChange('errors', newErrors);
    }
    onChange(field, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSubmit();
  };

  // Group fields by their group property
  const groupedFields = fields.reduce<{[key: string]: InputField[]}>((groups, field) => {
    const group = field.group || field.id;
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(field);
    return groups;
  }, {});

  // Function to render form fields
  const renderField = (field: InputField) => {
    const fieldKey = field.id;
    const fieldType = field.type || 'number';
    const fieldValue = values[fieldKey];
    const isFocused = focusedField === fieldKey;

    if (fieldType === 'select' && field.options) {
      return (
        <View key={fieldKey} style={styles.inputContainer}>
          <ThemedText style={styles.label}>{field.label}</ThemedText>
          <View style={[
            styles.selectContainer, 
            isFocused && styles.inputWrapperFocused,
            errors[fieldKey] && styles.inputError
          ]}>
            <select
              style={styles.select}
              value={fieldValue as string || ''}
              onChange={(e) => {
                const target = e.target as HTMLSelectElement;
                handleInputChange(fieldKey, target.value);
              }}
              onFocus={() => setFocusedField(fieldKey)}
              onBlur={() => setFocusedField(null)}
            >
              <option value="">{field.placeholder || 'Select an option'}</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </View>
          {errors[fieldKey] && (
            <ThemedText style={styles.fieldError}>{errors[fieldKey]}</ThemedText>
          )}
        </View>
      );
    }

    if (fieldType === 'checkbox') {
      const checked = Boolean(fieldValue);
      return (
        <TouchableOpacity
          key={fieldKey}
          style={styles.checkboxContainer}
          onPress={() => handleInputChange(fieldKey, !checked)}
        >
          <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
            {checked && <View style={styles.checkboxInner} />}
          </View>
          <ThemedText style={styles.checkboxLabel}>{field.label}</ThemedText>
        </TouchableOpacity>
      );
    }

    if (fieldType === 'radio' && field.options) {
      return (
        <View key={fieldKey} style={styles.inputContainer}>
          <ThemedText style={styles.label}>{field.label}</ThemedText>
          <View style={styles.radioGroup}>
            {field.options.map((option) => {
              const isSelected = fieldValue === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={styles.radioOption}
                  onPress={() => handleInputChange(fieldKey, option.value)}
                >
                  <View style={styles.radioOuter}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <ThemedText style={styles.radioLabel}>{option.label}</ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      );
    }

    // Special handling for target INR range fields
    if (fieldKey === 'targetInrLow' || fieldKey === 'targetInrHigh') {
      return (
        <View key={fieldKey} style={styles.rangeInputContainer}>
          {fieldKey === 'targetInrLow' && (
            <ThemedText style={styles.label}>Target INR Range</ThemedText>
          )}
          <View style={[
            styles.inputWrapper, 
            isFocused && styles.inputWrapperFocused,
            errors[fieldKey] && styles.inputError,
            styles.rangeInputWrapper
          ]}>
            <TextInput
              style={[styles.input, styles.rangeInput]}
              placeholder={field.placeholder || 'Enter value'}
              placeholderTextColor="#999"
              keyboardType={field.keyboardType || 'decimal-pad'}
              value={typeof fieldValue === 'string' ? fieldValue : ''}
              onChangeText={(text) => handleInputChange(fieldKey, text)}
              onFocus={() => setFocusedField(fieldKey)}
              onBlur={() => setFocusedField((prev) => (prev === fieldKey ? null : prev))}
              underlineColorAndroid="transparent"
              selectionColor="#3D50B5"
            />
            {field.unit && fieldKey === 'targetInrHigh' && (
              <ThemedText style={styles.unit}>{field.unit}</ThemedText>
            )}
          </View>
          {fieldKey === 'targetInrHigh' && errors['targetInrLow'] && !errors['targetInrHigh'] && (
            <ThemedText style={styles.fieldError}>{errors['targetInrLow']}</ThemedText>
          )}
          {fieldKey === 'targetInrHigh' && errors['targetInrHigh'] && (
            <ThemedText style={styles.fieldError}>{errors['targetInrHigh']}</ThemedText>
          )}
        </View>
      );
    }

    // Default input field
    return (
      <View key={fieldKey} style={styles.inputContainer}>
        <ThemedText style={styles.label}>{field.label}</ThemedText>
        <View style={[
          styles.inputWrapper, 
          isFocused && styles.inputWrapperFocused,
          errors[fieldKey] && styles.inputError
        ]}>
          <TextInput
            style={styles.input}
            placeholder={field.placeholder || 'Enter value'}
            placeholderTextColor="#999"
            keyboardType={field.keyboardType || 'decimal-pad'}
            value={typeof fieldValue === 'string' ? fieldValue : ''}
            onChangeText={(text) => handleInputChange(fieldKey, text)}
            onFocus={() => setFocusedField(fieldKey)}
            onBlur={() => setFocusedField((prev) => (prev === fieldKey ? null : prev))}
            underlineColorAndroid="transparent"
            selectionColor="#3D50B5"
          />
          {field.unit && <ThemedText style={styles.unit}>{field.unit}</ThemedText>}
        </View>
        {errors[fieldKey] && (
          <ThemedText style={styles.fieldError}>{errors[fieldKey]}</ThemedText>
        )}
      </View>
    );
  };


  return (
    <form 
      ref={formRef}
      onSubmit={handleFormSubmit} 
      style={{ width: '100%' }}
    >
      <View style={styles.container}>
        <button 
          type="submit" 
          style={{ display: 'none' }}
          aria-hidden="true"
        />
        <View style={styles.headerRow}>
          <ThemedText style={styles.title}>Input Values</ThemedText>
          <TouchableOpacity onPress={onReset} style={styles.resetButton}>
            <ThemedText style={styles.resetButtonText}>Reset</ThemedText>
          </TouchableOpacity>
        </View>
        {Object.entries(groupedFields).map(([groupId, groupFields]) => {
          // If it's a single field or not a group, render normally
          if (groupFields.length === 1 || !groupFields[0].group) {
            const field = groupFields[0];
            const fieldKey = field.id || field.label;
            const fieldType = field.type || 'number';
            const fieldValue = values[fieldKey];
            const isFocused = focusedField === fieldKey;
            
            return renderField(field);
          }
          
          // For grouped fields, render them in a row
          return (
            <View key={groupId} style={styles.groupedContainer}>
              {groupFields.map((field, index) => {
                const fieldKey = field.id || field.label;
                const fieldType = field.type || 'number';
                const fieldValue = values[fieldKey];
                const isFocused = focusedField === fieldKey;
                
                return (
                  <React.Fragment key={fieldKey}>
                    {renderField({
                      ...field,
                      hideLabel: index > 0,
                      id: fieldKey,
                      value: fieldValue,
                      onChange: (value: string | boolean) => handleInputChange(fieldKey, value),
                      onFocus: () => setFocusedField(fieldKey),
                      onBlur: () => setFocusedField(null),
                      isFocused
                    })}
                    {/* Add hyphen between range fields */}
                    {index === 0 && groupId === 'targetRange' && (
                      <ThemedText style={styles.rangeSeparator}>-</ThemedText>
                    )}
                  </React.Fragment>
                );
              })}
            </View>
          );
        })}


      <Pressable 
        style={({ pressed }) => [
          styles.submitButton,
          isSubmitHovered && Platform.OS === 'web' && styles.submitButtonHover,
          pressed && styles.submitButtonPressed,
        ]}
        onPress={(e) => {
          e?.preventDefault?.();
          onSubmit();
        }}
        onHoverIn={() => setIsSubmitHovered(true)}
        onHoverOut={() => setIsSubmitHovered(false)}
      >
        <ThemedText style={styles.submitButtonText}>Calculate</ThemedText>
      </Pressable>
      </View>
    </form>
  );
};

const styles = StyleSheet.create({
  rangeFieldsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    marginBottom: 16,
  },
  rangeInputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  rangeInputWrapper: {
    flex: 1,
  },
  rangeInput: {
    textAlign: 'center',
  },
  rangeSeparator: {
    fontSize: 20,
    marginHorizontal: 4,
    marginBottom: 8,
    color: '#666',
    alignSelf: 'flex-end',
    paddingBottom: 4,
  },
  groupedContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
    gap: 8,
  },
  groupedField: {
    flex: 1,
    marginBottom: 0,
  },
  groupedLabel: {
    marginBottom: 4,
  },
  groupedInputWrapper: {
    flex: 1,
  },
  groupedInput: {
    flex: 1,
  },
  dateInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: '#333',
    outlineWidth: 0,
    boxShadow: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none',
  },
  selectContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 16,
  },
  select: {
    width: '100%',
    height: 44,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'transparent',
    borderWidth: 0,
    outlineWidth: 0,
  } as any,
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'transparent',
    borderWidth: 0,
    outlineWidth: 0,
    width: '100%',
  },
  hiddenButton: {
    display: 'none',
    visibility: 'hidden',
    height: 0,
    width: 0,
    padding: 0,
    margin: 0,
    border: 0,
  } as any,
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
    overflow: 'hidden',
    transition: 'border-color 0.2s ease',
    '&:focus-within': {
      borderColor: '#3D50B5',
      boxShadow: '0 0 0 1px #3D50B5',
      outline: 'none',
    },
  },
  inputWrapperFocused: {
    borderColor: '#3D50B5',
    backgroundColor: '#F6F8FF',
    shadowColor: 'transparent',
    boxShadow: '0 0 0 1px #3D50B5',
    outline: 'none',
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
    color: '#DC2626',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 8,
    fontFamily: 'DMSans_500Medium',
    backgroundColor: '#FEF2F2',
    padding: 8,
    borderRadius: 4,
  },
  fieldError: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'DMSans_400Regular',
  },
  inputError: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
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
    fontWeight: '600',
    textAlign: 'center',
  },
  radioGroupContainer: {
    marginBottom: 16,
  },
  radioOptionsContainer: {
    marginTop: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  radioOptionSelected: {
    backgroundColor: 'rgba(61, 80, 181, 0.1)',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3D50B5',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3D50B5',
  },
  radioLabel: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});
