export interface Recipe {
  id: string;                    // kebab-case slug, e.g. "challah-bread"
  title: string;
  description: string;           // short summary, 1-2 sentences
  category: string;              // e.g. "bread", "main", "dessert", "side", "soup"
  tags: string[];                // e.g. ["shabbos", "dairy", "quick"]
  source?: string;               // attribution — cookbook name, URL, "family recipe", etc.

  yield: {
    amount: number;              // e.g. 10
    unit: string;                // e.g. "servings", "loaves", "cookies"
  };

  timing: {
    prep: string;                // ISO 8601 duration, e.g. "PT30M"
    cook: string;
    total: string;
    rest?: string;               // for doughs, marinades, etc.
  };

  ingredients: IngredientGroup[];
  steps: StepGroup[];

  notes?: string[];              // optional freeform tips at the end
}

export interface IngredientGroup {
  heading?: string;              // e.g. "For the dough", "For the filling" — omit if only one group
  items: Ingredient[];
}

export interface Ingredient {
  quantity: number | null;       // null for "to taste", "as needed"
  unit: string | null;           // null for count items ("3 eggs")
  item: string;                  // e.g. "all-purpose flour"
  notes?: string;                // e.g. "sifted", "room temperature"
  scalable: boolean;             // false for things like "1 pinch salt" that don't scale linearly
}

export interface IngredientGroup {
  heading?: string;
  items: Ingredient[];
}

export interface StepGroup {
  heading?: string;              // e.g. "Make the dough", "Assemble" — omit if only one group
  steps: Step[];
}

export interface Step {
  instruction: string;
  duration?: string;             // ISO 8601 duration if there's a wait/timer, e.g. "PT10M"
  temperature?: {
    value: number;
    unit: "F" | "C";
  };
}
