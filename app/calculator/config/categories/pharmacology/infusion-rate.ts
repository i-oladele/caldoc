import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const infusionRateConfig: CalculatorConfig = {
  id: 'infusion-rate',
  name: 'Weight-Based Drug Infusion Calculator',
  description: 'Calculates the infusion rate (mL/hr) for continuous intravenous medications using patient weight, prescribed dose, and drug concentration.',
  category: 'Pharmacology',
  fields: [
    { 
      id: 'dose',
      type: 'number',
      label: 'Dose', 
      placeholder: 'Enter dose (mg/kg/min)', 
      unit: 'mg/kg/min', 
      keyboardType: 'numeric' 
    },
    { 
      id: 'weight',
      type: 'number',
      label: 'Weight', 
      placeholder: 'Enter weight (kg)', 
      unit: 'kg', 
      keyboardType: 'numeric' 
    },
    { 
      id: 'concentration',
      type: 'number',
      label: 'Concentration', 
      placeholder: 'Enter concentration (mg/mL)', 
      unit: 'mg/mL', 
      keyboardType: 'numeric' 
    }
  ],
  validate: (values: { [key: string]: string | boolean | number }) => {
    const parseValue = (val: string | number | boolean): number => {
      if (typeof val === 'number') return val;
      if (typeof val === 'string') return parseFloat(val) || 0;
      return 0;
    };
    
    const dose = parseValue(values['dose']);
    const weight = parseValue(values['weight']);
    const concentration = parseValue(values['concentration']);
    
    if (isNaN(dose) || dose <= 0) {
      return 'Dose must be positive';
    }
    if (isNaN(weight) || weight <= 0) {
      return 'Weight must be positive';
    }
    if (isNaN(concentration) || concentration <= 0) {
      return 'Concentration must be positive';
    }
    return null;
  },
  calculate: (values: { [key: string]: string | boolean | number }) => {
    const parseValue = (val: string | number | boolean): number => {
      if (typeof val === 'number') return val;
      if (typeof val === 'string') return parseFloat(val) || 0;
      return 0;
    };
    
    const dose = parseValue(values['dose']);
    const weight = parseValue(values['weight']);
    const concentration = parseValue(values['concentration']);
    const rate = (dose * weight * 60) / concentration;
    
    return {
      result: parseFloat(rate.toFixed(1)),
      interpretation: `Infusion Rate: ${rate.toFixed(1)} mL/hr`
    };
  },
  formula: 'Infusion Rate (mL/hr) = (Dose (mg/kg/min) × Weight (kg) × 60) / Concentration (mg/mL)',
  references: [
    'Critical Care Medicine. Guidelines for Medication Administration.',
    'Journal of Infusion Nursing. Standards of Practice.',
    'American Journal of Health-System Pharmacy. IV Medication Safety.'
  ],
  resultUnit: 'mL/hr'
};
