import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const creatinineClearanceConfig: CalculatorConfig = {
  id: 'creatinine-clearance',
  fields: [
    {
      label: 'Age',
      placeholder: 'Enter age (years)',
      unit: 'years',
      keyboardType: 'numeric'
    },
    {
      label: 'Weight',
      placeholder: 'Enter weight (kg)',
      unit: 'kg',
      keyboardType: 'decimal-pad'
    },
    {
      label: 'Serum Creatinine',
      placeholder: 'Enter creatinine (mg/dL)',
      unit: 'mg/dL',
      keyboardType: 'decimal-pad'
    },
    {
      label: 'Gender',
      placeholder: 'Select gender',
      unit: '',
      keyboardType: 'default'
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const age = parseFloat(values.Age);
    const weight = parseFloat(values.Weight);
    const creatinine = parseFloat(values['Serum Creatinine']);
    const gender = values.Gender.toLowerCase();
    
    if (isNaN(age) || age <= 0) {
      return 'Age must be positive';
    }
    if (isNaN(weight) || weight <= 0) {
      return 'Weight must be positive';
    }
    if (isNaN(creatinine) || creatinine <= 0) {
      return 'Creatinine must be positive';
    }
    if (!gender || (gender !== 'male' && gender !== 'female')) {
      return 'Please select a valid gender';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const age = parseFloat(values.Age);
    const weight = parseFloat(values.Weight);
    const creatinine = parseFloat(values['Serum Creatinine']);
    const gender = values.Gender.toLowerCase();
    
    // Using the Cockcroft-Gault equation
    const k = gender === 'male' ? 1.23 : 1.04;
    const cc = (140 - age) * weight * k / (72 * creatinine);
    
    let interpretation = '';
    if (gender === 'male') {
      if (cc < 60) {
        interpretation = 'Chronic Kidney Disease';
      } else if (cc < 90) {
        interpretation = 'Mildly Reduced';
      } else {
        interpretation = 'Normal';
      }
    } else {
      if (cc < 45) {
        interpretation = 'Chronic Kidney Disease';
      } else if (cc < 70) {
        interpretation = 'Mildly Reduced';
      } else {
        interpretation = 'Normal';
      }
    }
    
    return {
      result: parseFloat(cc.toFixed(1)),
      interpretation
    };
  },
  formula: 'Cockcroft-Gault Equation:\nCC = (140 - Age) × Weight × k / (72 × Creatinine)\nwhere k = 1.23 for males, 1.04 for females',
  references: [
    'Cockcroft DW, Gault MH. Prediction of creatinine clearance from serum creatinine.',
    'American Journal of Kidney Diseases. Creatinine Clearance Estimation.',
    'Journal of the American Society of Nephrology. Renal Function Assessment.'
  ],
  resultUnit: 'mL/min'
};

export default creatinineClearanceConfig;
