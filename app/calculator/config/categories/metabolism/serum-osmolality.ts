import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const serumOsmolalityConfig: CalculatorConfig = {
  id: 'serum-osmolality',
  name: 'Serum Osmolality',
  description: 'Calculates serum osmolality using sodium, glucose, and BUN levels',
  category: 'metabolism',
  fields: [
    {
      id: 'sodium',
      type: 'number',
      label: 'Sodium',
      placeholder: 'Enter sodium (mEq/L)',
      unit: 'mEq/L',
      keyboardType: 'decimal-pad'
    },
    {
      id: 'glucose',
      type: 'number',
      label: 'Glucose',
      placeholder: 'Enter glucose (mg/dL)',
      unit: 'mg/dL',
      keyboardType: 'decimal-pad'
    },
    {
      id: 'bun',
      type: 'number',
      label: 'BUN',
      placeholder: 'Enter BUN (mg/dL)',
      unit: 'mg/dL',
      keyboardType: 'decimal-pad'
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const errors: { [key: string]: string } = {};
    const sodium = parseFloat(values.sodium);
    const glucose = parseFloat(values.glucose);
    const bun = parseFloat(values.bun);
    
    if (isNaN(sodium) || sodium <= 0) {
      errors.sodium = 'Sodium must be positive';
    }
    if (isNaN(glucose) || glucose <= 0) {
      errors.glucose = 'Glucose must be positive';
    }
    if (isNaN(bun) || bun <= 0) {
      errors.bun = 'BUN must be positive';
    }
    return Object.keys(errors).length > 0 ? errors : null;
  },
  calculate: (values: Record<string, string | boolean>) => {
    const sodium = parseFloat(values.sodium as string);
    const glucose = parseFloat(values.glucose as string);
    const bun = parseFloat(values.bun as string);
    const osmolality = 2 * sodium + (glucose / 18) + (bun / 2.8);
    
    let interpretation = '';
    let status: 'success' | 'warning' | 'danger' = 'success';
    
    if (osmolality < 275) {
      interpretation = 'Low Osmolality';
      status = 'danger';
    } else if (osmolality <= 295) {
      interpretation = 'Normal Osmolality';
      status = 'success';
    } else if (osmolality <= 300) {
      interpretation = 'Borderline High Osmolality';
      status = 'warning';
    } else {
      interpretation = 'High Osmolality';
      status = 'danger';
    }
    
    return {
      result: parseFloat(osmolality.toFixed(1)),
      interpretation,
      status,
      resultDetails: [
        { label: 'Serum Osmolality', value: `${osmolality.toFixed(1)} mOsm/kg`, status },
        { label: 'Interpretation', value: interpretation, status }
      ]
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
