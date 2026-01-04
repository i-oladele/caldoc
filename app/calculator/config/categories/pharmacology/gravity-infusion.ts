import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const gravityInfusionConfig: CalculatorConfig = {
  id: 'gravity-infusion',
  name: 'Gravity Infusion (Drop Rate) Calculator',
  description: 'Determines the drip rate in drops per minute (gtt/min) using total volume, infusion time, and giving-set drop factor. Intended for infusions administered without a pump.',
  category: 'Pharmacology',
  fields: [
    { 
      id: 'volume',
      label: 'Volume', 
      placeholder: 'Enter total volume (mL)', 
      unit: 'mL', 
      type: 'number',
      keyboardType: 'decimal-pad' 
    },
    { 
      id: 'time', 
      label: 'Infusion Time', 
      placeholder: 'Enter time (minutes)', 
      unit: 'min', 
      type: 'number',
      keyboardType: 'decimal-pad' 
    },
    { 
      id: 'dropFactor', 
      label: 'Drop Factor', 
      placeholder: 'Enter drop factor (gtt/mL)', 
      unit: 'gtt/mL', 
      type: 'number',
      keyboardType: 'decimal-pad' 
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const volume = parseFloat(values.volume);
    const time = parseFloat(values.time);
    const dropFactor = parseFloat(values.dropFactor);
    
    if (isNaN(volume) || volume <= 0) {
      return 'Volume must be positive';
    }
    if (isNaN(time) || time <= 0) {
      return 'Time must be positive';
    }
    if (isNaN(dropFactor) || dropFactor <= 0) {
      return 'Drop factor must be positive';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const volume = parseFloat(values.volume);
    const time = parseFloat(values.time);
    const dropFactor = parseFloat(values.dropFactor);
    
    // Formula: (Volume × Drop Factor) / Time (in minutes)
    const dropRate = (volume * dropFactor) / time;
    
    return {
      result: parseFloat(dropRate.toFixed(1)),
      interpretation: `Drop Rate: ${dropRate.toFixed(1)} gtt/min`
    };
  },
  formula: 'Flow Rate (gtt/min) = (Volume (mL) × Drop Factor (gtt/mL)) / Time (minutes)',
  references: [
    'Infusion Nurses Society. Infusion Therapy Standards of Practice.',
    'The Royal Children\'s Hospital Melbourne. Clinical Guidelines - IV Fluids',
    'American Society of Health-System Pharmacists. IV Medication Safety Guidelines.'
  ],
  resultUnit: 'gtt/min'
};

export default gravityInfusionConfig;
