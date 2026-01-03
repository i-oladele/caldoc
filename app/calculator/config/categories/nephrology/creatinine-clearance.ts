import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const creatinineClearanceConfig: CalculatorConfig = {
  id: 'creatinine-clearance',
  name: 'Creatinine Clearance',
  description: 'Estimates the glomerular filtration rate (GFR) to assess kidney function using the Cockcroft-Gault formula.',
  category: 'nephrology',
  fields: [
    {
      id: 'age',
      type: 'number',
      label: 'Age',
      placeholder: 'Enter age (years)',
      unit: 'years',
      keyboardType: 'number-pad',
      min: 1,
      max: 120
    },
    {
      id: 'weight',
      type: 'number',
      label: 'Weight',
      placeholder: 'Enter weight (kg)',
      unit: 'kg',
      keyboardType: 'decimal-pad',
      min: 0
    },
    {
      id: 'creatinine',
      type: 'number',
      label: 'Serum Creatinine',
      placeholder: 'Enter creatinine value',
      unit: 'mg/dL',
      keyboardType: 'decimal-pad',
      min: 0
    },
    {
      id: 'creatinineUnit',
      type: 'select',
      label: 'Creatinine Unit',
      placeholder: 'Select unit',
      unit: '',
      keyboardType: 'default',
      options: [
        { label: 'mg/dL', value: 'mg/dL' },
        { label: 'µmol/L', value: 'µmol/L' }
      ],
      defaultValue: 'mg/dL'
    },
    {
      id: 'gender',
      type: 'select',
      label: 'Gender',
      placeholder: 'Select gender',
      unit: '',
      keyboardType: 'default',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ]
    }
  ],
  validate: (values: Record<string, any>) => {
    const errors: Record<string, string> = {};
    
    // Check if age exists and is a valid number
    const ageValue = values.age;
    if (ageValue === undefined || ageValue === null || ageValue === '') {
      errors.age = 'Age is required';
    } else {
      // Convert to string and check if it's a valid integer
      const ageStr = String(ageValue).trim();
      if (ageStr === '') {
        errors.age = 'Age is required';
      } else if (!/^\d+$/.test(ageStr)) {
        errors.age = 'Age must be a whole number';
      } else {
        const age = parseInt(ageStr, 10);
        if (age < 1) {
          errors.age = 'Age must be at least 1 year';
        } else if (age > 120) {
          errors.age = 'Age must be 120 or less';
        }
      }
    }
    
    // Check weight
    const weightValue = values.weight;
    if (weightValue === undefined || weightValue === null || weightValue === '') {
      errors.weight = 'Weight is required';
    } else {
      const weightStr = String(weightValue).trim();
      if (weightStr === '') {
        errors.weight = 'Weight is required';
      } else {
        const weight = parseFloat(weightStr);
        if (isNaN(weight)) {
          errors.weight = 'Weight must be a number';
        } else if (weight <= 0) {
          errors.weight = 'Weight must be positive';
        } else if (weight > 300) {
          errors.weight = 'Weight must be 300 kg or less';
        }
      }
    }
    
    // Check creatinine
    const creatinineValue = values.creatinine;
    const creatinineUnit = values.creatinineUnit || 'mg/dL';
    
    if (creatinineValue === undefined || creatinineValue === null || creatinineValue === '') {
      errors.creatinine = 'Creatinine is required';
    } else {
      const creatinineStr = String(creatinineValue).trim();
      if (creatinineStr === '') {
        errors.creatinine = 'Creatinine is required';
      } else {
        const creatinine = parseFloat(creatinineStr);
        if (isNaN(creatinine)) {
          errors.creatinine = 'Creatinine must be a number';
        } else if (creatinine <= 0) {
          errors.creatinine = 'Creatinine must be positive';
        } else {
          // Adjust max value based on unit
          const maxValue = creatinineUnit === 'mg/dL' ? 30 : 3000; // 30 mg/dL = ~2652 µmol/L, rounded up
          if (creatinine > maxValue) {
            errors.creatinine = `Creatinine value seems too high for ${creatinineUnit}`;
          }
        }
      }
    }
    
    // Check gender
    if (!values.gender || (values.gender as string).trim() === '') {
      errors.gender = 'Please select a gender';
    } else if (values.gender !== 'male' && values.gender !== 'female') {
      errors.gender = 'Please select a valid gender';
    }
    return Object.keys(errors).length > 0 ? errors : null;
  },
  calculate: (values: Record<string, string | boolean>) => {
    const age = parseFloat(values.age as string);
    const weight = parseFloat(values.weight as string);
    const creatinine = parseFloat(values.creatinine as string);
    const creatinineUnit = (values.creatinineUnit || 'mg/dL') as string;
    const gender = values.gender as string;
    
    let cc;
    
    if (creatinineUnit === 'µmol/L') {
      // For µmol/L: CCr = (140 - age) × weight × k / SCr
      // where k = 1.23 for males, 1.04 for females
      const k = gender === 'male' ? 1.23 : 1.04;
      cc = (140 - age) * weight * k / creatinine;
    } else {
      // For mg/dL: CCr = (140 - age) × weight / (72 × SCr) [× 0.85 if female]
      cc = (140 - age) * weight / (72 * creatinine);
      if (gender === 'female') {
        cc *= 0.85;
      }
    }
    
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
      result: Math.round(cc * 100) / 100,
      interpretation,
      status: cc < 60 ? 'danger' : cc < 90 ? 'warning' : 'success',
      resultUnit: 'mL/min'
    };
  },
  formula: 'Cockcroft-Gault Equation:\nFor mg/dL:\n  Male: CCr = (140 - Age) × Weight / (72 × SCr)\n  Female: CCr = (140 - Age) × Weight × 0.85 / (72 × SCr)\n\nFor µmol/L:\n  Male: CCr = (140 - Age) × Weight × 1.23 / SCr\n  Female: CCr = (140 - Age) × Weight × 1.04 / SCr',
  references: [
    'Cockcroft DW, Gault MH. Prediction of creatinine clearance from serum creatinine.',
    'American Journal of Kidney Diseases. Creatinine Clearance Estimation.',
    'Journal of the American Society of Nephrology. Renal Function Assessment.'
  ],
  resultUnit: 'mL/min'
};

export default creatinineClearanceConfig;
