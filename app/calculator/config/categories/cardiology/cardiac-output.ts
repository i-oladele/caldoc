import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const cardiacOutputConfig: CalculatorConfig = {
  id: 'cardiac-output',
  name: 'Cardiac Output (Fick)',
  description: 'Calculates cardiac output using Fick\'s principle based on oxygen consumption and arteriovenous oxygen difference.',
  category: 'cardiology',
  resultUnit: 'L/min',
  fields: [
    { 
      id: 'vo2',
      type: 'number',
      label: 'Oxygen Consumption (VO2)', 
      placeholder: 'Enter oxygen consumption (mL/min)', 
      unit: 'mL/min', 
      keyboardType: 'numeric' 
    },
    { 
      id: 'cao2',
      type: 'number',
      label: 'Arterial Oxygen Content (CaO2)', 
      placeholder: 'Enter arterial oxygen content (mL/dL)', 
      unit: 'mL/dL', 
      keyboardType: 'numeric' 
    },
    { 
      id: 'cvo2',
      type: 'number',
      label: 'Venous Oxygen Content (CvO2)', 
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
    const vo2 = parseFloat(values.vo2);
    const caO2 = parseFloat(values.cao2);
    const cvO2 = parseFloat(values.cvo2);
    
    // Fick's Principle: CO = VO2 / (CaO2 - CvO2)
    // Convert units: (CaO2 - CvO2) from mL/dL to mL/L by multiplying by 10
    const cardiacOutput = vo2 / ((caO2 - cvO2) * 10); // in L/min
    const cardiacIndex = cardiacOutput / 1.73; // Using average BSA of 1.73 m² for adults

    let interpretation = '';
    let status: 'success' | 'warning' | 'danger' = 'success';

    // Cardiac Index normal range: 2.5-4.0 L/min/m²
    if (cardiacIndex < 2.0) {
      interpretation = 'Low cardiac output (Cardiogenic shock if < 1.8 L/min/m²)';
      status = 'danger';
    } else if (cardiacIndex < 2.5) {
      interpretation = 'Mildly reduced cardiac output';
      status = 'warning';
    } else if (cardiacIndex <= 4.0) {
      interpretation = 'Normal cardiac output';
      status = 'success';
    } else if (cardiacIndex <= 5.0) {
      interpretation = 'Mildly elevated cardiac output (e.g., sepsis, anemia)';
      status = 'warning';
    } else {
      interpretation = 'Markedly elevated cardiac output (e.g., severe sepsis, cirrhosis)';
      status = 'danger';
    }

    return {
      result: parseFloat(cardiacOutput.toFixed(2)),
      interpretation: `${interpretation}\nCardiac Index: ${cardiacIndex.toFixed(2)} L/min/m²`,
      status
    };
  },
  formula: `Fick's Principle for Cardiac Output

CO (L/min) = VO₂ (mL/min) / (CaO₂ - CvO₂) × 10

Where:
- CO = Cardiac Output in L/min
- VO₂ = Oxygen Consumption in mL/min
- CaO₂ = Arterial Oxygen Content in mL/dL
- CvO₂ = Venous Oxygen Content in mL/dL

Normal Ranges:
- Cardiac Output: 4-8 L/min
- Cardiac Index: 2.5-4.0 L/min/m²

Clinical Interpretation:
- < 2.0 L/min/m²: Cardiogenic shock
- 2.0-2.5 L/min/m²: Mild reduction
- 2.5-4.0 L/min/m²: Normal
- 4.0-5.0 L/min/m²: Mild elevation
- > 5.0 L/min/m²: Marked elevation`,

  references: [
    'Fick A. Ueber die Messung des Blutquantums in den Herzventrikeln. Sitz der Physik. Med. Ges. zu Wurzburg. 1870; 16-28',
    'Swan HJ, Ganz W, Forrester J, et al. Catheterization of the heart in man with use of a flow-directed balloon-tipped catheter. N Engl J Med. 1970;283(9):447-451',
    'Cecconi M, De Backer D, Antonelli M, et al. Consensus on circulatory shock and hemodynamic monitoring. Intensive Care Med. 2014;40(12):1795-1815'
  ]
};

export default cardiacOutputConfig;