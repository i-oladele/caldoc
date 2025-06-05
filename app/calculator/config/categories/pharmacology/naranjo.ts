import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const naranjoConfig: CalculatorConfig = {
  id: 'naranjo',
  fields: [
    { label: 'Known Reaction', placeholder: 'Enter 1 if yes', unit: 'points', keyboardType: 'numeric' },
    { label: 'Previous Reaction', placeholder: 'Enter 1 if yes', unit: 'points', keyboardType: 'numeric' },
    { label: 'Epidemiological Evidence', placeholder: 'Enter 1 if yes', unit: 'points', keyboardType: 'numeric' },
    { label: 'Exclusion of Other Causes', placeholder: 'Enter 1 if yes', unit: 'points', keyboardType: 'numeric' },
    { label: 'Occurrence After Drug', placeholder: 'Enter 1 if yes', unit: 'points', keyboardType: 'numeric' },
    { label: 'Challenge/Dechallenge', placeholder: 'Enter 1 if yes', unit: 'points', keyboardType: 'numeric' },
    { label: 'Dose-Response', placeholder: 'Enter 1 if yes', unit: 'points', keyboardType: 'numeric' },
    { label: 'Biological Plausibility', placeholder: 'Enter 1 if yes', unit: 'points', keyboardType: 'numeric' }
  ],
  validate: (values: { [key: string]: string }) => {
    for (const key in values) {
      const value = parseInt(values[key]);
      if (isNaN(value)) {
        return `Please enter a valid number for ${key}`;
      }
      if (value < 0 || value > 1) {
        return `${key} must be 0 or 1`;
      }
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const score = Object.values(values).reduce((sum, val) => sum + parseInt(val), 0);
    let interpretation = '';
    if (score <= 0) interpretation = 'Doubtful adverse drug reaction';
    else if (score <= 4) interpretation = 'Possible adverse drug reaction';
    else if (score <= 6) interpretation = 'Probable adverse drug reaction';
    else interpretation = 'Definite adverse drug reaction';

    return {
      result: score,
      interpretation: `${interpretation} (Score: ${score})`
    };
  },
  formula: 'Sum of scores from 8 questions assessing causality of adverse drug reactions',
  references: [
    'Naranjo CA, et al. A method for estimating the probability of adverse drug reactions.',
    'Clinical Pharmacology & Therapeutics. Adverse Drug Reaction Probability Scale.',
    'Drug Safety. Assessment of Adverse Drug Reactions.'
  ],
  resultUnit: 'points'
};
