import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const anionGapConfig: CalculatorConfig = {
  id: 'anion-gap',
  name: 'Anion Gap',
  description: 'Calculate the anion gap, which is used to help identify the cause of metabolic acidosis.',
  category: 'Metabolism',
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
      id: 'chloride',
      type: 'number',
      label: 'Chloride',
      placeholder: 'Enter chloride (mEq/L)',
      unit: 'mEq/L',
      keyboardType: 'decimal-pad'
    },
    {
      id: 'bicarbonate',
      type: 'number',
      label: 'Bicarbonate',
      placeholder: 'Enter bicarbonate (mEq/L)',
      unit: 'mEq/L',
      keyboardType: 'decimal-pad'
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const errors: Record<string, string> = {};
    const sodium = parseFloat(values.sodium);
    const chloride = parseFloat(values.chloride);
    const bicarbonate = parseFloat(values.bicarbonate);
    
    if (isNaN(sodium) || sodium <= 0) {
      errors.sodium = 'Sodium must be positive';
    }
    if (isNaN(chloride) || chloride <= 0) {
      errors.chloride = 'Chloride must be positive';
    }
    if (isNaN(bicarbonate) || bicarbonate <= 0) {
      errors.bicarbonate = 'Bicarbonate must be positive';
    }
    return Object.keys(errors).length > 0 ? errors : null;
  },
  calculate: (values: { [key: string]: string }) => {
    const sodium = parseFloat(values.Sodium);
    const chloride = parseFloat(values.Chloride);
    const bicarbonate = parseFloat(values.Bicarbonate);
    const anionGap = sodium - (chloride + bicarbonate);
    
    let interpretation = '';
    if (anionGap < 8) {
      interpretation = 'Low Anion Gap';
    } else if (anionGap <= 12) {
      interpretation = 'Normal Anion Gap';
    } else {
      interpretation = 'High Anion Gap';
    }
    
    return {
      result: parseFloat(anionGap.toFixed(1)),
      interpretation
    };
  },
  formula: 'Anion Gap = Sodium - (Chloride + Bicarbonate)',
  references: [
    'Clinical Chemistry. Anion Gap Interpretation.',
    'Journal of Critical Care. Anion Gap in Metabolic Acidosis.',
    'American Journal of Medicine. Anion Gap Analysis.'
  ],
  resultUnit: 'mEq/L'
};

export default anionGapConfig;
