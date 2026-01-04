import { CalculatorConfig } from '@/app/calculator/config/calculator';

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
  validate: (values: { [key: string]: string | number | boolean }) => {
    const errors: { [key: string]: string } = {};
    const iron = typeof values.serumIron === 'string' ? parseFloat(values.serumIron) : values.serumIron as number;
    const tibc = typeof values.tibc === 'string' ? parseFloat(values.tibc) : values.tibc as number;
    
    if (isNaN(iron) || iron <= 0) {
      errors['serumIron'] = 'Serum iron must be positive';
    }
    if (isNaN(tibc) || tibc <= 0) {
      errors['tibc'] = 'TIBC must be positive';
    }
    return Object.keys(errors).length > 0 ? errors : null;
  },
  calculate: (values: { [key: string]: string | number | boolean }) => {
    const iron = typeof values.serumIron === 'string' ? parseFloat(values.serumIron) : values.serumIron as number;
    const tibc = typeof values.tibc === 'string' ? parseFloat(values.tibc) : values.tibc as number;
    const saturation = (iron / tibc) * 100;
    
    let interpretation = '';
    let status: 'success' | 'warning' | 'danger';
    
    if (saturation < 15) {
      interpretation = 'Low Saturation (Iron Deficiency)';
      status = 'danger'; // Red for abnormal (low)
    } else if (saturation <= 50) {
      interpretation = 'Normal Saturation';
      status = 'success'; // Green for normal
    } else {
      interpretation = 'High Saturation (Iron Overload)';
      status = 'danger'; // Red for abnormal (high)
    }
    
    // Add a warning status for values near the upper limit of normal
    if (saturation > 45 && saturation <= 50) {
      interpretation = 'High-Normal Saturation';
      status = 'warning'; // Yellow for borderline high
    }
    
    const details = [
      `Transferrin Saturation: ${saturation.toFixed(1)}%`,
      `Interpretation: ${interpretation}`,
      '',
      'Reference Ranges:',
      '• Normal: 15-45%',
      '• Low: <15% (Iron Deficiency)',
      '• High: >45% (Potential Iron Overload)',
      '',
      'Clinical Notes:',
      '• Low saturation may indicate iron deficiency',
      '• High saturation may indicate iron overload or hemochromatosis',
      '• Always interpret in clinical context with ferritin and other iron studies'
    ];
    
    return {
      result: saturation,
      status: status,
      resultUnit: '%',
      interpretation: `Transferrin Saturation: ${saturation.toFixed(1)}%\n${interpretation}`,
      details: details
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
