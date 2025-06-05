import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const fenConfig: CalculatorConfig = {
  id: 'fen',
  fields: [
    {
      label: 'Urine Sodium',
      placeholder: 'Enter urine sodium (mEq/L)',
      unit: 'mEq/L',
      keyboardType: 'decimal-pad'
    },
    {
      label: 'Serum Sodium',
      placeholder: 'Enter serum sodium (mEq/L)',
      unit: 'mEq/L',
      keyboardType: 'decimal-pad'
    },
    {
      label: 'Urine Creatinine',
      placeholder: 'Enter urine creatinine (mg/dL)',
      unit: 'mg/dL',
      keyboardType: 'decimal-pad'
    },
    {
      label: 'Serum Creatinine',
      placeholder: 'Enter serum creatinine (mg/dL)',
      unit: 'mg/dL',
      keyboardType: 'decimal-pad'
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const urineNa = parseFloat(values['Urine Sodium']);
    const serumNa = parseFloat(values['Serum Sodium']);
    const urineCr = parseFloat(values['Urine Creatinine']);
    const serumCr = parseFloat(values['Serum Creatinine']);
    
    if (isNaN(urineNa) || urineNa <= 0) {
      return 'Urine sodium must be positive';
    }
    if (isNaN(serumNa) || serumNa <= 0) {
      return 'Serum sodium must be positive';
    }
    if (isNaN(urineCr) || urineCr <= 0) {
      return 'Urine creatinine must be positive';
    }
    if (isNaN(serumCr) || serumCr <= 0) {
      return 'Serum creatinine must be positive';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const urineNa = parseFloat(values['Urine Sodium']);
    const serumNa = parseFloat(values['Serum Sodium']);
    const urineCr = parseFloat(values['Urine Creatinine']);
    const serumCr = parseFloat(values['Serum Creatinine']);
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
  resultUnit: '%'
};

export default fenConfig;
