import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

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
  validate: (values: { [key: string]: string }) => {
    const errors: { [key: string]: string } = {};
    
    const requiredFields = ['serumPhosphorus', 'serumCreatinine', 'urinePhosphorus', 'urineCreatinine', 'urineVolume'];
    
    requiredFields.forEach(field => {
      if (!values[field]) {
        errors[field] = 'This field is required';
      } else if (isNaN(Number(values[field])) || Number(values[field]) <= 0) {
        errors[field] = 'Must be a positive number';
      }
    });
    
    return Object.keys(errors).length > 0 ? errors : null;
  },
  calculate: (values: { [key: string]: string }) => {
    const serumP = parseFloat(values.serumPhosphorus);
    const serumCr = parseFloat(values.serumCreatinine);
    const urineP = parseFloat(values.urinePhosphorus);
    const urineCr = parseFloat(values.urineCreatinine);
    const urineVol = parseFloat(values.urineVolume) * 1000; // Convert L to mL
    
    // Calculate TRP = 1 - [(urine phosphorus × serum creatinine) / (serum phosphorus × urine creatinine)] × 100
    const trp = 100 * (1 - ((urineP * serumCr) / (serumP * urineCr)));
    
    // Calculate phosphate excretion rate
    const phosphateExcretion = (urineP * urineVol) / (1440 * serumP);
    
    let interpretation = '';
    if (trp < 80) {
      interpretation = 'Low TRP suggests renal phosphate wasting. Consider disorders like hyperparathyroidism, Fanconi syndrome, or vitamin D deficiency.';
    } else if (trp > 90) {
      interpretation = 'High TRP suggests appropriate renal phosphate conservation. Consider hypoparathyroidism or vitamin D excess.';
    } else {
      interpretation = 'Normal TRP. Normal renal phosphate handling.';
    }
    
    return {
      result: trp,
      interpretation: `${interpretation} Phosphate excretion rate: ${phosphateExcretion.toFixed(2)} mmol/min`
    };
  },
  formula: 'TRP (%) = [1 - (Urine P × Serum Cr) / (Serum P × Urine Cr)] × 100',
  references: [
    'Brenner & Rector\'s The Kidney, 11th Edition. Chapter 18: Disorders of Phosphorus Homeostasis.',
    'Harrison\'s Principles of Internal Medicine, 21st Edition. Chapter 404: Disorders of the Parathyroids and Calcium and Phosphorus Metabolism.',
    'National Kidney Foundation. K/DOQI Clinical Practice Guidelines for Bone Metabolism and Disease in Chronic Kidney Disease. Am J Kidney Dis. 2003;42(4 Suppl 3):S1-201.'
  ]
};
