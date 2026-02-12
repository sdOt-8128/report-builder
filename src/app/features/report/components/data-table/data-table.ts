import { Component, inject, effect, viewChild, AfterViewInit, computed, signal } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger, MatMenuItem } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
import { ColumnConfigService } from '../../../../services/column-config.service';
import { FilterService } from '../../../../services/filter.service';
import { GroupingService } from '../../../../services/grouping.service';
import { ColumnFilterComponent } from '../column-filter/column-filter';
import { TransactionRow } from '../../../../services/csv-data.service';

export interface GroupHeaderRow {
  _isGroupHeader: true;
  _groupField: string;
  _groupValue: string;
  _level: number;
  _rowCount: number;
  _key: string;
  [field: string]: unknown;
}

export type TableRow = TransactionRow | GroupHeaderRow;

function isGroupHeader(row: TableRow): row is GroupHeaderRow {
  return '_isGroupHeader' in row && row['_isGroupHeader'] === true;
}

@Component({
  selector: 'app-data-table',
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconButton,
    MatIcon,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    MatDivider,
    ColumnFilterComponent,
  ],
  template: `
    <div class="table-container">
      <div class="table-scroll">
        <table mat-table [dataSource]="dataSource" matSort [class.grouped]="isGrouped()">
          @for (col of columnConfig.includedColumns(); track col.field) {
            <ng-container [matColumnDef]="col.field">
              <th mat-header-cell *matHeaderCellDef mat-sort-header class="header-cell">
                <span class="header-content">{{ col.displayName }}</span>
                <button
                  mat-icon-button
                  class="filter-button"
                  [class.filter-active]="filterService.isFieldFiltered(col.field)"
                  [matMenuTriggerFor]="filterMenu"
                  (click)="$event.stopPropagation()"
                >
                  <mat-icon>filter_list</mat-icon>
                </button>
                <mat-menu #filterMenu="matMenu" class="filter-menu">
                  <div (click)="$event.stopPropagation()" (keydown)="$event.stopPropagation()">
                    <app-column-filter [field]="col.field" />
                    <mat-divider />
                    <button mat-menu-item (click)="onGroupBy(col.field)">
                      <mat-icon>group_work</mat-icon>
                      <span>Group by {{ col.displayName }}</span>
                    </button>
                  </div>
                </mat-menu>
                <span
                  class="resize-handle"
                  (mousedown)="onResizeStart($event)"
                  (click)="$event.stopPropagation()"
                ></span>
              </th>
              <td mat-cell *matCellDef="let row">
                @if (isGroupHeader(row)) {
                  @if (isFirstColumn(col.field)) {
                    <span class="group-header-cell" [style.padding-left.px]="row._level * 24">
                      <button mat-icon-button class="expand-btn" (click)="toggleGroup(row._key)">
                        <mat-icon>{{ isExpanded(row._key) ? 'expand_more' : 'chevron_right' }}</mat-icon>
                      </button>
                      <strong>{{ getGroupDisplayName(row._groupField) }}: {{ row._groupValue || '(empty)' }}</strong>
                      <span class="row-count">({{ row._rowCount }} rows)</span>
                    </span>
                  } @else if (isNumericColumn(col.field)) {
                    <span class="aggregate-value">{{ formatNumber(row[col.field]) }}</span>
                  }
                } @else {
                  {{ row[col.field] }}
                }
              </td>
            </ng-container>
          }

          <tr mat-header-row *matHeaderRowDef="columnConfig.displayedColumnFields(); sticky: true"></tr>
          <tr
            mat-row
            *matRowDef="let row; columns: columnConfig.displayedColumnFields()"
            [class.group-header-row]="isGroupHeader(row)"
            [class.group-level-0]="isGroupHeader(row) && row._level === 0"
            [class.group-level-1]="isGroupHeader(row) && row._level === 1"
            [class.group-level-2]="isGroupHeader(row) && row._level === 2"
          ></tr>

          <tr class="mat-row" *matNoDataRow>
            <td class="no-data" [attr.colspan]="columnConfig.displayedColumnFields().length">
              No data matching the current filters.
            </td>
          </tr>
        </table>
      </div>

      @if (!isGrouped()) {
        <mat-paginator
          [pageSizeOptions]="[25, 50, 100]"
          [pageSize]="25"
          showFirstLastButtons
        />
      }
    </div>
  `,
  styles: `
    .table-container {
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      border-top: none;
      border-radius: 0 0 8px 8px;
      overflow: hidden;
    }

    .table-scroll {
      overflow-x: auto;
      max-height: calc(100vh - 280px);
    }

    table {
      width: max-content;
      min-width: 100%;
      table-layout: fixed;
    }

    th {
      min-width: 100px;
    }

    .header-cell {
      white-space: nowrap;
      position: relative;
    }

    .resize-handle {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      cursor: col-resize;
      background: transparent;
      z-index: 1;

      &:hover, &:active {
        background-color: #DC3B75;
      }
    }

    .filter-button {
      opacity: 0.4;
      transform: scale(0.75);
      transition: opacity 0.2s;

      &:hover, &.filter-active {
        opacity: 1;
      }
    }

    .filter-active {
      color: #DC3B75;
    }

    td {
      white-space: nowrap;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .no-data {
      text-align: center;
      padding: 48px 16px;
      color: #999;
    }

    .group-header-row {
      background-color: #f0f0f0 !important;
      font-weight: 500;
      cursor: pointer;
    }

    .group-level-0 {
      background-color: #e8e8e8 !important;
    }

    .group-level-1 {
      background-color: #eeeeee !important;
    }

    .group-level-2 {
      background-color: #f3f3f3 !important;
    }

    .group-header-cell {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .expand-btn {
      width: 28px;
      height: 28px;
      line-height: 28px;

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }

    .row-count {
      color: #888;
      font-weight: 400;
      font-size: 0.8rem;
      margin-left: 4px;
    }

    .aggregate-value {
      font-weight: 500;
      color: #DC3B75;
    }

    ::ng-deep .filter-menu .mat-mdc-menu-panel {
      max-width: 320px;
    }
  `,
})
export class DataTableComponent implements AfterViewInit {
  columnConfig = inject(ColumnConfigService);
  filterService = inject(FilterService);
  private groupingService = inject(GroupingService);

