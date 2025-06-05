import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const estimatedBloodLossConfig: CalculatorConfig = {
  id: 'estimated-blood-loss',
  fields: [
    { label: 'Weight', placeholder: 'Enter weight (kg)', unit: 'kg', keyboardType: 'numeric' },
    { label: 'PreHct', placeholder: 'Enter preoperative hematocrit (%)', unit: '%', keyboardType: 'numeric' },
    { label: 'PostHct', placeholder: 'Enter postoperative hematocrit (%)', unit: '%', keyboardType: 'numeric' },
    { label: 'Units', placeholder: 'Enter number of units transfused', unit: 'units', keyboardType: 'numeric' }
  ],
  validate: (values: { [key: string]: string }) => {
    const weight = parseFloat(values['Weight']);
    const preHct = parseFloat(values['PreHct']);
    const postHct = parseFloat(values['PostHct']);
    const units = parseFloat(values['Units']);
    
    if (isNaN(weight) || weight <= 0) {
      return 'Weight must be positive';
    }
    if (isNaN(preHct) || preHct <= 0 || preHct > 100) {
      return 'PreHct must be between 0 and 100';
    }
    if (isNaN(postHct) || postHct <= 0 || postHct > 100) {
      return 'PostHct must be between 0 and 100';
    }
    if (isNaN(units) || units < 0) {
      return 'Units must be non-negative';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const weight = parseFloat(values['Weight']);
    const preHct = parseFloat(values['PreHct']);
    const postHct = parseFloat(values['PostHct']);
    const units = parseFloat(values['Units']);
    const ebv = weight * 70; // mL/kg
    const bloodLoss = (ebv * (preHct - postHct) / preHct) + (units * 500);
    
    return {
      result: parseFloat(bloodLoss.toFixed(0)),
      interpretation: `Estimated Blood Loss: ${bloodLoss.toFixed(0)} mL`
    };
  },
  formula: 'EBL = EBV × (PreHct - PostHct)/PreHct + (Units × 500)\nwhere EBV = Weight × 70 mL/kg',
  references: [
    'Anesthesiology. Estimation of Operative Blood Loss.',
    'British Journal of Anaesthesia. Blood Loss Estimation in Surgery.',
    'Journal of Trauma. Assessment of Blood Loss in Trauma.'
  ],
  resultUnit: 'mL'
};
