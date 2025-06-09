import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const transferrinSaturationConfig: CalculatorConfig = {
  id: 'transferrin-saturation',
  name: 'Transferrin Saturation',
  description: 'Calculates transferrin saturation percentage using serum iron and total iron binding capacity (TIBC) to assess iron status.',
  category: 'metabolism',
  fields: [
    {
      id: 'serumIron',
      type: 'number',
      label: 'Serum Iron',
      placeholder: 'Enter serum iron (mcg/dL)',
      unit: 'mcg/dL',
      keyboardType: 'decimal-pad'
    },
    {
      id: 'tibc',
      type: 'number',
      label: 'Total Iron Binding Capacity',
      placeholder: 'Enter TIBC (mcg/dL)',
      unit: 'mcg/dL',
      keyboardType: 'decimal-pad'
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const errors: { [key: string]: string } = {};
    const iron = parseFloat(values['Serum Iron']);
    const tibc = parseFloat(values['Total Iron Binding Capacity']);
    
    if (isNaN(iron) || iron <= 0) {
      errors['serumIron'] = 'Serum iron must be positive';
    }
    if (isNaN(tibc) || tibc <= 0) {
      errors['tibc'] = 'TIBC must be positive';
    }
    return Object.keys(errors).length > 0 ? errors : null;
  },
  calculate: (values: { [key: string]: string }) => {
    const iron = parseFloat(values['Serum Iron']);
    const tibc = parseFloat(values['Total Iron Binding Capacity']);
    const saturation = (iron / tibc) * 100;
    
    let interpretation = '';
    if (saturation < 15) {
      interpretation = 'Low Saturation (Iron Deficiency)';
    } else if (saturation <= 50) {
      interpretation = 'Normal Saturation';
    } else {
      interpretation = 'High Saturation (Iron Overload)';
    }
    
    return {
      result: parseFloat(saturation.toFixed(1)),
      interpretation
    };
  },
  formula: 'Transferrin Saturation = (Serum Iron / TIBC) × 100',
  references: [
    'American Journal of Clinical Pathology. Iron Metabolism.',
    'Blood. Evaluation of Iron Deficiency.',
    'Journal of Laboratory Medicine. Iron Studies Interpretation.'
  ],
  resultUnit: '%'  // Added missing unit
};

export default transferrinSaturationConfig;
