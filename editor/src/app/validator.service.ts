import { Injectable } from '@angular/core';
import Ajv from 'ajv';
import type { ValidateFunction } from 'ajv';
import type { Recipe } from './recipe.types';

// Shared JSON schema (relative path from editor/src/app → shared/)
import recipeSchema from '../../../shared/recipe.schema.json';

@Injectable({ providedIn: 'root' })
export class ValidatorService {
  private ajv = new Ajv({ allErrors: true });
  private validate: ValidateFunction;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.validate = this.ajv.compile(recipeSchema as any);
  }

  validateRecipe(data: unknown): string[] {
    const valid = this.validate(data);
    if (valid) return [];
    return (this.validate.errors ?? []).map((e) => {
      const path = e.instancePath || '(root)';
      return `${path}: ${e.message}`;
    });
  }

  parseJSON(json: string): { data: Recipe | null; error: string | null } {
    try {
      const data = JSON.parse(json);
      return { data, error: null };
    } catch (e) {
      return { data: null, error: (e as Error).message };
    }
  }
}
