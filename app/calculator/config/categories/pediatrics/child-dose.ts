import { CalculatorConfig, CalculatorValues } from '@/app/calculator/config/calculator';

export const childDoseConfig: CalculatorConfig = {
  id: 'child-dose',
  name: 'Pediatric Dose Calculator',
  description: 'Calculates the appropriate medication dose for children based on age using Young\'s formula',
  category: 'Pediatrics',
  fields: [
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
  validate: (values: CalculatorValues) => {
    const adultDose = parseFloat(values['Adult Dose'] as string);
    const age = parseFloat(values.Age as string);
    
    if (isNaN(adultDose) || adultDose <= 0) {
      return 'Adult dose must be positive';
    }
    if (isNaN(age) || age <= 0) {
      return 'Age must be positive';
    }
    return null;
  },
  calculate: (values: CalculatorValues) => {
    const adultDose = parseFloat(values['Adult Dose'] as string);
    const age = parseFloat(values.Age as string);
    
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
