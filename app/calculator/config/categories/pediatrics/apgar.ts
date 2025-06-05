import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const apgarConfig: CalculatorConfig = {
  id: 'apgar',
  fields: [
    {
      label: 'Appearance',
      placeholder: 'Select appearance score (0-2)',
      unit: '',
      keyboardType: 'numeric'
    },
    {
      label: 'Pulse',
      placeholder: 'Select pulse score (0-2)',
      unit: '',
      keyboardType: 'numeric'
    },
    {
      label: 'Grimace',
      placeholder: 'Select grimace score (0-2)',
      unit: '',
      keyboardType: 'numeric'
    },
    {
      label: 'Activity',
      placeholder: 'Select activity score (0-2)',
      unit: '',
      keyboardType: 'numeric'
    },
    {
      label: 'Respiration',
      placeholder: 'Select respiration score (0-2)',
      unit: '',
      keyboardType: 'numeric'
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const fields = ['Appearance', 'Pulse', 'Grimace', 'Activity', 'Respiration'];
    for (const field of fields) {
      const score = parseInt(values[field]);
      if (isNaN(score) || score < 0 || score > 2) {
        return `${field} score must be between 0 and 2`;
      }
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const fields = ['Appearance', 'Pulse', 'Grimace', 'Activity', 'Respiration'];
    let totalScore = 0;
    
    for (const field of fields) {
      totalScore += parseInt(values[field]);
    }
    
    let interpretation = '';
    if (totalScore <= 3) {
      interpretation = 'Critical - Immediate resuscitation required';
    } else if (totalScore <= 6) {
      interpretation = 'Moderate - Requires assistance';
    } else {
      interpretation = 'Good - Normal response';
    }
    
    return {
      result: totalScore,
      interpretation
    };
  },
  formula: 'APGAR = Appearance + Pulse + Grimace + Activity + Respiration',
  references: [
    'Pediatrics. Neonatal Assessment.',
    'American Academy of Pediatrics. APGAR Score.',
    'Journal of Perinatology. Neonatal Resuscitation.'
  ],
  resultUnit: ''
};

export default apgarConfig;
