import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const cardiacOutputConfig: CalculatorConfig = {
  id: 'cardiac-output',
  name: 'Cardiac Output (Fick)',
  description: 'Calculates cardiac output using the Fick principle, which relates oxygen consumption to blood flow and oxygen extraction.',
  category: 'cardiology',
  fields: [
    { 
      id: 'vo2',
      type: 'number',
      label: 'VO2', 
      placeholder: 'Enter oxygen consumption (mL/min)', 
      unit: 'mL/min', 
      keyboardType: 'numeric' 
    },
    { 
      id: 'cao2',
      type: 'number',
      label: 'CaO2', 
      placeholder: 'Enter arterial oxygen content (mL/dL)', 
      unit: 'mL/dL', 
      keyboardType: 'numeric' 
    },
    { 
      id: 'cvo2',
      type: 'number',
      label: 'CvO2', 
      placeholder: 'Enter venous oxygen content (mL/dL)', 
      unit: 'mL/dL', 
      keyboardType: 'numeric' 
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const errors: { [key: string]: string } = {};
    const vo2 = parseFloat(values['vo2']);
    const caO2 = parseFloat(values['cao2']);
    const cvO2 = parseFloat(values['cvo2']);
    
    if (isNaN(vo2) || vo2 <= 0) {
      errors.vo2 = 'VO2 must be positive';
    }
    if (isNaN(caO2) || caO2 <= 0) {
      errors.cao2 = 'CaO2 must be positive';
    }
    if (isNaN(cvO2) || cvO2 <= 0) {
      errors.cvo2 = 'CvO2 must be positive';
    } else if (cvO2 >= caO2) {
      errors.cvo2 = 'CvO2 must be less than CaO2';
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  },
  calculate: (values: { [key: string]: string }) => {
    const vo2 = parseFloat(values['VO2']);
    const caO2 = parseFloat(values['CaO2']);
    const cvO2 = parseFloat(values['CvO2']);
    const cardiacOutput = vo2 / ((caO2 - cvO2) * 10);
    
    let interpretation = '';
    if (cardiacOutput < 4) interpretation = 'Low cardiac output';
    else if (cardiacOutput < 6) interpretation = 'Normal cardiac output';
    else interpretation = 'High cardiac output';

    return {
      result: parseFloat(cardiacOutput.toFixed(1)),
      interpretation: `${interpretation} (Cardiac Output: ${cardiacOutput.toFixed(1)} L/min)`
    };
  },
  formula: 'Cardiac Output (L/min) = VO2 / [(CaO2 - CvO2) × 10]\nwhere:\nVO2 = Oxygen consumption\nCaO2 = Arterial oxygen content\nCvO2 = Venous oxygen content',
  references: [
    'Journal of Applied Physiology. Fick Principle in Cardiac Output Measurement.',
    'Circulation. Assessment of Cardiac Output.',
    'Critical Care Medicine. Hemodynamic Monitoring.'
  ],
  resultUnit: 'L/min'
};
