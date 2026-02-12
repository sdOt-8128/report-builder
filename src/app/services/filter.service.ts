import { Injectable, signal, computed, inject } from '@angular/core';
import { CsvDataService, TransactionRow } from './csv-data.service';

@Injectable({ providedIn: 'root' })
export class FilterService {
  private csvData = inject(CsvDataService);
  private readonly _activeFilters = signal<Map<string, Set<string>>>(new Map());

  readonly activeFilters = this._activeFilters.asReadonly();

  readonly filteredData = computed(() => {
    const data = this.csvData.data();
    const filters = this._activeFilters();

    if (filters.size === 0) return data;

    return data.filter(row =>
      Array.from(filters.entries()).every(([field, values]) =>
        values.has(row[field] ?? '')
      )
    );
  });

  readonly activeFilterCount = computed(() => this._activeFilters().size);

  getUniqueValues(field: string): string[] {
    const data = this.csvData.data();
    const unique = new Set<string>();
    for (const row of data) {
      const val = row[field];
      if (val !== undefined && val !== null && val !== '') {
        unique.add(val);
      }
    }
    return Array.from(unique).sort();
  }

  setFilter(field: string, values: Set<string>): void {
    const current = new Map(this._activeFilters());
    if (values.size === 0) {
      current.delete(field);
    } else {
      current.set(field, values);
    }
    this._activeFilters.set(current);
  }

  clearFilter(field: string): void {
    const current = new Map(this._activeFilters());
    current.delete(field);
    this._activeFilters.set(current);
  }

  clearAllFilters(): void {
    this._activeFilters.set(new Map());
  }

  isFieldFiltered(field: string): boolean {
    return this._activeFilters().has(field);
  }
}
