import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const estimatedBloodLossConfig: CalculatorConfig = {
  id: 'estimated-blood-loss',
  name: 'Estimated Blood Loss',
  description: 'Calculates the estimated blood loss based on pre and postoperative hematocrit values and patient weight',
  category: 'critical-care',
  fields: [
    {
      id: 'preopHct',
      type: 'number',
      label: 'Preoperative Hct',
      placeholder: 'Enter preoperative hematocrit (%)',
      unit: '%',
      keyboardType: 'decimal-pad',
      required: true
    },
    {
      id: 'postopHct',
      type: 'number',
      label: 'Postoperative Hct',
      placeholder: 'Enter postoperative hematocrit (%)',
      unit: '%',
      keyboardType: 'decimal-pad',
      required: true
    },
    {
      id: 'weight',
      type: 'number',
      label: 'Patient Weight',
      placeholder: 'Enter patient weight (kg)',
      unit: 'kg',
      keyboardType: 'decimal-pad',
      required: true
    },
    {
      id: 'bloodVolume',
      type: 'number',
      label: 'Blood Volume',
      placeholder: 'Enter blood volume (ml/kg)',
      unit: 'ml/kg',
      keyboardType: 'decimal-pad',
      value: '70',
      required: true
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const preopHct = parseFloat(values['Preoperative Hct']);
    const postopHct = parseFloat(values['Postoperative Hct']);
    const weight = parseFloat(values['Patient Weight']);
    const bloodVolume = parseFloat(values['Blood Volume'] || '70');
    
    if (isNaN(preopHct) || preopHct <= 0 || preopHct > 100) {
      return 'Preoperative hematocrit must be between 0 and 100%';
    }
    if (isNaN(postopHct) || postopHct <= 0 || postopHct > 100) {
      return 'Postoperative hematocrit must be between 0 and 100%';
    }
    if (isNaN(weight) || weight <= 0) {
      return 'Weight must be a positive number';
    }
    if (isNaN(bloodVolume) || bloodVolume <= 0) {
      return 'Blood volume must be a positive number';
    }
    if (preopHct <= postopHct) {
      return 'Postoperative Hct must be less than preoperative Hct';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const preopHct = parseFloat(values['Preoperative Hct']) / 100;
    const postopHct = parseFloat(values['Postoperative Hct']) / 100;
    const weight = parseFloat(values['Patient Weight']);
    const bloodVolume = parseFloat(values['Blood Volume'] || '70');
    
    const ebv = weight * bloodVolume;
    const hctAvg = (preopHct + postopHct) / 2;
    const estimatedLoss = ebv * ((preopHct - postopHct) / hctAvg);
    
    let interpretation = '';
    if (estimatedLoss < 500) {
      interpretation = 'Minimal blood loss';
    } else if (estimatedLoss < 1000) {
      interpretation = 'Mild blood loss';
    } else if (estimatedLoss < 2000) {
      interpretation = 'Moderate blood loss';
    } else {
      interpretation = 'Severe blood loss';
    }
    
    return {
      result: Math.round(estimatedLoss),
      interpretation
    };
  },
  formula: 'EBL = (Weight × Blood Volume) × (Hct_initial - Hct_final) / ((Hct_initial + Hct_final) / 2)',
  references: [
    'Gross JB. Estimating allowable blood loss: corrected for dilution.',
    'Anesthesiology. 1983;58(3):277-280.',
    'American Society of Anesthesiologists. Practice guidelines for perioperative blood management.'
  ],
  resultUnit: 'ml'
};

export default estimatedBloodLossConfig;
