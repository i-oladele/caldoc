import { CalculatorConfig, InputField } from '@/app/calculator/config/calculator';

export const gestationalAgeConfig: CalculatorConfig = {
  id: 'gestational-age',
  fields: [
    { label: 'LMP Date', placeholder: 'Enter date (YYYY-MM-DD)', unit: '', keyboardType: 'default' },
    { label: 'Current Date', placeholder: 'Enter date (YYYY-MM-DD)', unit: '', keyboardType: 'default' }
  ],
  validate: (values: { [key: string]: string }) => {
    const lmpDate = new Date(values['LMP Date']);
    const currentDate = new Date(values['Current Date']);
    
    if (isNaN(lmpDate.getTime())) {
      return 'Please enter a valid LMP date';
    }
    if (isNaN(currentDate.getTime())) {
      return 'Please enter a valid current date';
    }
    if (lmpDate >= currentDate) {
      return 'LMP date must be before current date';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const lmpDate = new Date(values['LMP Date']);
    const currentDate = new Date(values['Current Date']);
    const days = Math.floor((currentDate.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const daysInCurrentWeek = days % 7;
    
    // Calculate EDD
    const edd = new Date(lmpDate);
    edd.setDate(lmpDate.getDate() + 280);
    
    return {
      result: weeks,
      interpretation: `Gestational Age: ${weeks} weeks ${daysInCurrentWeek} days\nEstimated Due Date: ${edd.toISOString().split('T')[0]}`
    };
  },
  formula: 'GA = (Current Date - LMP) / 7\nEDD = LMP + 280 days',
  references: [
    'American College of Obstetricians and Gynecologists. Methods for Estimating Due Date.',
    'World Health Organization. Pregnancy Dating and Assessment.',
    'Journal of Obstetrics and Gynecology. Gestational Age Calculation Methods.'
  ],
  resultUnit: 'weeks'
};
