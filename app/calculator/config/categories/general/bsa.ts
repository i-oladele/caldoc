import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const bsaConfig: CalculatorConfig = {
  id: 'bsa',
  name: 'Body Surface Area (Mostella Formula)',
  description: 'Calculates body surface area using the Mosteller formula.',
  category: 'general',
  resultUnit: 'm²',
  fields: [
    {
      label: 'Height',
      placeholder: 'Enter height (cm)',
      unit: 'cm',
      keyboardType: 'decimal-pad'
    },
    {
      label: 'Weight',
      placeholder: 'Enter weight (kg)',
      unit: 'kg',
      keyboardType: 'decimal-pad'
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const height = parseFloat(values.Height);
    const weight = parseFloat(values.Weight);
    
    if (isNaN(height) || height <= 0) {
      return 'Height must be positive';
    }
    if (isNaN(weight) || weight <= 0) {
      return 'Weight must be positive';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const height = parseFloat(values.Height);
    const weight = parseFloat(values.Weight);
    // Using Mosteller formula: BSA = sqrt((height × weight) / 3600)
    const bsa = Math.sqrt((height * weight) / 3600);
    
    return {
      result: parseFloat(bsa.toFixed(2)),
      interpretation: ''
    };
  },
  formula: `Mosteller Formula for Body Surface Area (BSA)

  BSA (m²) = √((Height (cm) × Weight (kg)) / 3600)
  
  Where:
  • BSA = Body Surface Area in square meters (m²)
  • Height = Patient's height in centimeters (cm)
  • Weight = Patient's weight in kilograms (kg)
  
  Clinical Applications:
  • Chemotherapy dosing
  • Glomerular filtration rate (GFR) estimation
  • Cardiac index calculations
  • Medication dosing in pediatric patients
  
  Advantages:
  • Simple to calculate
  • Accurate for all ages and body types
  • Recommended by FDA for drug dosing
  • Validated in both adult and pediatric populations`,
  
  references: [
    'Mosteller RD. Simplified calculation of body-surface area. N Engl J Med 1987; 317:1098',
    'DuBois D, DuBois EF. A formula to estimate the approximate surface area if height and weight be known. Arch Intern Med 1916; 17:863-71',
    'Haycock GB, Schwartz GJ, Wisotsky DH. Geometric method for measuring body surface area: A height-weight formula validated in infants, children and adults. J Pediatr 1978; 93:62-66',
    'FDA Guidance for Industry: Pharmacokinetics in Patients with Impaired Renal Function'
  ],
  resultUnit: 'm²'
};

export default bsaConfig;
