import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const tcPo2PaO2Config: CalculatorConfig = {
  id: 'tcpo2-pao2',
  fields: [
    { label: 'TcPO2', placeholder: 'Enter TcPO2 value', unit: 'mmHg', keyboardType: 'numeric' },
    { label: 'PaO2', placeholder: 'Enter PaO2 value', unit: 'mmHg', keyboardType: 'numeric' }
  ],
  validate: (values: { [key: string]: string }) => {
    const tcPo2 = parseFloat(values['TcPO2']);
    const paO2 = parseFloat(values['PaO2']);
    
    if (isNaN(tcPo2) || tcPo2 <= 0) {
      return 'TcPO2 must be positive';
    }
    if (isNaN(paO2) || paO2 <= 0) {
      return 'PaO2 must be positive';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const tcPo2 = parseFloat(values['TcPO2']);
    const paO2 = parseFloat(values['PaO2']);
    const ratio = tcPo2 / paO2;
    
    let interpretation = '';
    if (ratio < 0.4) interpretation = 'Severe impairment';
    else if (ratio < 0.6) interpretation = 'Moderate impairment';
    else if (ratio < 0.8) interpretation = 'Mild impairment';
    else interpretation = 'Normal';

    return {
      result: parseFloat(ratio.toFixed(2)),
      interpretation: `${interpretation} (Ratio: ${ratio.toFixed(2)})`
    };
  },
  formula: 'TcPO2/PaO2 Ratio = TcPO2 / PaO2',
  references: [
    'Journal of Vascular Surgery. Transcutaneous Oximetry in Clinical Practice.',
    'Wound Repair and Regeneration. TcPO2 Measurements in Wound Healing.',
    'European Journal of Vascular Medicine. Guidelines for TcPO2 Assessment.'
  ],
  resultUnit: ''
};
