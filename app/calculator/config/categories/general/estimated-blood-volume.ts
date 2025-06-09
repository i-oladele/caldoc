import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const estimatedBloodVolumeConfig: CalculatorConfig = {
  id: 'estimated-blood-volume',
  name: 'Estimated Blood Volume',
  description: 'Calculates the estimated blood volume based on weight and gender',
  category: 'general',
  resultUnit: 'mL',
  fields: [
    {
      id: 'weight',
      type: 'number',
      label: 'Weight',
      placeholder: 'Enter patient weight (kg)',
      unit: 'kg',
      keyboardType: 'decimal-pad',
      required: true
    },
    {
      id: 'gender',
      type: 'select',
      label: 'Gender',
      placeholder: 'Select gender',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ],
      required: true
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const weight = parseFloat(values['Weight']);
    const gender = values['Gender'];
    
    if (isNaN(weight) || weight <= 0) {
      return 'Weight must be a positive number';
    }
    if (!gender) {
      return 'Please select a gender';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const weight = parseFloat(values['Weight']);
    const gender = values['Gender'];
    
    // Average blood volume in mL/kg based on gender
    const bloodVolumePerKg = gender === 'male' ? 75 : 65;
    const estimatedVolume = weight * bloodVolumePerKg;
    
    return {
      result: estimatedVolume,
      interpretation: `The estimated blood volume is approximately ${Math.round(estimatedVolume)} mL.`
    };
  },
  formula: 'EBV = Weight (kg) × Blood Volume Constant\n  • Male: 75 mL/kg\n  • Female: 65 mL/kg',
  references: [
    'Nadler SB, Hidalgo JH, Bloch T. Prediction of blood volume in normal human adults.',
    'Surgery. 1962;51(2):224-232.',
    'American Society of Anesthesiologists. Practice guidelines for perioperative blood management.'
  ]
};
