import { CalculatorConfig } from '@/app/calculator/config/calculator';

export async function loadCalculatorConfig(
  id: string
): Promise<CalculatorConfig | null> {
  try {
    const config = await import(`@/app/calculator/config/calculators/${id}`);
    return config.default as CalculatorConfig;
  } catch (error) {
    console.error(`Failed to load calculator config for ${id}:`, error);
    return null;
  }
}

export async function loadCategoryConfig(
  category: string,
  id: string
): Promise<CalculatorConfig | null> {
  try {
    const config = await import(
      `@/app/calculator/config/categories/${category}/${id}`
    );
    return config.default as CalculatorConfig;
  } catch (error) {
    console.error(
      `Failed to load calculator config for ${category}/${id}:`,
      error
    );
    return null;
  }
}
