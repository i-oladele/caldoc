// Define the CalculatorConfig type
export interface CalculatorConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: Array<{
    id: string;
    label: string;
    type: 'number' | 'select' | 'radio' | 'checkbox';
    required?: boolean;
    options?: Array<{ label: string; value: string }>;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
  }>;
  calculate: (values: Record<string, any>) => { result: number; interpretation: string };
}

export {};
