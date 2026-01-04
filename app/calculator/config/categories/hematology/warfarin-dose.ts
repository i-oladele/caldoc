import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const warfarinDoseConfig: CalculatorConfig = {
  id: 'warfarin-dose',
  name: 'Warfarin Dose Adjustment',
  description: 'Calculates the appropriate warfarin dose adjustment based on current INR and target range',
  category: 'Hematology',
  fields: [
    {
      id: 'currentInr',
      type: 'number',
      label: 'Current INR',
      placeholder: 'Enter current INR',
      unit: '',
      keyboardType: 'decimal-pad',
      min: 0.1,
      step: 0.1
    },
    {
      id: 'targetInrLow',
      type: 'number',
      label: 'Target INR Range',
      placeholder: '2.0',
      unit: '',
      keyboardType: 'decimal-pad',
      min: 1.0,
      step: 0.1,
      group: 'targetRange',
      groupPosition: 'start'
    },
    {
      id: 'targetInrHigh',
      type: 'number',
      label: '',
      placeholder: '3.0',
      unit: '',
      keyboardType: 'decimal-pad',
      min: 1.0,
      step: 0.1,
      group: 'targetRange',
      groupPosition: 'end',
      hideLabel: true
    },
    {
      id: 'currentDose',
      type: 'number',
      label: 'Current Dose',
      placeholder: 'Enter current dose',
      unit: 'mg/day',
      keyboardType: 'decimal-pad',
      min: 0.5,
      step: 0.5
    }
  ],
  validate: (values: { [key: string]: string | number | boolean }) => {
    const parseValue = (val: string | number | boolean): number => {
      if (typeof val === 'number') return val;
      if (typeof val === 'string') return parseFloat(val) || 0;
      return 0;
    };
    
    const currentInr = parseValue(values['currentInr']);
    const targetLow = parseValue(values['targetInrLow']);
    const targetHigh = parseValue(values['targetInrHigh']);
    const currentDose = parseValue(values['currentDose']);
    
    if (isNaN(currentInr) || currentInr <= 0) {
      return 'Current INR must be positive';
    }
    
    if (isNaN(targetLow) || targetLow <= 0) {
      return 'Enter valid lower limit';
    }
    
    if (isNaN(targetHigh) || targetHigh <= 0) {
      return 'Enter valid upper limit';
    }
    
    if (targetLow >= targetHigh) {
      return 'Upper limit must be greater than lower limit';
    }
    
    if (isNaN(currentDose) || currentDose <= 0) {
      return 'Current dose must be positive';
    }
    
    return null;
  },
  calculate: (values: { [key: string]: string | number | boolean }) => {
    const parseValue = (val: string | number | boolean): number => {
      if (typeof val === 'number') return val;
      if (typeof val === 'string') return parseFloat(val) || 0;
      return 0;
    };
    
    const currentInr = parseValue(values['currentInr']);
    const targetLow = parseValue(values['targetInrLow']);
    const targetHigh = parseValue(values['targetInrHigh']);
    const currentDose = parseValue(values['currentDose']);
    
    let adjustment = 0;
    let interpretation = '';
    let status: 'success' | 'warning' | 'danger' = 'success';
    
    if (currentInr < targetLow) {
      // Increase dose by 5-20% based on how low the INR is
      const inrRatio = targetLow / currentInr;
      let percentageChange = 0;
      
      if (inrRatio > 1.5) {
        // More than 50% below target (e.g., INR 1.0 when target is 2.0-3.0)
        percentageChange = 20;
      } else if (inrRatio > 1.2) {
        // 20-50% below target
        percentageChange = 15;
      } else {
        // Less than 20% below target
        percentageChange = 10;
      }
      
      adjustment = (currentDose * percentageChange / 100);
      interpretation = `Increase dose by ${Math.abs(adjustment).toFixed(1)} mg (${percentageChange}% increase)`;
      status = 'warning';
    } else if (currentInr > targetHigh) {
      // Decrease dose by 5-20% based on how high the INR is
      const inrRatio = currentInr / targetHigh;
      let percentageChange = 0;
      
      if (inrRatio > 1.5) {
        // More than 50% above target (e.g., INR 4.5 when target is 2.0-3.0)
        percentageChange = 20;
      } else if (inrRatio > 1.2) {
        // 20-50% above target
        percentageChange = 15;
      } else {
        // Less than 20% above target
        percentageChange = 10;
      }
      
      adjustment = -(currentDose * percentageChange / 100);
      interpretation = `Decrease dose by ${Math.abs(adjustment).toFixed(1)} mg (${percentageChange}% decrease)`;
      status = 'warning';
    } else {
      adjustment = 0;
      interpretation = 'Maintain current dose';
      status = 'success';
    }
    
    const newDose = Math.max(0.5, Math.round((currentDose + adjustment) * 2) / 2); // Round to nearest 0.5 mg
    
    const details = [
      `Current INR: ${currentInr.toFixed(1)}`,
      `Target Range: ${targetLow.toFixed(1)}-${targetHigh.toFixed(1)}`,
      `Current Dose: ${currentDose.toFixed(1)} mg/day`,
      `Recommended Dose: ${newDose.toFixed(1)} mg/day`,
      '',
      'Clinical Notes:',
      '• Weekly dose adjustment should not exceed 20-30% of total weekly dose',
      '• Recheck INR within 5-7 days after dose adjustment',
      '• Consider more frequent monitoring if INR is significantly out of range',
      '• Adjust for factors affecting warfarin sensitivity (diet, medications, illness)'
    ];
    
    return {
      result: newDose,
      status: status,
      interpretation: interpretation,
      details: details
    };
  },
  formula: 'Dose Adjustment = Current Dose × (5-20% based on INR deviation)',
  references: [
    'American College of Chest Physicians. Antithrombotic Therapy Guidelines.',
    'Journal of Thrombosis and Haemostasis. Warfarin Dosing.',
    'Chest. Management of Anticoagulation Therapy.'
  ],
  resultUnit: 'mg/day'
};

export default warfarinDoseConfig;
