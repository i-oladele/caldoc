import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const childDoseConfig: CalculatorConfig = {
  id: 'child-dose',
  fields: [
    {
      label: 'Weight',
      placeholder: 'Enter child weight (kg)',
      unit: 'kg',
      keyboardType: 'decimal-pad'
    },
    {
      label: 'Adult Dose',
      placeholder: 'Enter adult dose (mg)',
      unit: 'mg',
      keyboardType: 'decimal-pad'
    },
    {
      label: 'Age',
      placeholder: 'Enter child age (years)',
      unit: 'years',
      keyboardType: 'decimal-pad'
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const weight = parseFloat(values.Weight);
    const adultDose = parseFloat(values['Adult Dose']);
    const age = parseFloat(values.Age);
    
    if (isNaN(weight) || weight <= 0) {
      return 'Weight must be positive';
    }
    if (isNaN(adultDose) || adultDose <= 0) {
      return 'Adult dose must be positive';
    }
    if (isNaN(age) || age <= 0) {
      return 'Age must be positive';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const weight = parseFloat(values.Weight);
    const adultDose = parseFloat(values['Adult Dose']);
    const age = parseFloat(values.Age);
    
    // Calculate using Young's formula
    const childDose = (age * adultDose) / (age + 12);
    
    return {
      result: parseFloat(childDose.toFixed(1)),
      interpretation: 'Calculated using Young\'s formula'
    };
  },
  formula: 'Child Dose = (Age × Adult Dose) / (Age + 12)',
  references: [
    'Pediatrics. Pediatric Dosing Guidelines.',
    'American Academy of Pediatrics. Drug Dosing in Children.',
    'Clinical Pharmacology. Pediatric Medication Safety.'
  ],
  resultUnit: 'mg'
};

export default childDoseConfig;
