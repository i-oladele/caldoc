import { CalculatorConfig } from '@/app/calculator/config/calculator';

export const gestationalAgeConfig: CalculatorConfig = {
  id: 'gestational-age',
  name: 'Gestational Age Calculator',
  description: 'Calculates gestational age, estimated due date, and pregnancy progress based on the last menstrual period (LMP) and current date.',
  category: 'obstetrics',
  fields: [
    { 
      id: 'lmpDate',
      label: 'Last Menstrual Period (LMP)', 
      type: 'date',
      placeholder: 'Select LMP date',
      unit: '' 
    },
    { 
      id: 'currentDate',
      label: 'Current Date', 
      type: 'date',
      placeholder: 'Select current date',
      unit: '',
      defaultValue: new Date().toISOString().split('T')[0] // Default to today's date
    }
  ],
  validate: (values: { [key: string]: string }) => {
    const lmpDate = new Date(values['lmpDate']);
    const currentDate = new Date(values['currentDate']);
    
    if (isNaN(lmpDate.getTime())) {
      return 'Please select a valid LMP date';
    }
    if (isNaN(currentDate.getTime())) {
      return 'Please select a valid current date';
    }
    if (lmpDate >= currentDate) {
      return 'LMP date must be before current date';
    }
    return null;
  },
  calculate: (values: { [key: string]: string }) => {
    const lmpDate = new Date(values['lmpDate']);
    const currentDate = new Date(values['currentDate']);
    const days = Math.floor((currentDate.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const daysInCurrentWeek = days % 7;
    
    // Calculate EDD (40 weeks from LMP)
    const edd = new Date(lmpDate);
    edd.setDate(lmpDate.getDate() + 280);
    
    // Calculate days/weeks remaining until EDD
    const daysRemaining = Math.max(0, Math.ceil((edd.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)));
    const weeksRemaining = Math.floor(daysRemaining / 7);
    const remainingDaysInWeek = daysRemaining % 7;
    
    // Determine trimester
    let trimester = '';
    if (weeks < 13) {
      trimester = 'First Trimester (0-12 weeks)';
    } else if (weeks < 28) {
      trimester = 'Second Trimester (13-27 weeks)';
    } else {
      trimester = 'Third Trimester (28+ weeks)';
    }
    
    // Format EDD as Month Day, Year (e.g., January 1, 2025)
    const formattedEDD = edd.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    return {
      result: weeks,
      interpretation: [
        `Gestational Age: ${weeks} weeks and ${daysInCurrentWeek} days`,
        `Estimated Due Date: ${formattedEDD}`,
        `Trimester: ${trimester}`,
        `Time Remaining: ${weeksRemaining} weeks and ${remainingDaysInWeek} days`
      ].join('\n\n'),
      resultDetails: [
        { 
          label: 'Gestational Age', 
          value: `${weeks} weeks and ${daysInCurrentWeek} days`,
          status: weeks < 37 ? 'success' : weeks < 42 ? 'warning' : 'danger'
        },
        { 
          label: 'Estimated Due Date', 
          value: formattedEDD,
          status: 'info'
        },
        { 
          label: 'Trimester', 
          value: trimester,
          status: 'info'
        },
        { 
          label: 'Time Remaining', 
          value: `${weeksRemaining} weeks and ${remainingDaysInWeek} days`,
          status: weeksRemaining > 4 ? 'success' : weeksRemaining > 2 ? 'warning' : 'danger'
        }
      ]
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
