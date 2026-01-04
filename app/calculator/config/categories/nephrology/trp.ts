import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const trpConfig: CalculatorConfig = {
  id: 'trp',
  name: 'Tubular Reabsorption of Phosphate (TRP)',
  description: 'Assesses renal phosphate handling and helps in the evaluation of disorders of phosphate metabolism.',
  category: 'Nephrology',
  resultUnit: '%',
  fields: [
    {
      id: 'serumPhosphorus',
      type: 'number',
      label: 'Serum Phosphorus',
      placeholder: 'Enter serum phosphorus level',
      unit: 'mg/dL',
      keyboardType: 'decimal-pad'
    },
    {
      id: 'serumCreatinine',
      type: 'number',
      label: 'Serum Creatinine',
      placeholder: 'Enter serum creatinine level',
      unit: 'mg/dL',
      keyboardType: 'decimal-pad'
    },
    {
      id: 'urinePhosphorus',
      type: 'number',
      label: 'Urine Phosphorus',
      placeholder: 'Enter urine phosphorus level',
      unit: 'mg/dL',
      keyboardType: 'decimal-pad'
    },
    {
      id: 'urineCreatinine',
      type: 'number',
      label: 'Urine Creatinine',
      placeholder: 'Enter urine creatinine level',
      unit: 'mg/dL',
      keyboardType: 'decimal-pad'
    },
    {
      id: 'urineVolume',
      type: 'number',
      label: 'Urine Volume',
      placeholder: 'Enter 24-hour urine volume',
      unit: 'L',
      keyboardType: 'decimal-pad'
    }
  ],
  validate: (values: { [key: string]: string | number | boolean }) => {
    const errors: { [key: string]: string } = {};
    
    const requiredFields = ['serumPhosphorus', 'serumCreatinine', 'urinePhosphorus', 'urineCreatinine', 'urineVolume'];
    
    requiredFields.forEach(field => {
      const value = values[field];
      const numValue = typeof value === 'string' ? parseFloat(value) : value as number;
      
      if (value === undefined || value === null || value === '') {
        errors[field] = 'This field is required';
      } else if (isNaN(numValue) || numValue <= 0) {
        errors[field] = 'Must be a positive number';
      }
    });
    
    return Object.keys(errors).length > 0 ? errors : null;
  },
  calculate: (values: { [key: string]: string | number | boolean }) => {
    const parseValue = (val: string | number | boolean): number => {
      if (typeof val === 'number') return val;
      if (typeof val === 'string') return parseFloat(val);
      return 0; // Shouldn't happen due to validation
    };
    
    const serumP = parseValue(values.serumPhosphorus);
    const serumCr = parseValue(values.serumCreatinine);
    const urineP = parseValue(values.urinePhosphorus);
    const urineCr = parseValue(values.urineCreatinine);
    const urineVol = parseValue(values.urineVolume) * 1000; // Convert L to mL
    
    // Calculate TRP = 1 - [(urine phosphorus × serum creatinine) / (serum phosphorus × urine creatinine)] × 100
    const trp = 100 * (1 - ((urineP * serumCr) / (serumP * urineCr)));
    
    // Calculate phosphate excretion rate
    const phosphateExcretion = (urineP * urineVol) / (1440 * serumP);
    
    let interpretation = '';
    let status: 'success' | 'warning' | 'danger';
    
    if (trp < 80) {
      interpretation = 'Low TRP suggests renal phosphate wasting.';
      status = 'danger'; // Red for abnormal (low)
    } else if (trp <= 95) {
      interpretation = 'Normal TRP. Normal renal phosphate handling.';
      status = 'success'; // Green for normal
    } else {
      interpretation = 'High TRP suggests increased phosphate reabsorption.';
      status = 'warning'; // Yellow for high
    }
    
    // Add potential causes and clinical notes
    const details = [
      `TRP: ${trp.toFixed(1)}%`,
      `Interpretation: ${interpretation}`,
      `Phosphate Excretion Rate: ${phosphateExcretion.toFixed(2)} mmol/min`,
      '',
      'Reference Ranges (Updated 2024):',
      '• Normal: 85-95%',
      '• Low: <85% (Phosphate wasting)',
      '• High: >95% (Increased reabsorption)',
      '',
      'Clinical Interpretation:',
      '• Low TRP (<85%) may indicate:',
      '  - Fanconi syndrome',
      '  - Hyperparathyroidism',
      '  - Vitamin D deficiency',
      '  - Renal tubular acidosis',
      '• High TRP (>95%) may indicate:',
      '  - Low phosphate intake',
      '  - Recovery after phosphate depletion',
      '  - Pre-renal conservation states',
      '• Always interpret in clinical context with:',
      '  - Serum phosphate levels',
      '  - PTH levels',
      '  - Vitamin D status',
      '  - Urinary phosphate excretion'
    ];
    
    return {
      result: trp,
      status: status,
      interpretation: `TRP: ${trp.toFixed(1)}%\n${interpretation}`,
      details: details
    };
  },
  formula: 'TRP (%) = [1 - (Urine P × Serum Cr) / (Serum P × Urine Cr)] × 100',
  references: [
    'Brenner & Rector\'s The Kidney, 11th Edition. Chapter 18: Disorders of Phosphorus Homeostasis.',
    'Harrison\'s Principles of Internal Medicine, 21st Edition. Chapter 404: Disorders of the Parathyroids and Calcium and Phosphorus Metabolism.',
    'National Kidney Foundation. K/DOQI Clinical Practice Guidelines for Bone Metabolism and Disease in Chronic Kidney Disease. Am J Kidney Dis. 2003;42(4 Suppl 3):S1-201.'
  ]
};
