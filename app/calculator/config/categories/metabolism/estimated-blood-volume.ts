import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const estimatedBloodVolumeConfig: CalculatorConfig = {
  id: 'estimated-blood-volume',
  fields: [
    {
      label: 'Weight',
      placeholder: 'Enter weight (kg)',
      unit: 'kg',
      keyboardType: 'numeric'
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const weight = parseFloat(values.Weight);
    if (isNaN(weight) || weight <= 0) {
      return 'Weight must be positive';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const weight = parseFloat(values.Weight);
    const ebv = weight * 70;
    return {
      result: parseFloat(ebv.toFixed(0)),
      interpretation: `Estimated blood volume: ${ebv} mL`
    };
  },
  formula: 'EBV = Weight × 70 mL/kg',
  references: [
    'Anesthesiology. Estimation of Operative Blood Loss.',
    'British Journal of Anaesthesia. Blood Loss Estimation in Surgery.',
    'Journal of Trauma. Assessment of Blood Loss in Trauma.'
  ],
  resultUnit: 'mL'
};

export default estimatedBloodVolumeConfig;
