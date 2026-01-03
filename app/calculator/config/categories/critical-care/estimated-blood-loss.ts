import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const estimatedBloodLossConfig: CalculatorConfig = {
  id: 'estimated-blood-loss',
  name: 'Estimated Blood Loss',
  description: 'Calculates the estimated blood loss using pre and post-operative hematocrit values',
  category: 'critical-care',
  fields: [
    {
      id: 'gender',
      type: 'select',
      label: 'Gender',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ],
      required: true
    },
    {
      id: 'weight',
      type: 'number',
      label: 'Weight',
      placeholder: 'Enter weight in kg',
      unit: 'kg',
      keyboardType: 'decimal-pad',
      required: true
    },
    {
      id: 'preopHct',
      type: 'number',
      label: 'Pre-op Hct',
      placeholder: 'Enter pre-op hematocrit',
      unit: '%',
      keyboardType: 'decimal-pad',
      required: true
    },
    {
      id: 'postopHct',
      type: 'number',
      label: 'Post-op Hct',
      placeholder: 'Enter post-op hematocrit',
      unit: '%',
      keyboardType: 'decimal-pad',
      required: true
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const preopHct = parseFloat(values['preopHct']);
    const postopHct = parseFloat(values['postopHct']);
    const weight = parseFloat(values['weight']);
    
    if (isNaN(preopHct) || preopHct <= 0 || preopHct > 100) {
      return 'Pre-op hematocrit must be between 0-100%';
    }
    if (isNaN(postopHct) || postopHct <= 0 || postopHct > 100) {
      return 'Post-op hematocrit must be between 0-100%';
    }
    if (isNaN(weight) || weight <= 0) {
      return 'Weight must be a positive number';
    }
    if (postopHct >= preopHct) {
      return 'Post-op Hct must be less than pre-op Hct';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const gender = values['gender'];
    const weight = parseFloat(values['weight']);
    const preopHct = parseFloat(values['preopHct']) / 100; // Convert to decimal
    const postopHct = parseFloat(values['postopHct']) / 100; // Convert to decimal
    
    // Calculate EBV based on gender
    const bloodVolumePerKg = gender === 'male' ? 70 : 65;
    const ebv = weight * bloodVolumePerKg;
    
    // Calculate average Hct
    const hctAvg = (preopHct + postopHct) / 2;
    
    // Calculate estimated blood loss using the Gross formula
    const estimatedLoss = ebv * ((preopHct - postopHct) / hctAvg);
    
    // Determine blood loss severity
    let severity = '';
    if (estimatedLoss < 500) {
      severity = 'Minimal blood loss';
    } else if (estimatedLoss < 1000) {
      severity = 'Mild blood loss';
    } else if (estimatedLoss < 2000) {
      severity = 'Moderate blood loss';
    } else {
      severity = 'Severe blood loss';
    }
    
    // Calculate percentage of blood volume lost
    const percentLost = (estimatedLoss / ebv) * 100;
    
    return {
      result: Math.round(estimatedLoss),
      status: estimatedLoss < 1000 ? 'success' : estimatedLoss < 2000 ? 'warning' : 'danger',
      interpretation: `Estimated Blood Loss: ${Math.round(estimatedLoss)} mL (${percentLost.toFixed(1)}% of blood volume)\n\n` +
                     `Severity: ${severity}\n\n` +
                     `Calculation Details:\n` +
                     `• Gender: ${gender === 'male' ? 'Male' : 'Female'}\n` +
                     `• Weight: ${weight} kg\n` +
                     `• EBV: ${Math.round(ebv)} mL (${bloodVolumePerKg} mL/kg × ${weight} kg)\n` +
                     `• Hct: ${(preopHct * 100).toFixed(1)}% → ${(postopHct * 100).toFixed(1)}%\n` +
                     `• Average Hct: ${(hctAvg * 100).toFixed(1)}%\n\n` +
                     `Formula: EBV × (Hct_initial - Hct_final) / Hct_avg\n` +
                     `= ${Math.round(ebv)} × (${(preopHct * 100).toFixed(1)}% - ${(postopHct * 100).toFixed(1)}%) / ${(hctAvg * 100).toFixed(1)}%`
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
