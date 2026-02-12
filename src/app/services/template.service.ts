import { Injectable, signal } from '@angular/core';
import { ReportTemplate } from '../models/report-template.model';

@Injectable({ providedIn: 'root' })
export class TemplateService {
  private readonly _templates = signal<ReportTemplate[]>([
    {
      id: '1',
      name: 'Daily Summary',
      description: 'Basic daily transaction overview with key financial columns',
      createdAt: new Date('2025-01-15'),
      columns: [],
      groupBy: [],
      filters: [],
    },
    {
      id: '2',
      name: 'Waste Stream Analysis',
      description: 'Transactions grouped by waste stream and material composition',
      createdAt: new Date('2025-02-01'),
      columns: [],
      groupBy: ['WasteStream', 'MaterialComposition'],
      filters: [],
    },
    {
      id: '3',
      name: 'Vehicle Report',
      description: 'Focus on vehicle weights, configurations and overload tracking',
      createdAt: new Date('2025-02-10'),
      columns: [],
      groupBy: [],
      filters: [],
    },
  ]);

  readonly templates = this._templates.asReadonly();

  save(name: string, description: string): void {
    const template: ReportTemplate = {
      id: crypto.randomUUID(),
      name,
      description,
      createdAt: new Date(),
      columns: [],
      groupBy: [],
      filters: [],
    };
    this._templates.set([...this._templates(), template]);
  }

  delete(id: string): void {
    this._templates.set(this._templates().filter(t => t.id !== id));
  }

  getById(id: string): ReportTemplate | undefined {
    return this._templates().find(t => t.id === id);
  }
}
