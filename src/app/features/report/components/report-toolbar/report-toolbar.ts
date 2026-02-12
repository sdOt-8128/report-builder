import { Component, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatMenu, MatMenuTrigger, MatMenuItem } from '@angular/material/menu';
import { ExportService } from '../../../../services/export.service';

@Component({
  selector: 'app-report-toolbar',
  imports: [MatButton, MatIconButton, MatIcon, MatTooltip, MatDivider, MatMenu, MatMenuTrigger, MatMenuItem],
  template: `
    <div class="report-toolbar">
      <div class="toolbar-group">
        <button mat-button (click)="openColumnSelection()" matTooltip="Select columns">
          <mat-icon>view_column</mat-icon>
          Columns
        </button>
      </div>

      <mat-divider vertical />

      <div class="toolbar-group">
        <button mat-icon-button (click)="exportService.exportCsv()" matTooltip="Export to CSV">
          <mat-icon>description</mat-icon>
        </button>
        <button mat-icon-button (click)="exportService.exportExcel()" matTooltip="Export to Excel">
          <mat-icon>table_chart</mat-icon>
        </button>
        <button mat-icon-button (click)="exportService.exportPdf()" matTooltip="Export to PDF">
          <mat-icon>picture_as_pdf</mat-icon>
        </button>
      </div>

      <mat-divider vertical />

      <div class="toolbar-group">
        <button mat-button (click)="openSaveTemplate()" matTooltip="Save report template">
          <mat-icon>save</mat-icon>
          Save
        </button>
        <button mat-button (click)="openLoadTemplate()" matTooltip="Load report template">
          <mat-icon>folder_open</mat-icon>
          Load
        </button>
      </div>

      <span class="spacer"></span>

      <div class="toolbar-group">
        <button mat-button [matMenuTriggerFor]="templatesMenu">
          <mat-icon>assignment</mat-icon>
          Templates
          <mat-icon class="dropdown-arrow">arrow_drop_down</mat-icon>
        </button>
        <mat-menu #templatesMenu="matMenu">
          <button mat-menu-item>
            <mat-icon>description</mat-icon>
            <span>Client Details Data Export</span>
          </button>
          <button mat-menu-item>
            <mat-icon>description</mat-icon>
            <span>Product Sales MTS</span>
          </button>
          <button mat-menu-item>
            <mat-icon>description</mat-icon>
            <span>Ticket Details CSW</span>
          </button>
          <button mat-menu-item>
            <mat-icon>description</mat-icon>
            <span>Vehicle Tares</span>
          </button>
        </mat-menu>
      </div>
    </div>
  `,
  styles: `
    .report-toolbar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 8px 8px 0 0;
    }

    .toolbar-group {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .dropdown-arrow {
      margin-left: -4px;
    }

    mat-divider {
      height: 28px;
    }
  `,
})
export class ReportToolbarComponent {
  exportService = inject(ExportService);
  private dialog = inject(MatDialog);

  openColumnSelection(): void {
    import('../../../column-selection/column-selection-dialog').then(m => {
      this.dialog.open(m.ColumnSelectionDialog, {
        width: '90vw',
        maxWidth: '1000px',
        maxHeight: '80vh',
      });
    });
  }

  openSaveTemplate(): void {
    import('../../../templates/save-template-dialog').then(m => {
      this.dialog.open(m.SaveTemplateDialog, {
        width: '450px',
      });
    });
  }

  openLoadTemplate(): void {
    import('../../../templates/load-template-dialog').then(m => {
      this.dialog.open(m.LoadTemplateDialog, {
        width: '500px',
        maxHeight: '70vh',
      });
    });
  }
}
