import { CalculationResult, CalculatorConfig, CalculatorValues } from '@/app/calculator/config/calculator';

export const tidalVolumeConfig: CalculatorConfig = {
  id: 'tidal-volume',
  name: 'Tidal Volume Calculator',
  description: 'Calculates the appropriate tidal volume for mechanical ventilation based on predicted body weight and ARDSnet protocol.',
  category: 'respiratory',
  fields: [
    { 
      id: 'height',
      type: 'number',
      label: 'Height', 
      placeholder: 'Enter height (inches)', 
      unit: 'inches', 
      keyboardType: 'numeric',
      min: 0,
      step: 0.1
    },
    {
      id: 'sex',
      type: 'select',
      label: 'Sex',
      options: [
        { label: 'Male', value: 'M' },
        { label: 'Female', value: 'F' }
      ],
      placeholder: 'Select sex',
      defaultValue: ''
    },
    { 
      id: 'desiredVolume',
      type: 'number',
      label: 'Desired Tidal Volume', 
      placeholder: 'Enter desired volume (mL/kg)', 
      unit: 'mL/kg', 
      keyboardType: 'numeric',
      min: 6,
      max: 8,
      step: 0.1
    }
  ],
  validate: (values: CalculatorValues) => {
    const height = typeof values.height === 'string' ? parseFloat(values.height) : values.height as number;
    const sex = typeof values.sex === 'string' ? values.sex.toUpperCase() : '';
    const desiredVolume = typeof values.desiredVolume === 'string' ? parseFloat(values.desiredVolume) : values.desiredVolume as number;
    
    if (isNaN(height) || height <= 0) {
      return 'Height must be positive';
    }
    if (sex !== 'M' && sex !== 'F') {
      return 'Sex must be M (male) or F (female)';
    }
    if (isNaN(desiredVolume) || desiredVolume < 6 || desiredVolume > 8) {
      return 'Desired volume must be between 6 and 8 mL/kg';
    }
    return null;
  },
  calculate: (values: CalculatorValues): CalculationResult => {
    const height = typeof values.height === 'string' ? parseFloat(values.height) : values.height as number;
    const sex = typeof values.sex === 'string' ? values.sex.toUpperCase() : '';
    const desiredVolume = typeof values.desiredVolume === 'string' ? parseFloat(values.desiredVolume) : values.desiredVolume as number;
    
    // Calculate ideal body weight (IBW) in kg
    let ibw: number;
    if (sex === 'M') {
      ibw = 50 + 2.3 * (height - 60);
    } else {
      ibw = 45.5 + 2.3 * (height - 60);
    }
    
    // Calculate tidal volume
    const tidalVolume = Math.round(ibw * desiredVolume);
    
    return {
      result: tidalVolume,
      resultUnit: 'mL',
      interpretation: `For a ${sex === 'M' ? 'male' : 'female'} patient with a height of ${height} inches (IBW: ${ibw.toFixed(1)} kg), the recommended tidal volume is ${tidalVolume} mL at ${desiredVolume} mL/kg.`,
      details: [
        `Ideal Body Weight (IBW): ${ibw.toFixed(1)} kg`,
        `Desired Tidal Volume: ${desiredVolume} mL/kg`,
        `Calculated Tidal Volume: ${tidalVolume} mL`
      ]
    };
  },
  formula: 'Tidal Volume = IBW × (6-8 mL/kg)\nwhere IBW (kg) = 50 + 2.3 × (height in inches - 60) for males\nor 45.5 + 2.3 × (height in inches - 60) for females',
  references: [
    'New England Journal of Medicine. Ventilation with Lower Tidal Volumes.',
    'American Journal of Respiratory and Critical Care Medicine. Mechanical Ventilation Guidelines.',
    'Critical Care Medicine. ARDS Network Recommendations.'
  ],
  resultUnit: 'mL'
};
