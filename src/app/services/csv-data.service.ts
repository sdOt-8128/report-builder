import { Injectable, signal, computed } from '@angular/core';

export type TransactionRow = Record<string, string>;

@Injectable({ providedIn: 'root' })
export class CsvDataService {
  private readonly _data = signal<TransactionRow[]>([]);
  private readonly _columns = signal<string[]>([]);
  private readonly _loaded = signal(false);

  readonly data = this._data.asReadonly();
  readonly columns = this._columns.asReadonly();
  readonly loaded = this._loaded.asReadonly();
  readonly rowCount = computed(() => this._data().length);

  constructor() {
    this.loadCsv();
  }

  private async loadCsv(): Promise<void> {
    try {
      const response = await fetch('sample.csv');
      const text = await response.text();
      const { headers, rows } = this.parseCsv(text);
      this._columns.set(headers);
      this._data.set(rows);
      this._loaded.set(true);
    } catch (error) {
      console.error('Failed to load CSV data:', error);
    }
  }

  private parseCsv(text: string): { headers: string[]; rows: TransactionRow[] } {
    // Strip BOM
    const cleaned = text.replace(/^\uFEFF/, '');
    const lines = cleaned.split(/\r?\n/).filter(line => line.trim().length > 0);

    if (lines.length === 0) {
      return { headers: [], rows: [] };
    }

    const headers = this.parseCsvLine(lines[0]).map(h => h.trim());
    const rows: TransactionRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCsvLine(lines[i]);
      const row: TransactionRow = {};
      for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = values[j]?.trim() ?? '';
      }
      rows.push(row);
    }

    return { headers, rows };
  }

  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (inQuotes) {
        if (char === '"' && line[i + 1] === '"') {
          current += '"';
          i++;
        } else if (char === '"') {
          inQuotes = false;
        } else {
          current += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          result.push(current);
          current = '';
        } else {
          current += char;
        }
      }
    }
    result.push(current);
    return result;
  }
}
