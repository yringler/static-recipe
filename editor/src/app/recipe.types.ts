// Re-export from shared schema (using relative path since Angular resolves paths
// from project root via tsconfig paths, but for direct imports this works too)

export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  source?: string;
  yield: { amount: number; unit: string };
  timing: { prep: string; cook: string; total: string; rest?: string };
  ingredients: IngredientGroup[];
  steps: StepGroup[];
  notes?: string[];
}

export interface IngredientGroup {
  heading?: string;
  items: Ingredient[];
}

export interface Ingredient {
  quantity: number | null;
  unit: string | null;
  item: string;
  notes?: string;
  scalable: boolean;
}

export interface StepGroup {
  heading?: string;
  steps: Step[];
}

export interface Step {
  instruction: string;
  duration?: string;
  temperature?: { value: number; unit: 'F' | 'C' };
}

export const EMPTY_RECIPE: Recipe = {
  id: '',
  title: '',
  description: '',
  category: '',
  tags: [],
  source: '',
  yield: { amount: 1, unit: 'servings' },
  timing: { prep: 'PT0M', cook: 'PT0M', total: 'PT0M' },
  ingredients: [{ items: [{ quantity: null, unit: null, item: '', scalable: true }] }],
  steps: [{ steps: [{ instruction: '' }] }],
  notes: [],
};

export const CATEGORIES = ['bread', 'dessert', 'main', 'side', 'snack', 'soup', 'salad'];
