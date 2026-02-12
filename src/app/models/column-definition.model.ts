export interface ColumnDefinition {
  field: string;
  displayName: string;
  included: boolean;
  order: number;
  dataType: 'string' | 'number' | 'date';
}
