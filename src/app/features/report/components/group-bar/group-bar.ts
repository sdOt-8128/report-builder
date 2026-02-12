import { Component, inject } from '@angular/core';
import { CdkDropList, CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatChipSet, MatChip, MatChipRemove } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { GroupingService } from '../../../../services/grouping.service';
import { ColumnConfigService } from '../../../../services/column-config.service';

@Component({
  selector: 'app-group-bar',
  imports: [CdkDropList, CdkDrag, MatChipSet, MatChip, MatChipRemove, MatIcon],
  template: `
    <div
      class="group-bar"
      cdkDropList
      cdkDropListOrientation="horizontal"
      [cdkDropListData]="groupingService.groupByColumns()"
      (cdkDropListDropped)="onDrop($event)"
      id="group-bar-list"
    >
      @if (groupingService.groupByColumns().length === 0) {
        <span class="group-hint">
          <mat-icon>drag_indicator</mat-icon>
          Drag column headers here to group
        </span>
      } @else {
        <mat-chip-set>
          @for (field of groupingService.groupByColumns(); track field) {
            <mat-chip cdkDrag [cdkDragData]="field">
              {{ columnConfig.getDisplayName(field) }}
              <button matChipRemove (click)="groupingService.removeGroup(field)">
                <mat-icon>cancel</mat-icon>
              </button>
            </mat-chip>
          }
        </mat-chip-set>
      }
    </div>
  `,
  styles: `
    .group-bar {
      display: flex;
      align-items: center;
      min-height: 44px;
      padding: 4px 16px;
      background-color: #ffffff;
      border-left: 1px solid #e0e0e0;
      border-right: 1px solid #e0e0e0;
    }

    .group-hint {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #999;
      font-size: 0.85rem;

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }
  `,
})
export class GroupBarComponent {
  groupingService = inject(GroupingService);
  columnConfig = inject(ColumnConfigService);

  onDrop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      // Reorder within group bar
      const fields = [...this.groupingService.groupByColumns()];
      const [moved] = fields.splice(event.previousIndex, 1);
      fields.splice(event.currentIndex, 0, moved);
      this.groupingService.reorderGroups(fields);
    } else {
      // Add new column from drag
      const field = event.item.data as string;
      this.groupingService.addGroup(field);
    }
  }
}
