import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const shockVolumeConfig: CalculatorConfig = {
  id: 'shock-volume',
  name: 'Shock Volume Calculation',
  description: 'Calculates volume of fluids needed during shock resuscitation.',
  category: 'Critical Care',
  fields: [
    {
      id: 'weight',
      type: 'number',
      label: 'Weight',
      placeholder: 'Enter weight',
      unit: 'kg',
      keyboardType: 'decimal-pad',
      min: 0
    },
    {
      id: 'shockType',
      type: 'select',
      label: 'Type of Shock',
      options: [
        { label: 'Hemorrhagic', value: 'hemorrhagic' },
        { label: 'Septic', value: 'septic' },
        { label: 'Cardiogenic', value: 'cardiogenic' },
        { label: 'Anaphylactic', value: 'anaphylactic' },
        { label: 'Neurogenic', value: 'neurogenic' }
      ]
    },
    {
      id: 'systolicBP',
      type: 'number',
      label: 'Systolic BP',
      placeholder: 'Enter systolic BP',
      unit: 'mmHg',
      keyboardType: 'number-pad'
    },
    {
      id: 'heartRate',
      type: 'number',
      label: 'Heart Rate',
      placeholder: 'Enter heart rate',
      unit: 'bpm',
      keyboardType: 'number-pad'
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const weight = parseFloat(values['weight']);
    const systolicBP = parseFloat(values['systolicBP']);
    const heartRate = parseFloat(values['heartRate']);
    
    if (isNaN(weight) || weight <= 0) {
      return 'Weight must be a positive number';
    }
    if (isNaN(systolicBP) || systolicBP <= 0) {
      return 'Systolic BP must be a positive number';
    }
    if (isNaN(heartRate) || heartRate <= 0) {
      return 'Heart rate must be a positive number';
    }
    if (!values['shockType']) {
      return 'Please select type of shock';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const weight = parseFloat(values['weight']);
    const shockType = values['shockType'];
    const systolicBP = parseFloat(values['systolicBP']);
    
    // Simplified calculation - in practice, this would be more complex
    // and consider multiple factors including type of shock and patient condition
    let volumePerKg = 0;
    switch(shockType) {
      case 'hemorrhagic':
        volumePerKg = 30; // 30ml/kg for hemorrhagic shock
        break;
      case 'septic':
        volumePerKg = 20; // 20ml/kg for septic shock
        break;
      case 'cardiogenic':
        volumePerKg = 10; // 10ml/kg for cardiogenic shock (with caution)
        break;
      case 'anaphylactic':
        volumePerKg = 20; // 20ml/kg for anaphylactic shock
        break;
      case 'neurogenic':
        volumePerKg = 15; // 15ml/kg for neurogenic shock
        break;
      default:
        volumePerKg = 20; // Default value
    }
    
    const totalVolume = Math.round(weight * volumePerKg);
    
    let interpretation = '';
    if (systolicBP < 90) {
      interpretation = 'Hypotensive shock - consider more aggressive fluid resuscitation';
    } else {
      interpretation = 'Normotensive - monitor response to fluid challenge';
    }
    
    return {
      result: totalVolume,
      interpretation
    };
  },
  formula: `Volume (ml) = Weight (kg) × Volume per kg (ml/kg)

Volume per kg based on shock type:
- Hemorrhagic: 30 ml/kg
- Septic: 20 ml/kg
- Cardiogenic: 10 ml/kg (use with caution)
- Anaphylactic: 20 ml/kg
- Neurogenic: 15 ml/kg

Interpretation:
- Systolic BP < 90 mmHg: "Hypotensive shock - consider more aggressive fluid resuscitation"
- Systolic BP ≥ 90 mmHg: "Normotensive - monitor response to fluid challenge"`,

  references: [
    'Advanced Trauma Life Support (ATLS) Guidelines',
    'Surviving Sepsis Campaign Guidelines',
    'Critical Care Medicine: Principles of Diagnosis and Management',
    'Note: This is a simplified calculation. Always use clinical judgment and monitor patient response.'
  ],
  resultUnit: 'ml'
};

export default shockVolumeConfig;
