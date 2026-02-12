import { Component, inject, signal, computed, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FilterService } from '../../../../services/filter.service';

@Component({
  selector: 'app-column-filter',
  imports: [FormsModule, MatFormField, MatLabel, MatInput, MatCheckbox, MatButton, MatIcon],
  template: `
    <div class="filter-panel">
      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Search</mat-label>
        <input matInput [(ngModel)]="searchText" placeholder="Filter values..." />
      </mat-form-field>

      <div class="select-actions">
        <button mat-button (click)="selectAll()">Select All</button>
        <button mat-button (click)="clearAll()">Clear</button>
      </div>

      <div class="values-list">
        @for (value of filteredValues(); track value) {
          <mat-checkbox
            [checked]="isSelected(value)"
            (change)="toggleValue(value)"
          >
            {{ value || '(empty)' }}
          </mat-checkbox>
        }
      </div>

      <div class="filter-actions">
        <button mat-button (click)="clearFilter()">
          <mat-icon>clear</mat-icon>
          Reset
        </button>
        <button mat-button color="primary" (click)="applyFilter()">
          <mat-icon>check</mat-icon>
          Apply
        </button>
      </div>
    </div>
  `,
  styles: `
    .filter-panel {
      padding: 12px;
      min-width: 220px;
      max-width: 300px;
    }

    .search-field {
      width: 100%;
    }

    .select-actions {
      display: flex;
      gap: 4px;
      margin-bottom: 8px;
    }

    .values-list {
      max-height: 200px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-bottom: 12px;
      padding: 4px 0;
    }

    .filter-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      border-top: 1px solid #e0e0e0;
      padding-top: 8px;
    }
  `,
})
export class ColumnFilterComponent {
  field = input.required<string>();

  private filterService = inject(FilterService);

  searchText = '';
  private selectedValues = signal<Set<string>>(new Set());

  private allValues = computed(() =>
    this.filterService.getUniqueValues(this.field())
  );

  filteredValues = computed(() => {
    const search = this.searchText.toLowerCase();
    if (!search) return this.allValues();
    return this.allValues().filter(v => v.toLowerCase().includes(search));
  });

  isSelected(value: string): boolean {
    const selected = this.selectedValues();
    if (selected.size === 0) return true; // All selected by default
    return selected.has(value);
  }

  toggleValue(value: string): void {
    const current = new Set(this.selectedValues());
    if (current.size === 0) {
      // First toggle: select all except this one
      const all = new Set(this.allValues());
      all.delete(value);
      this.selectedValues.set(all);
    } else if (current.has(value)) {
      current.delete(value);
      this.selectedValues.set(current);
    } else {
      current.add(value);
      this.selectedValues.set(current);
    }
  }

  selectAll(): void {
    this.selectedValues.set(new Set());
  }

  clearAll(): void {
    this.selectedValues.set(new Set(['__none__']));
  }

  applyFilter(): void {
    const selected = this.selectedValues();
    if (selected.size === 0) {
      this.filterService.clearFilter(this.field());
    } else {
      this.filterService.setFilter(this.field(), selected);
    }
  }

  clearFilter(): void {
    this.selectedValues.set(new Set());
    this.filterService.clearFilter(this.field());
  }
}
