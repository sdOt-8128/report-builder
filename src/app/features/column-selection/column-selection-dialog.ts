import { Component, inject, signal } from '@angular/core';
import {
  CdkDropList,
  CdkDrag,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { ColumnConfigService } from '../../services/column-config.service';
import { ColumnDefinition } from '../../models/column-definition.model';

@Component({
  selector: 'app-column-selection-dialog',
  imports: [
    CdkDropList,
    CdkDrag,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatIcon,
    MatDivider,
  ],
  template: `
    <h2 mat-dialog-title>Select Columns</h2>
    <mat-dialog-content>
      <div class="columns-layout">
        <div class="column-panel">
          <h3>Included</h3>
          <div
            class="column-list included-list"
            cdkDropList
            #includedList="cdkDropList"
            [cdkDropListData]="included()"
            [cdkDropListConnectedTo]="[excludedList]"
            (cdkDropListDropped)="onDrop($event)"
          >
            @for (col of included(); track col.field) {
              <div class="column-item" cdkDrag [cdkDragData]="col">
                <mat-icon class="drag-handle">drag_indicator</mat-icon>
                <span class="column-name">{{ col.displayName }}</span>
                <span class="column-field">{{ col.field }}</span>
              </div>
            } @empty {
              <div class="empty-hint">Drop columns here to include</div>
            }
          </div>
        </div>

        <mat-divider vertical />

        <div class="column-panel">
          <h3>Available</h3>
          <div
            class="column-list excluded-list"
            cdkDropList
            #excludedList="cdkDropList"
            [cdkDropListData]="excluded()"
            [cdkDropListConnectedTo]="[includedList]"
            (cdkDropListDropped)="onDrop($event)"
          >
            @for (col of excluded(); track col.field) {
              <div class="column-item" cdkDrag [cdkDragData]="col">
                <mat-icon class="drag-handle">drag_indicator</mat-icon>
                <span class="column-name">{{ col.displayName }}</span>
              </div>
            } @empty {
              <div class="empty-hint">All columns are included</div>
            }
          </div>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onReset()">Reset Defaults</button>
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-button color="primary" (click)="onApply()">Apply</button>
    </mat-dialog-actions>
  `,
  styles: `
    .columns-layout {
      display: flex;
      gap: 16px;
      min-height: 400px;
    }

    .column-panel {
      flex: 1;
      display: flex;
      flex-direction: column;

      h3 {
        margin: 0 0 8px;
        font-size: 0.85rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #888;
      }
    }

    .column-list {
      flex: 1;
      border: 1px dashed #ccc;
      border-radius: 8px;
      padding: 4px;
      min-height: 200px;
      overflow-y: auto;
    }

    .column-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      margin: 4px 0;
      background: #f9f9f9;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      cursor: grab;
      font-size: 0.875rem;

      &:active {
        cursor: grabbing;
      }
    }

    .drag-handle {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #bbb;
    }

    .column-name {
      flex: 1;
    }

    .column-field {
      font-size: 0.75rem;
      color: #999;
    }

    .empty-hint {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #ccc;
      font-size: 0.85rem;
    }

    .cdk-drag-preview {
      background: #fff;
      border: 1px solid #DC3B75;
      border-radius: 4px;
      padding: 8px 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .cdk-drag-placeholder {
      opacity: 0.3;
    }
  `,
})
export class ColumnSelectionDialog {
  dialogRef = inject(MatDialogRef<ColumnSelectionDialog>);
  private columnConfig = inject(ColumnConfigService);

  included = signal<ColumnDefinition[]>([]);
  excluded = signal<ColumnDefinition[]>([]);

  constructor() {
    // Clone the current state
    this.included.set([...this.columnConfig.includedColumns()]);
    this.excluded.set([...this.columnConfig.excludedColumns()]);
  }

  onDrop(event: CdkDragDrop<ColumnDefinition[]>): void {
    const inc = [...this.included()];
    const exc = [...this.excluded()];

    const isIncludedSource = event.previousContainer.element.nativeElement.classList.contains('included-list');
    const isIncludedTarget = event.container.element.nativeElement.classList.contains('included-list');

    if (event.previousContainer === event.container) {
      const list = isIncludedTarget ? inc : exc;
      moveItemInArray(list, event.previousIndex, event.currentIndex);
    } else {
      const source = isIncludedSource ? inc : exc;
      const target = isIncludedTarget ? inc : exc;
      transferArrayItem(source, target, event.previousIndex, event.currentIndex);
    }

    this.included.set(inc);
    this.excluded.set(exc);
  }

  onApply(): void {
    const includedFields = this.included().map((col, index) => ({
      ...col,
      included: true,
      order: index,
    }));
    const excludedFields = this.excluded().map(col => ({
      ...col,
      included: false,
      order: 999,
    }));
    this.columnConfig.setColumns([...includedFields, ...excludedFields]);
    this.dialogRef.close();
  }

  onReset(): void {
    this.columnConfig.resetToDefaults();
    this.included.set([...this.columnConfig.includedColumns()]);
    this.excluded.set([...this.columnConfig.excludedColumns()]);
  }
}
