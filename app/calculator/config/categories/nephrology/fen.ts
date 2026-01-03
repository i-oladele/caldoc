import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const fenConfig: CalculatorConfig = {
  id: 'fen',
  name: 'Fractional Excretion of Sodium (FENa)',
  description: 'Calculates the fractional excretion of sodium, which helps differentiate between prerenal disease and acute tubular necrosis in the evaluation of acute kidney injury.',
  category: 'nephrology',
  resultUnit: '%',
  fields: [
    {
      id: 'urineSodium',
      type: 'number',
      label: 'Urine Sodium',
      placeholder: 'Enter urine sodium (mEq/L)',
      unit: 'mEq/L',
      keyboardType: 'decimal-pad'
    },
    {
      id: 'serumSodium',
      type: 'number',
      label: 'Serum Sodium',
      placeholder: 'Enter serum sodium (mEq/L)',
      unit: 'mEq/L',
      keyboardType: 'decimal-pad'
    },
    {
      id: 'urineCreatinine',
      type: 'number',
      label: 'Urine Creatinine',
      placeholder: 'Enter urine creatinine (mg/dL)',
      unit: 'mg/dL',
      keyboardType: 'decimal-pad'
    },
    {
      id: 'serumCreatinine',
      type: 'number',
      label: 'Serum Creatinine',
      placeholder: 'Enter serum creatinine (mg/dL)',
      unit: 'mg/dL',
      keyboardType: 'decimal-pad'
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const errors: { [key: string]: string } = {};
    const urineNa = parseFloat(values['urineSodium']);
    const serumNa = parseFloat(values['serumSodium']);
    const urineCr = parseFloat(values['urineCreatinine']);
    const serumCr = parseFloat(values['serumCreatinine']);
    
    if (isNaN(urineNa) || urineNa <= 0) {
      errors['urineSodium'] = 'Urine sodium must be positive';
    }
    if (isNaN(serumNa) || serumNa <= 0) {
      errors['serumSodium'] = 'Serum sodium must be positive';
    }
    if (isNaN(urineCr) || urineCr <= 0) {
      errors['urineCreatinine'] = 'Urine creatinine must be positive';
    }
    if (isNaN(serumCr) || serumCr <= 0) {
      errors['serumCreatinine'] = 'Serum creatinine must be positive';
    }
    return Object.keys(errors).length > 0 ? errors : null;
  },
  calculate: (values: { [key: string]: string }) => {
    const urineNa = parseFloat(values['urineSodium']);
    const serumNa = parseFloat(values['serumSodium']);
    const urineCr = parseFloat(values['urineCreatinine']);
    const serumCr = parseFloat(values['serumCreatinine']);
    const fen = ((urineNa / serumNa) / (urineCr / serumCr)) * 100;
    
    let interpretation = '';
    if (fen < 1) {
      interpretation = 'Prerenal AKI (likely)';
    } else if (fen <= 2) {
      interpretation = 'Prerenal AKI (possible)';
    } else {
      interpretation = 'Intrinsic AKI';
    }
    
    return {
      result: parseFloat(fen.toFixed(1)),
      interpretation
    };
  },
  formula: 'FENa = ((Urine Na / Serum Na) / (Urine Cr / Serum Cr)) × 100',
  references: [
    'American Journal of Kidney Diseases. Evaluation of Acute Kidney Injury.',
    'Clinical Journal of the American Society of Nephrology. FENa Interpretation.',
    'Journal of Critical Care. Acute Kidney Injury Assessment.'
  ],
};

export default fenConfig;
