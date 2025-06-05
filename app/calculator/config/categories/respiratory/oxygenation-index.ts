import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const oxygenationIndexConfig: CalculatorConfig = {
  id: 'oxygenation-index',
  fields: [
    {
      label: 'PaO2',
      placeholder: 'Enter arterial oxygen pressure (mmHg)',
      unit: 'mmHg',
      keyboardType: 'decimal-pad'
    },
    {
      label: 'FiO2',
      placeholder: 'Enter inspired oxygen fraction (decimal)',
      unit: '',
      keyboardType: 'decimal-pad'
    },
    {
      label: 'Mean Airway Pressure',
      placeholder: 'Enter mean airway pressure (cmH2O)',
      unit: 'cmH2O',
      keyboardType: 'decimal-pad'
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const pao2 = parseFloat(values.PaO2);
    const fio2 = parseFloat(values.FiO2);
    const map = parseFloat(values['Mean Airway Pressure']);
    
    if (isNaN(pao2) || pao2 <= 0) {
      return 'PaO2 must be positive';
    }
    if (isNaN(fio2) || fio2 <= 0 || fio2 > 1) {
      return 'FiO2 must be between 0 and 1';
    }
    if (isNaN(map) || map <= 0) {
      return 'Mean airway pressure must be positive';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const pao2 = parseFloat(values.PaO2);
    const fio2 = parseFloat(values.FiO2);
    const map = parseFloat(values['Mean Airway Pressure']);
    const oxygenationIndex = (map * fio2 * 100) / pao2;
    
    let interpretation = '';
    if (oxygenationIndex < 5) {
      interpretation = 'Mild hypoxemia';
    } else if (oxygenationIndex <= 15) {
      interpretation = 'Moderate hypoxemia';
    } else {
      interpretation = 'Severe hypoxemia';
    }
    
    return {
      result: parseFloat(oxygenationIndex.toFixed(1)),
      interpretation
    };
  },
  formula: 'Oxygenation Index = (Mean Airway Pressure × FiO2 × 100) / PaO2',
  references: [
    'Critical Care Medicine. Respiratory Failure.',
    'American Journal of Respiratory and Critical Care Medicine. Oxygenation.',
    'Journal of Critical Care. Mechanical Ventilation.'
  ],
  resultUnit: ''
};

export default oxygenationIndexConfig;
