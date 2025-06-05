import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const correctedCalciumConfig: CalculatorConfig = {
  id: 'corrected-calcium',
  fields: [
    {
      label: 'Total Calcium',
      placeholder: 'Enter total calcium (mg/dL)',
      unit: 'mg/dL',
      keyboardType: 'decimal-pad'
    },
    {
      label: 'Albumin',
      placeholder: 'Enter albumin (g/dL)',
      unit: 'g/dL',
      keyboardType: 'decimal-pad'
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const totalCalcium = parseFloat(values['Total Calcium']);
    const albumin = parseFloat(values.Albumin);
    
    if (isNaN(totalCalcium) || totalCalcium <= 0) {
      return 'Total calcium must be positive';
    }
    if (isNaN(albumin) || albumin <= 0) {
      return 'Albumin must be positive';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const totalCalcium = parseFloat(values['Total Calcium']);
    const albumin = parseFloat(values.Albumin);
    const correctedCalcium = totalCalcium + 0.8 * (4 - albumin);
    
    let interpretation = '';
    if (correctedCalcium < 8.5) {
      interpretation = 'Hypocalcemia';
    } else if (correctedCalcium <= 10.5) {
      interpretation = 'Normal calcium level';
    } else {
      interpretation = 'Hypercalcemia';
    }
    
    return {
      result: parseFloat(correctedCalcium.toFixed(1)),
      interpretation
    };
  },
  formula: 'Corrected Calcium = Total Calcium + 0.8 × (4 - Albumin)',
  references: [
    'Clinical Chemistry. Interpretation of Calcium Levels.',
    'American Journal of Medicine. Assessment of Calcium Disorders.',
    'Journal of Clinical Endocrinology & Metabolism. Calcium Homeostasis.'
  ],
  resultUnit: 'mg/dL'
};

export default correctedCalciumConfig;