  dataSource = new MatTableDataSource<TableRow>([]);
  private expandedGroups = signal<Set<string>>(new Set());

  isGrouped = computed(() => this.groupingService.groupByColumns().length > 0);

  private sort = viewChild(MatSort);
  private paginator = viewChild(MatPaginator);

  // Cache numeric column detection
  private numericColumns = new Set<string>();

  constructor() {
    effect(() => {
      const data = this.filterService.filteredData();
      const groupByColumns = this.groupingService.groupByColumns();
      const columns = this.columnConfig.includedColumns();

      // Update numeric columns cache
      this.numericColumns = new Set(
        columns.filter(c => c.dataType === 'number').map(c => c.field)
      );

      if (groupByColumns.length === 0) {
        this.dataSource.data = data;
        // Re-attach paginator when ungrouping
        setTimeout(() => {
          const paginator = this.paginator();
          if (paginator) this.dataSource.paginator = paginator;
        });
      } else {
        this.dataSource.paginator = null;
        const flatRows = this.buildGroupedRows(data, groupByColumns, 0, '');
        this.dataSource.data = flatRows;
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const sort = this.sort();
      const paginator = this.paginator();
      if (sort) this.dataSource.sort = sort;
      if (paginator && !this.isGrouped()) {
        this.dataSource.paginator = paginator;
      }
    });
  }

  isGroupHeader = isGroupHeader;

  isFirstColumn(field: string): boolean {
    const fields = this.columnConfig.displayedColumnFields();
    return fields.length > 0 && fields[0] === field;
  }

  isNumericColumn(field: string): boolean {
    return this.numericColumns.has(field);
  }

  getGroupDisplayName(field: string): string {
    return this.columnConfig.getDisplayName(field);
  }

  isExpanded(key: string): boolean {
    return this.expandedGroups().has(key);
  }

  toggleGroup(key: string): void {
    const expanded = new Set(this.expandedGroups());
    if (expanded.has(key)) {
      expanded.delete(key);
    } else {
      expanded.add(key);
    }
    this.expandedGroups.set(expanded);

    // Rebuild visible rows
    const data = this.filterService.filteredData();
    const groupByColumns = this.groupingService.groupByColumns();
    if (groupByColumns.length > 0) {
      const flatRows = this.buildGroupedRows(data, groupByColumns, 0, '');
      this.dataSource.data = flatRows;
    }
  }

  onResizeStart(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const th = (event.target as HTMLElement).closest('th') as HTMLElement;
    if (!th) return;

    const startX = event.pageX;
    const startWidth = th.offsetWidth;

    const onMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(60, startWidth + (e.pageX - startX));
      th.style.width = `${newWidth}px`;
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  onGroupBy(field: string): void {
    this.groupingService.addGroup(field);
  }

  formatNumber(value: unknown): string {
    if (value === null || value === undefined || value === '') return '';
    const num = Number(value);
    if (isNaN(num)) return String(value);
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }

  private buildGroupedRows(
    data: TransactionRow[],
    groupByColumns: string[],
    level: number,
    parentKey: string,
  ): TableRow[] {
    if (level >= groupByColumns.length) {
      return data;
    }

    const field = groupByColumns[level];
    const groups = new Map<string, TransactionRow[]>();

    for (const row of data) {
      const value = row[field] ?? '';
      if (!groups.has(value)) {
        groups.set(value, []);
      }
      groups.get(value)!.push(row);
    }

    const result: TableRow[] = [];

    // Sort group keys
    const sortedKeys = Array.from(groups.keys()).sort();

    for (const groupValue of sortedKeys) {
      const groupRows = groups.get(groupValue)!;
      const key = parentKey ? `${parentKey}|${field}:${groupValue}` : `${field}:${groupValue}`;

      // Build group header with aggregates
      const header: GroupHeaderRow = {
        _isGroupHeader: true,
        _groupField: field,
        _groupValue: groupValue,
        _level: level,
        _rowCount: groupRows.length,
        _key: key,
      };

      // Calculate aggregates for numeric columns
      for (const numField of this.numericColumns) {
        let sum = 0;
        let hasValues = false;
        for (const row of groupRows) {
          const val = Number(row[numField]);
          if (!isNaN(val)) {
            sum += val;
            hasValues = true;
          }
        }
        header[numField] = hasValues ? sum : '';
      }

      result.push(header);

      // Only add children if expanded
      if (this.expandedGroups().has(key)) {
        if (level + 1 < groupByColumns.length) {
          // More grouping levels: recurse
          const childRows = this.buildGroupedRows(groupRows, groupByColumns, level + 1, key);
          result.push(...childRows);
        } else {
          // Leaf level: add data rows
          result.push(...groupRows);
        }
      }
    }

    return result;
  }
}
