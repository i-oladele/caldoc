import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const infusionRateConfig: CalculatorConfig = {
  id: 'infusion-rate',
  fields: [
    { label: 'Dose', placeholder: 'Enter dose (mg)', unit: 'mg', keyboardType: 'numeric' },
    { label: 'Weight', placeholder: 'Enter weight (kg)', unit: 'kg', keyboardType: 'numeric' },
    { label: 'Concentration', placeholder: 'Enter concentration (mg/mL)', unit: 'mg/mL', keyboardType: 'numeric' }
  ],
  validate: (values: { [key: string]: string }) => {
    const dose = parseFloat(values['Dose']);
    const weight = parseFloat(values['Weight']);
    const concentration = parseFloat(values['Concentration']);
    
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
  calculate: (values: { [key: string]: string }) => {
    const dose = parseFloat(values['Dose']);
    const weight = parseFloat(values['Weight']);
    const concentration = parseFloat(values['Concentration']);
    const rate = (dose * weight * 60) / concentration;
    
    return {
      result: parseFloat(rate.toFixed(1)),
      interpretation: `Infusion Rate: ${rate.toFixed(1)} mL/hr`
    };
  },
  formula: 'Infusion Rate (mL/hr) = (Dose × Weight × 60) / Concentration',
  references: [
    'Critical Care Medicine. Guidelines for Medication Administration.',
    'Journal of Infusion Nursing. Standards of Practice.',
    'American Journal of Health-System Pharmacy. IV Medication Safety.'
  ],
  resultUnit: 'mL/hr'
};
