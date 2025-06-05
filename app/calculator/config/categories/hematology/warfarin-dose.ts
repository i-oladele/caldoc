import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const warfarinDoseConfig: CalculatorConfig = {
  id: 'warfarin-dose',
  fields: [
    {
      label: 'Current INR',
      placeholder: 'Enter current INR',
      unit: '',
      keyboardType: 'decimal-pad'
    },
    {
      label: 'Target INR Range',
      placeholder: 'Enter target INR (e.g., 2.0-3.0)',
      unit: '',
      keyboardType: 'decimal-pad'
    },
    {
      label: 'Current Dose',
      placeholder: 'Enter current dose (mg/day)',
      unit: 'mg/day',
      keyboardType: 'decimal-pad'
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const currentInr = parseFloat(values['Current INR']);
    const targetInr = values['Target INR Range'].split('-').map(str => parseFloat(str));
    const currentDose = parseFloat(values['Current Dose']);
    
    if (isNaN(currentInr) || currentInr <= 0) {
      return 'Current INR must be positive';
    }
    if (targetInr.length !== 2 || isNaN(targetInr[0]) || isNaN(targetInr[1])) {
      return 'Target INR must be in format X.X-X.X';
    }
    if (isNaN(currentDose) || currentDose <= 0) {
      return 'Current dose must be positive';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const currentInr = parseFloat(values['Current INR']);
    const targetInr = values['Target INR Range'].split('-').map(str => parseFloat(str));
    const currentDose = parseFloat(values['Current Dose']);
    const targetLow = targetInr[0];
    const targetHigh = targetInr[1];
    
    let adjustment = 0;
    let interpretation = '';
    
    if (currentInr < targetLow) {
      // Increase dose
      adjustment = (targetLow - currentInr) * (currentDose / 2);
      interpretation = 'Increase dose';
    } else if (currentInr > targetHigh) {
      // Decrease dose
      adjustment = (currentInr - targetHigh) * (currentDose / 2);
      interpretation = 'Decrease dose';
    } else {
      adjustment = 0;
      interpretation = 'Maintain current dose';
    }
    
    const newDose = currentDose + adjustment;
    
    return {
      result: parseFloat(newDose.toFixed(1)),
      interpretation: `Current INR: ${currentInr.toFixed(1)}\nTarget Range: ${targetLow}-${targetHigh}\n${interpretation}`
    };
  },
  formula: 'Dose Adjustment = (Target INR - Current INR) × (Current Dose / 2)',
  references: [
    'American College of Chest Physicians. Antithrombotic Therapy Guidelines.',
    'Journal of Thrombosis and Haemostasis. Warfarin Dosing.',
    'Chest. Management of Anticoagulation Therapy.'
  ],
  resultUnit: 'mg/day'
};

export default warfarinDoseConfig;
