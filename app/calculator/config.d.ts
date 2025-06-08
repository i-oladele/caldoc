import { CalculatorConfig } from './config/calculator';

declare module '@/app/calculator/config' {
  export function loadCalculatorConfig(id: string): Promise<CalculatorConfig>;
}
