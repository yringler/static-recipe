import {
  Component,
  signal,
  computed,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidatorService } from '../validator.service';
import { toISO8601, fromISO8601 } from '../duration.utils';
import { EMPTY_RECIPE, CATEGORIES } from '../recipe.types';
import type { Recipe, Ingredient, Step, IngredientGroup, StepGroup } from '../recipe.types';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './editor.component.html',
})
export class EditorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private validator = inject(ValidatorService);

  readonly categories = CATEGORIES;

  // JSON panel state
  jsonText = signal('');
  jsonError = signal<string | null>(null);
  validationErrors = signal<string[]>([]);
  copySuccess = signal(false);

  // Form
  form!: FormGroup;
  tagInput = signal('');

  ngOnInit(): void {
    this.form = this.buildForm(EMPTY_RECIPE);
    this.loadNewRecipe();
  }

  // ---- Form Builders ------------------------------------------------

  private buildForm(recipe: Recipe): FormGroup {
    return this.fb.group({
      id: [recipe.id, Validators.required],
      title: [recipe.title, Validators.required],
      description: [recipe.description],
      category: [recipe.category],
      tags: this.fb.array((recipe.tags ?? []).map((t) => new FormControl(t))),
      source: [recipe.source ?? ''],
      yieldAmount: [recipe.yield.amount, [Validators.required, Validators.min(0)]],
      yieldUnit: [recipe.yield.unit],
      timingPrep: [fromISO8601(recipe.timing.prep)],
      timingCook: [fromISO8601(recipe.timing.cook)],
      timingTotal: [fromISO8601(recipe.timing.total)],
      timingRest: [recipe.timing.rest ? fromISO8601(recipe.timing.rest) : ''],
      ingredientGroups: this.fb.array(
        recipe.ingredients.map((g) => this.buildIngredientGroup(g))
      ),
      stepGroups: this.fb.array(
        recipe.steps.map((g) => this.buildStepGroup(g))
      ),
      notes: this.fb.array((recipe.notes ?? []).map((n) => new FormControl(n))),
    });
  }

  private buildIngredientGroup(g: IngredientGroup): FormGroup {
    return this.fb.group({
      heading: [g.heading ?? ''],
      items: this.fb.array(g.items.map((i) => this.buildIngredientRow(i))),
    });
  }

  private buildIngredientRow(i: Ingredient): FormGroup {
    return this.fb.group({
      quantity: [i.quantity],
      unit: [i.unit ?? ''],
      item: [i.item, Validators.required],
      notes: [i.notes ?? ''],
      scalable: [i.scalable],
    });
  }

  private buildStepGroup(g: StepGroup): FormGroup {
    return this.fb.group({
      heading: [g.heading ?? ''],
      steps: this.fb.array(g.steps.map((s) => this.buildStepRow(s))),
    });
  }

  private buildStepRow(s: Step): FormGroup {
    return this.fb.group({
      instruction: [s.instruction, Validators.required],
      duration: [s.duration ? fromISO8601(s.duration) : ''],
      tempValue: [s.temperature?.value ?? ''],
      tempUnit: [s.temperature?.unit ?? 'F'],
    });
  }

  // ---- Getters for FormArrays ----------------------------------------

  get tags(): FormArray {
    return this.form.get('tags') as FormArray;
  }

  get ingredientGroups(): FormArray {
    return this.form.get('ingredientGroups') as FormArray;
  }

  get stepGroups(): FormArray {
    return this.form.get('stepGroups') as FormArray;
  }

  get notes(): FormArray {
    return this.form.get('notes') as FormArray;
  }

  getIngredientItems(groupIndex: number): FormArray {
    return (this.ingredientGroups.at(groupIndex) as FormGroup).get('items') as FormArray;
  }

  getStepItems(groupIndex: number): FormArray {
    return (this.stepGroups.at(groupIndex) as FormGroup).get('steps') as FormArray;
  }

  // ---- Tag Management -----------------------------------------------

  addTag(event: Event): void {
    event.preventDefault();
    const val = this.tagInput().trim();
    if (!val) return;
    this.tags.push(new FormControl(val));
    this.tagInput.set('');
  }

  removeTag(index: number): void {
    this.tags.removeAt(index);
  }

  // ---- Ingredient Group Management ----------------------------------

  addIngredientGroup(): void {
    this.ingredientGroups.push(
      this.buildIngredientGroup({ items: [{ quantity: null, unit: null, item: '', scalable: true }] })
    );
  }

  removeIngredientGroup(i: number): void {
    this.ingredientGroups.removeAt(i);
  }

  addIngredientRow(groupIndex: number): void {
    this.getIngredientItems(groupIndex).push(
      this.buildIngredientRow({ quantity: null, unit: null, item: '', scalable: true })
    );
  }

  removeIngredientRow(groupIndex: number, rowIndex: number): void {
    this.getIngredientItems(groupIndex).removeAt(rowIndex);
  }

  moveIngredientRow(groupIndex: number, rowIndex: number, direction: -1 | 1): void {
    const arr = this.getIngredientItems(groupIndex);
    const newIndex = rowIndex + direction;
    if (newIndex < 0 || newIndex >= arr.length) return;
    const ctrl = arr.at(rowIndex);
    arr.removeAt(rowIndex);
    arr.insert(newIndex, ctrl);
  }

  // ---- Step Group Management ----------------------------------------

  addStepGroup(): void {
    this.stepGroups.push(this.buildStepGroup({ steps: [{ instruction: '' }] }));
  }

  removeStepGroup(i: number): void {
    this.stepGroups.removeAt(i);
  }

  addStepRow(groupIndex: number): void {
    this.getStepItems(groupIndex).push(this.buildStepRow({ instruction: '' }));
  }

  removeStepRow(groupIndex: number, rowIndex: number): void {
    this.getStepItems(groupIndex).removeAt(rowIndex);
  }

  moveStepRow(groupIndex: number, rowIndex: number, direction: -1 | 1): void {
    const arr = this.getStepItems(groupIndex);
    const newIndex = rowIndex + direction;
    if (newIndex < 0 || newIndex >= arr.length) return;
    const ctrl = arr.at(rowIndex);
    arr.removeAt(rowIndex);
    arr.insert(newIndex, ctrl);
  }

  // ---- Notes Management --------------------------------------------

  addNote(): void {
    this.notes.push(new FormControl(''));
  }

  removeNote(i: number): void {
    this.notes.removeAt(i);
  }

  // ---- Load / Generate / Copy --------------------------------------

  loadNewRecipe(): void {
    this.form = this.buildForm(EMPTY_RECIPE);
    this.jsonText.set(JSON.stringify(EMPTY_RECIPE, null, 2));
    this.jsonError.set(null);
    this.validationErrors.set([]);
  }

  loadFromJSON(): void {
    const { data, error } = this.validator.parseJSON(this.jsonText());
    if (error) {
      this.jsonError.set(`JSON parse error: ${error}`);
      return;
    }
    this.jsonError.set(null);

    const errs = this.validator.validateRecipe(data);
    this.validationErrors.set(errs);
    if (errs.length > 0) return;

    this.form = this.buildForm(data as Recipe);
  }

  generateJSON(): void {
    const recipe = this.formToRecipe();
    this.jsonText.set(JSON.stringify(recipe, null, 2));
    this.jsonError.set(null);
  }

  validateForm(): void {
    const recipe = this.formToRecipe();
    const errs = this.validator.validateRecipe(recipe);
    this.validationErrors.set(errs);
    if (errs.length === 0) {
      this.jsonText.set(JSON.stringify(recipe, null, 2));
    }
  }

  async copyJSON(): Promise<void> {
    const recipe = this.formToRecipe();
    const json = JSON.stringify(recipe, null, 2);
    try {
      await navigator.clipboard.writeText(json);
      this.copySuccess.set(true);
      setTimeout(() => this.copySuccess.set(false), 2000);
    } catch {
      // Fallback: update textarea so user can manually copy
      this.jsonText.set(json);
    }
  }

  // ---- Form → Recipe serialization --------------------------------

  private formToRecipe(): Recipe {
    const v = this.form.value;

    const ingredients: IngredientGroup[] = (v.ingredientGroups ?? []).map(
      (g: { heading: string; items: Array<{ quantity: string; unit: string; item: string; notes: string; scalable: boolean }> }) => ({
        ...(g.heading ? { heading: g.heading } : {}),
        items: g.items.map((i) => ({
          quantity: i.quantity !== '' && i.quantity !== null ? Number(i.quantity) : null,
          unit: i.unit || null,
          item: i.item,
          ...(i.notes ? { notes: i.notes } : {}),
          scalable: i.scalable,
        })),
      })
    );

    const steps: StepGroup[] = (v.stepGroups ?? []).map(
      (g: { heading: string; steps: Array<{ instruction: string; duration: string; tempValue: string | number; tempUnit: 'F' | 'C' }> }) => ({
        ...(g.heading ? { heading: g.heading } : {}),
        steps: g.steps.map((s) => ({
          instruction: s.instruction,
          ...(s.duration ? { duration: toISO8601(s.duration) } : {}),
          ...(s.tempValue !== '' && s.tempValue !== null
            ? { temperature: { value: Number(s.tempValue), unit: s.tempUnit } }
            : {}),
        })),
      })
    );

    const notes: string[] = (v.notes ?? []).filter((n: string) => n.trim());

    return {
      id: v.id,
      title: v.title,
      description: v.description,
      category: v.category,
      tags: (v.tags ?? []).filter((t: string) => t.trim()),
      ...(v.source ? { source: v.source } : {}),
      yield: { amount: Number(v.yieldAmount), unit: v.yieldUnit },
      timing: {
        prep: toISO8601(v.timingPrep),
        cook: toISO8601(v.timingCook),
        total: toISO8601(v.timingTotal),
        ...(v.timingRest ? { rest: toISO8601(v.timingRest) } : {}),
      },
      ingredients,
      steps,
      ...(notes.length > 0 ? { notes } : {}),
    };
  }
}
