import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const ibwConfig: CalculatorConfig = {
  id: 'ibw',
  name: 'Ideal Body Weight',
  description: 'Estimates ideal body weight for dosing and nutritional assessment',
  category: 'general',
  fields: [
    {
      label: 'Height',
      placeholder: 'Enter height (cm)',
      unit: 'cm',
      keyboardType: 'decimal-pad'
    },
    {
      id: 'gender',
      label: 'Gender',
      type: 'select',
      placeholder: 'Select gender',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
      ],
      required: true
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const height = parseFloat(values.Height);
    const gender = values.gender?.toLowerCase();
    
    if (isNaN(height) || height <= 0) {
      return 'Height must be positive';
    }
    if (!gender || (gender !== 'male' && gender !== 'female')) {
      return 'Please select a valid gender';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const height = parseFloat(values.Height);
    const gender = values.gender?.toLowerCase();
    
    // Using Devine formula
    let ibw;
    if (gender === 'male') {
      ibw = 50 + 2.3 * ((height - 152.4) / 2.54);
    } else {
      ibw = 45.5 + 2.3 * ((height - 152.4) / 2.54);
    }
    
    return {
      result: parseFloat(ibw.toFixed(1)),
      interpretation: ''
    };
  },
  formula: `Ideal Body Weight (IBW) is calculated using the Devine formula:

  For men:  50 kg + 2.3 kg × (Height in cm - 152.4)/2.54
  For women: 45.5 kg + 2.3 kg × (Height in cm - 152.4)/2.54

  Where:
  - 50 kg is the base weight for men at 5 feet (152.4 cm)
  - 45.5 kg is the base weight for women at 5 feet (152.4 cm)
  - 2.3 kg is the weight added per inch over 5 feet
  - Height is converted from cm to inches for calculation

  Note: This formula is most accurate for individuals of average height and should be used with caution in clinical settings.`,
  resultUnit: 'kg'
};

export default ibwConfig;
