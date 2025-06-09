import { CalculatorConfig } from '../../calculator';

export const alpRatioConfig: CalculatorConfig = {
  id: 'alp-ratio',
  name: 'Alkaline Phosphatase Ratio',
  description: 'Assesses bone vs liver origin of elevated alkaline phosphatase.',
  category: 'Hepatology',
  resultUnit: '', // Unitless result as it's a ratio
  fields: [
    {
      id: 'alp',
      type: 'number',
      label: 'Alkaline Phosphatase (ALP)',
      placeholder: 'Enter ALP level in U/L',
      required: true,
      min: 0,
      step: 0.1,
      unit: 'U/L'
    },
    {
      id: 'ggt',
      type: 'number',
      label: 'Gamma-Glutamyl Transferase (GGT)',
      placeholder: 'Enter GGT level in U/L',
      required: true,
      min: 0,
      step: 0.1,
      unit: 'U/L'
    },
    {
      id: 'alp_upper_limit',
      type: 'number',
      label: 'Lab Upper Limit of Normal for ALP (U/L)',
      placeholder: 'e.g., 120',
      required: true,
      min: 0,
      step: 1,
      unit: 'U/L',
      value: '120'  // Common upper limit, but can be adjusted
    }
  ],
  validate: (values) => {
    const errors: Record<string, string> = {};
    if (!values.alp) errors.alp = 'ALP is required';
    if (!values.ggt) errors.ggt = 'GGT is required';
    if (!values.alp_upper_limit) errors.alp_upper_limit = 'ALP upper limit is required';
    return Object.keys(errors).length > 0 ? errors : null;
  },
  calculate: (values) => {
    const alp = parseFloat(values.alp);
    const ggt = parseFloat(values.ggt);
    const alpUpperLimit = parseFloat(values.alp_upper_limit);
    
    // Calculate the ratio
    const alpRatio = (alp / alpUpperLimit) / (ggt > 0 ? ggt : 1);
    
    // Determine likely source
    let interpretation = '';
    if (alpRatio > 4) {
      interpretation = 'Likely bone source of ALP elevation';
    } else if (alpRatio < 2) {
      interpretation = 'Likely hepatic source of ALP elevation';
    } else {
      interpretation = 'Indeterminate - could be either bone or hepatic source';
    }
    
    return {
      result: alpRatio,
      interpretation
    };
  },
  formula: 'ALP/ULN/GGT Ratio = (ALP / ALP Upper Limit) / GGT\n\nInterpretation:\n• Ratio > 4: Suggests bone source\n• Ratio < 2: Suggests hepatic source\n• Ratio 2-4: Indeterminate',
  references: [
    'Wolf PL. Clinical significance of an increased or decreased serum alkaline phosphatase level. Arch Pathol Lab Med. 1978;102(10):497-501.',
    'Van Hoof VO, et al. Comparative study of the measurement of alkaline phosphatase isoenzymes in serum by analytical isoelectric focusing and precipitation methods. Clin Chem. 1986;32(10):1993-1997.'
  ],
  
};
