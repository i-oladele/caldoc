import { CalculatorConfig } from '@/app/calculator/config/calculator';
import { glasgowBlatchfordConfig } from './glasgow-blatchford';

// Export individual calculators
export { glasgowBlatchfordConfig };

// Export all gastroenterology calculators
export const gastroenterologyCalculators: CalculatorConfig[] = [
  glasgowBlatchfordConfig,
];
