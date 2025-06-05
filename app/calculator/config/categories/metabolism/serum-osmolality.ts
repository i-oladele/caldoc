import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const serumOsmolalityConfig: CalculatorConfig = {
  id: 'serum-osmolality',
  fields: [
    {
      label: 'Sodium',
      placeholder: 'Enter sodium (mEq/L)',
      unit: 'mEq/L',
      keyboardType: 'decimal-pad'
    },
    {
      label: 'Glucose',
      placeholder: 'Enter glucose (mg/dL)',
      unit: 'mg/dL',
      keyboardType: 'decimal-pad'
    },
    {
      label: 'BUN',
      placeholder: 'Enter BUN (mg/dL)',
      unit: 'mg/dL',
      keyboardType: 'decimal-pad'
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const sodium = parseFloat(values.Sodium);
    const glucose = parseFloat(values.Glucose);
    const bun = parseFloat(values.BUN);
    
    if (isNaN(sodium) || sodium <= 0) {
      return 'Sodium must be positive';
    }
    if (isNaN(glucose) || glucose <= 0) {
      return 'Glucose must be positive';
    }
    if (isNaN(bun) || bun <= 0) {
      return 'BUN must be positive';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const sodium = parseFloat(values.Sodium);
    const glucose = parseFloat(values.Glucose);
    const bun = parseFloat(values.BUN);
    const osmolality = 2 * sodium + (glucose / 18) + (bun / 2.8);
    
    let interpretation = '';
    if (osmolality < 275) {
      interpretation = 'Low Osmolality';
    } else if (osmolality <= 295) {
      interpretation = 'Normal Osmolality';
    } else {
      interpretation = 'High Osmolality';
    }
    
    return {
      result: parseFloat(osmolality.toFixed(1)),
      interpretation
    };
  },
  formula: 'Serum Osmolality = 2 × Na + (Glucose/18) + (BUN/2.8)',
  references: [
    'Clinical Chemistry. Measurement and Interpretation of Serum Osmolality.',
    'American Journal of Medicine. Assessment of Volume Status.',
    'Critical Care Medicine. Management of Osmolar Disorders.'
  ],
  resultUnit: 'mOsm/kg'
};

export default serumOsmolalityConfig;
