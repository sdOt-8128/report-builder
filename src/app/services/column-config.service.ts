import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { ColumnDefinition } from '../models/column-definition.model';
import { CsvDataService } from './csv-data.service';

const DISPLAY_NAME_MAP: Record<string, string> = {
  LicensePlate: 'LicencePlate',
  EPALevyExTax: 'Levy',
  Transaction_Tax: 'Tax',
  Total_Transaction_Price_Inc_Levy_Inc_Tax: 'TotalRevenue',
  RateExTax: 'UnitPrice',
};

const DEFAULT_COLUMNS: string[] = [
  'TicketNumber',
  'DateIn',
  'DateOut',
  'SiteName',
  'LicensePlate',
  'TotalExTax',
  'EPALevyExTax',
  'Transaction_Tax',
  'Total_Transaction_Price_Inc_Levy_Inc_Tax',
  'ProductWeightTonnes',
  'Quantity',
  'RateExTax',
];

function guessDataType(field: string): 'string' | 'number' | 'date' {
  const lower = field.toLowerCase();
  if (lower.includes('date') || lower.includes('timestamp')) return 'date';
  if (
    lower.includes('weight') ||
    lower.includes('price') ||
    lower.includes('tax') ||
    lower.includes('levy') ||
    lower.includes('total') ||
    lower.includes('quantity') ||
    lower.includes('tonnes') ||
    lower.includes('capacity') ||
    lower.includes('percentage') ||
    lower.includes('rate')
  ) {
    return 'number';
  }
  return 'string';
}

@Injectable({ providedIn: 'root' })
export class ColumnConfigService {
  private csvData = inject(CsvDataService);
  private readonly _columns = signal<ColumnDefinition[]>([]);

  readonly allColumns = this._columns.asReadonly();

  readonly includedColumns = computed(() =>
    this._columns()
      .filter(c => c.included)
      .sort((a, b) => a.order - b.order)
  );

  readonly excludedColumns = computed(() =>
    this._columns()
      .filter(c => !c.included)
      .sort((a, b) => a.displayName.localeCompare(b.displayName))
  );

  readonly displayedColumnFields = computed(() =>
    this.includedColumns().map(c => c.field)
  );

  constructor() {
    effect(() => {
      const csvColumns = this.csvData.columns();
      if (csvColumns.length > 0 && this._columns().length === 0) {
        this.initializeColumns(csvColumns);
      }
    });
  }

  private initializeColumns(csvColumns: string[]): void {
    const columns: ColumnDefinition[] = csvColumns.map(field => ({
      field,
      displayName: DISPLAY_NAME_MAP[field] ?? field,
      included: DEFAULT_COLUMNS.includes(field),
      order: DEFAULT_COLUMNS.includes(field)
        ? DEFAULT_COLUMNS.indexOf(field)
        : 999,
      dataType: guessDataType(field),
    }));
    this._columns.set(columns);
  }

  getDisplayName(field: string): string {
    return DISPLAY_NAME_MAP[field] ?? field;
  }

  include(field: string): void {
    this.updateColumn(field, col => ({
      ...col,
      included: true,
      order: this.includedColumns().length,
    }));
  }

  exclude(field: string): void {
    this.updateColumn(field, col => ({ ...col, included: false, order: 999 }));
  }

  reorder(fields: string[]): void {
    const updated = this._columns().map(col => {
      const index = fields.indexOf(col.field);
      if (index !== -1) {
        return { ...col, order: index, included: true };
      }
      return col;
    });
    this._columns.set(updated);
  }

  setColumns(columns: ColumnDefinition[]): void {
    this._columns.set(columns);
  }

  resetToDefaults(): void {
    const updated = this._columns().map(col => ({
      ...col,
      included: DEFAULT_COLUMNS.includes(col.field),
      order: DEFAULT_COLUMNS.includes(col.field)
        ? DEFAULT_COLUMNS.indexOf(col.field)
        : 999,
    }));
    this._columns.set(updated);
  }

  private updateColumn(
    field: string,
    updater: (col: ColumnDefinition) => ColumnDefinition
  ): void {
    const updated = this._columns().map(col =>
      col.field === field ? updater(col) : col
    );
    this._columns.set(updated);
  }
}
