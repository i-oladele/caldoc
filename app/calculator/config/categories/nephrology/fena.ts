import { CalculatorConfig } from '../../calculator';

const fenaConfig: CalculatorConfig = {
  id: 'fena',
  fields: [
    {
      label: 'Urine Sodium (mEq/L)',
      placeholder: 'Enter urine sodium',
      unit: 'mEq/L',
      keyboardType: 'decimal-pad',
    },
    {
      label: 'Serum Sodium (mEq/L)',
      placeholder: 'Enter serum sodium',
      unit: 'mEq/L',
      keyboardType: 'decimal-pad',
    },
    {
      label: 'Urine Creatinine (mg/dL)',
      placeholder: 'Enter urine creatinine',
      unit: 'mg/dL',
      keyboardType: 'decimal-pad',
    },
    {
      label: 'Serum Creatinine (mg/dL)',
      placeholder: 'Enter serum creatinine',
      unit: 'mg/dL',
      keyboardType: 'decimal-pad',
    },
  ],
  validate: (values) => {
    const requiredFields = [
      'Urine Sodium (mEq/L)',
      'Serum Sodium (mEq/L)',
      'Urine Creatinine (mg/dL)',
      'Serum Creatinine (mg/dL)',
    ];

    for (const field of requiredFields) {
      if (!values[field] || isNaN(Number(values[field]))) {
        return `Please enter a valid number for ${field}`;
      }
      if (Number(values[field]) <= 0) {
        return `${field} must be greater than 0`;
      }
    }
    return null;
  },
  calculate: (values) => {
    const urineNa = Number(values['Urine Sodium (mEq/L)']);
    const serumNa = Number(values['Serum Sodium (mEq/L)']);
    const urineCr = Number(values['Urine Creatinine (mg/dL)']);
    const serumCr = Number(values['Serum Creatinine (mg/dL)']);

    // FENa = (Urine Na × Serum Cr) / (Serum Na × Urine Cr) × 100
    const fena = (urineNa * serumCr) / (serumNa * urineCr) * 100;

    let interpretation = '';
    if (fena < 1) {
      interpretation = 'Suggests prerenal azotemia';
    } else if (fena > 2) {
      interpretation = 'Suggests acute tubular necrosis or other intrinsic renal disease';
    } else {
      interpretation = 'Indeterminate - consider other clinical factors';
    }

    return {
      result: parseFloat(fena.toFixed(2)),
      interpretation,
    };
  },
  formula: 'FENa = (Urine Na × Serum Cr) / (Serum Na × Urine Cr) × 100',
  references: [
    'Espinel CH. The FENa test. Use in the differential diagnosis of acute renal failure. JAMA. 1976;236(6):579-581.',
    'Miller TR, Anderson RJ, Linas SL, et al. Urinary diagnostic indices in acute renal failure: a prospective study. Ann Intern Med. 1978;89(1):47-50.'
  ],
  resultUnit: '%',
};

export default fenaConfig;
