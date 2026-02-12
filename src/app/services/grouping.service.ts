import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GroupingService {
  private readonly _groupByColumns = signal<string[]>([]);

  readonly groupByColumns = this._groupByColumns.asReadonly();

  addGroup(field: string): void {
    const current = this._groupByColumns();
    if (!current.includes(field)) {
      this._groupByColumns.set([...current, field]);
    }
  }

  removeGroup(field: string): void {
    this._groupByColumns.set(
      this._groupByColumns().filter(f => f !== field)
    );
  }

  reorderGroups(fields: string[]): void {
    this._groupByColumns.set(fields);
  }

  clearGroups(): void {
    this._groupByColumns.set([]);
  }

  isGrouped(field: string): boolean {
    return this._groupByColumns().includes(field);
  }
}
