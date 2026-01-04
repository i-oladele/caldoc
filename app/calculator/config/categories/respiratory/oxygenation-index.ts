import { CalculationStatus, CalculatorConfig, CalculatorValues } from '@/app/calculator/config/calculator';

export const oxygenationIndexConfig: CalculatorConfig = {
  id: 'oxygenation-index',
  name: 'Oxygenation Index (OI)',
  description: 'Assesses the severity of respiratory failure by measuring the effectiveness of oxygen transfer in the lungs, particularly useful in ARDS patients.',
  category: 'Respiratory',
  fields: [
    {
      id: 'pao2',
      type: 'number',
      label: 'PaO₂',
      placeholder: 'Enter arterial oxygen pressure',
      unit: 'mmHg',
      keyboardType: 'decimal-pad'
    },
    {
      id: 'fio2',
      type: 'number',
      label: 'FiO₂',
      placeholder: 'Enter inspired oxygen fraction',
      unit: '',
      keyboardType: 'decimal-pad',
      min: 0.21,
      max: 1,
      step: 0.1
    },
    {
      id: 'mean_airway_pressure',
      type: 'number',
      label: 'Mean Airway Pressure',
      placeholder: 'Enter mean airway pressure',
      unit: 'cmH₂O',
      keyboardType: 'decimal-pad',
      min: 0
    }
  ],
  validate: (values: CalculatorValues) => {
    const pao2 = typeof values.pao2 === 'string' ? parseFloat(values.pao2) : 0;
    const fio2 = typeof values.fio2 === 'string' ? parseFloat(values.fio2) : 0;
    const map = typeof values.mean_airway_pressure === 'string' ? parseFloat(values.mean_airway_pressure) : 0;
    
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
  calculate: (values: CalculatorValues) => {
    // Safely parse values, defaulting to 0 if not present or invalid
    const pao2 = typeof values.pao2 === 'string' ? parseFloat(values.pao2) || 0 : 0;
    const fio2 = typeof values.fio2 === 'string' ? parseFloat(values.fio2) || 0 : 0.21; // Default to room air
    const map = typeof values.mean_airway_pressure === 'string' ? parseFloat(values.mean_airway_pressure) || 0 : 0;
    
    // Oxygenation Index = (Mean Airway Pressure × FiO2 × 100) / PaO2
    const oxygenationIndex = (map * fio2 * 100) / (pao2 || 1); // Prevent division by zero
    const roundedOI = parseFloat(oxygenationIndex.toFixed(1));
    
    let interpretation = '';
    let status: CalculationStatus = 'success';
    
    if (oxygenationIndex < 5) {
      status = 'success';
      interpretation = 'Mild ARDS - Low respiratory failure risk';
    } else if (oxygenationIndex <= 15) {
      status = 'warning';
      interpretation = 'Moderate ARDS - Monitor respiratory status closely';
    } else {
      status = 'danger';
      interpretation = 'Severe ARDS - High risk of respiratory failure';
    }
    
    return {
      result: roundedOI,
      interpretation: `Oxygenation Index: ${roundedOI}\n${interpretation}\nFiO₂: ${(fio2 * 100).toFixed(0)}%, MAP: ${map} cmH₂O, PaO₂: ${pao2} mmHg`,
      status
    };
  },
  resultUnit: 'OI',
  formula: 'Oxygenation Index (OI) = (Mean Airway Pressure × FiO₂ × 100) / PaO₂\n\n' +
  'Interpretation of Oxygenation Index (OI):\n' +
  '• OI < 5: Mild ARDS (Green) - Low risk\n' +
  '• OI 5-15: Moderate ARDS (Yellow) - Monitor closely\n' +
  '• OI > 15: Severe ARDS (Red) - High risk\n\n' +
  'Note: Higher values indicate more severe respiratory failure and worse prognosis',
  references: [
    'Critical Care Medicine. Respiratory Failure.',
    'American Journal of Respiratory and Critical Care Medicine. Oxygenation.',
    'Journal of Critical Care. Mechanical Ventilation.'
  ]
};

export default oxygenationIndexConfig;
