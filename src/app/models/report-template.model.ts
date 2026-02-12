import { ColumnDefinition } from './column-definition.model';

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  columns: ColumnDefinition[];
  groupBy: string[];
  filters: ColumnFilter[];
}

export interface ColumnFilter {
  field: string;
  selectedValues: string[];
}
