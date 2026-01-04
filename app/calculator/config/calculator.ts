export interface InputField {
  id: string;
  label: string;
  type: 'number' | 'select' | 'radio' | 'checkbox' | 'date';
  placeholder?: string;
  required?: boolean | string;
  options?: Array<{ label: string; value: string }>;
  min?: number | string;
  max?: number | string;
  step?: number;
  unit?: string;
  keyboardType?: 'numeric' | 'decimal-pad' | 'number-pad' | 'default';
  value?: string;
  defaultValue?: string;
  group?: string;
  groupPosition?: 'start' | 'middle' | 'end';
  hideLabel?: boolean;
}

export type CalculatorValues = Record<string, string | boolean>;

export type CalculationStatus = 'success' | 'warning' | 'danger';

export interface CalculationResult {
  result: number;
  interpretation: string;
  status?: CalculationStatus;
}

export interface CalculatorConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: InputField[];
  validate: (values: CalculatorValues) => Record<string, string> | string | null;
  calculate: (values: CalculatorValues) => CalculationResult;
  formula?: string;
  references?: string[];
  resultUnit: string;
}

export interface CalculatorMetadata {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface CalculatorCategory {
  id: string;
  name: string;
  description: string;
}

export const CALCULATOR_CATEGORIES: CalculatorCategory[] = [
  { id: 'general', name: 'General', description: 'General medical calculators' },
  { id: 'cardiology', name: 'Cardiology', description: 'Cardiovascular calculators' },
  { id: 'neurology', name: 'Neurology', description: 'Neurological calculators' },
  { id: 'respiratory', name: 'Respiratory', description: 'Respiratory calculators' },
  { id: 'hematology', name: 'Hematology', description: 'Blood-related calculators' },
  { id: 'criticalcare', name: 'Critical Care', description: 'ICU and emergency calculators' },
  { id: 'pediatrics', name: 'Pediatrics', description: 'Pediatric calculators' },
  { id: 'nephrology', name: 'Nephrology', description: 'Kidney-related calculators' }
];
