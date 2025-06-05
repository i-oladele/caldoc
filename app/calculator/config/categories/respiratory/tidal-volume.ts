import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const tidalVolumeConfig: CalculatorConfig = {
  id: 'tidal-volume',
  fields: [
    { label: 'Height', placeholder: 'Enter height (inches)', unit: 'inches', keyboardType: 'numeric' },
    { label: 'Sex', placeholder: 'Enter M for male, F for female', unit: '', keyboardType: 'default' },
    { label: 'Desired Tidal Volume', placeholder: 'Enter desired volume (mL/kg)', unit: 'mL/kg', keyboardType: 'numeric' }
  ],
  validate: (values: { [key: string]: string }) => {
    const height = parseFloat(values['Height']);
    const sex = values['Sex'].toUpperCase();
    const desiredVolume = parseFloat(values['Desired Tidal Volume']);
    
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
  calculate: (values: { [key: string]: string }) => {
    const height = parseFloat(values['Height']);
    const sex = values['Sex'].toUpperCase();
    const desiredVolume = parseFloat(values['Desired Tidal Volume']);
    
    // Calculate IBW
    let ibw;
    if (sex === 'M') {
      ibw = 50 + 2.3 * (height - 60);
    } else {
      ibw = 45.5 + 2.3 * (height - 60);
    }
    
    // Calculate tidal volume
    const tidalVolume = ibw * desiredVolume;
    
    return {
      result: parseFloat(tidalVolume.toFixed(0)),
      interpretation: `Tidal Volume: ${tidalVolume.toFixed(0)} mL for ${desiredVolume} mL/kg`
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
