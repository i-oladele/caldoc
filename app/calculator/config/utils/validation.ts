export const validateNumber = (value: string, options: {
  min?: number;
  max?: number;
  allowZero?: boolean;
  allowNegative?: boolean;
  required?: boolean;
} = {}): string | null => {
  const num = parseFloat(value);
  
  if (!value && options.required) {
    return 'This field is required';
  }
  
  if (isNaN(num)) {
    return 'Please enter a valid number';
  }
  
  if (!options.allowZero && num === 0) {
    return 'Value cannot be zero';
  }
  
  if (!options.allowNegative && num < 0) {
    return 'Value cannot be negative';
  }
  
  if (options.min !== undefined && num < options.min) {
    return `Value must be at least ${options.min}`;
  }
  
  if (options.max !== undefined && num > options.max) {
    return `Value must be at most ${options.max}`;
  }
  
  return null;
};

export const validateDate = (value: string, format: 'YYYY-MM-DD' | 'MM/DD/YYYY' = 'YYYY-MM-DD'): string | null => {
  const regex = format === 'YYYY-MM-DD' 
    ? /^\d{4}-\d{2}-\d{2}$/
    : /^\d{2}\/\d{2}\/\d{4}$/;
  
  if (!regex.test(value)) {
    return `Please enter a valid date in ${format} format`;
  }
  
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return 'Please enter a valid date';
    }
    return null;
  } catch {
    return 'Please enter a valid date';
  }
};

export const validatePercentage = (value: string): string | null => {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return 'Please enter a valid percentage';
  }
  if (num < 0 || num > 100) {
    return 'Percentage must be between 0 and 100';
  }
  return null;
};
