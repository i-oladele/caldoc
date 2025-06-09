import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const lactateClearanceConfig: CalculatorConfig = {
  id: 'lactate-clearance',
  name: 'Lactate Clearance',
  description: 'Measures improvement or worsening in tissue oxygenation by calculating the percentage change in lactate levels over time.',
  category: 'Critical Care',
  resultUnit: '%',
  fields: [
    {
      id: 'initialLactate',
      type: 'number',
      label: 'Initial Lactate',
      placeholder: 'Enter initial lactate level',
      unit: 'mmol/L',
      keyboardType: 'decimal-pad'
    },
    {
      id: 'repeatLactate',
      type: 'number',
      label: 'Repeat Lactate',
      placeholder: 'Enter repeat lactate level',
      unit: 'mmol/L',
      keyboardType: 'decimal-pad'
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const errors: { [key: string]: string } = {};
    
    if (!values.initialLactate) {
      errors.initialLactate = 'Initial lactate is required';
    } else if (isNaN(Number(values.initialLactate)) || Number(values.initialLactate) <= 0) {
      errors.initialLactate = 'Initial lactate must be a positive number';
    }
    
    if (!values.repeatLactate) {
      errors.repeatLactate = 'Repeat lactate is required';
    } else if (isNaN(Number(values.repeatLactate)) || Number(values.repeatLactate) < 0) {
      errors.repeatLactate = 'Repeat lactate must be a non-negative number';
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  },
  calculate: (values: { [key: string]: string }) => {
    const initial = parseFloat(values.initialLactate);
    const repeat = parseFloat(values.repeatLactate);
    
    if (initial === 0) {
      return { 
        result: 0, 
        interpretation: 'Cannot calculate clearance: initial lactate is 0' 
      };
    }
    
    const clearance = ((initial - repeat) / initial) * 100;
    const interpretation = clearance >= 10 ? 'Adequate clearance (≥10%)' : 'Inadequate clearance (<10%)';
    
    return {
      result: parseFloat(clearance.toFixed(1)),
      interpretation: interpretation
    };
  },
  formula: 'Clearance (%) = [(Initial Lactate - Repeat Lactate) / Initial Lactate] × 100',
  references: [
    'Journal of Intensive Care Medicine. Lactate Clearance and Hemodynamic Improvement in Sepsis.',
    'Critical Care Medicine. Lactate as a Hemodynamic Marker.',
    'Chest Journal. Lactate Clearance in Septic Shock.'
  ]
};
