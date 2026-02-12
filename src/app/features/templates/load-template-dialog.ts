import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatList, MatListItem } from '@angular/material/list';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TemplateService } from '../../services/template.service';

@Component({
  selector: 'app-load-template-dialog',
  imports: [
    DatePipe,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatList,
    MatListItem,
    MatIconButton,
    MatButton,
    MatIcon,
  ],
  template: `
    <h2 mat-dialog-title>Load Report Template</h2>
    <mat-dialog-content>
      @if (templateService.templates().length === 0) {
        <div class="empty-state">
          <mat-icon>folder_off</mat-icon>
          <p>No saved templates yet.</p>
        </div>
      } @else {
        <mat-list>
          @for (template of templateService.templates(); track template.id) {
            <mat-list-item class="template-item">
              <div class="template-info" (click)="onLoad(template.id)">
                <span class="template-name">{{ template.name }}</span>
                <span class="template-desc">{{ template.description }}</span>
                <span class="template-date">Created: {{ template.createdAt | date }}</span>
              </div>
              <button mat-icon-button (click)="onDelete(template.id, template.name)" class="delete-btn">
                <mat-icon>delete</mat-icon>
              </button>
            </mat-list-item>
          }
        </mat-list>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Close</button>
    </mat-dialog-actions>
  `,
  styles: `
    .empty-state {
      text-align: center;
      padding: 32px;
      color: #999;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 8px;
      }
    }

    .template-item {
      cursor: pointer;
      height: auto !important;
      padding: 12px 0 !important;

      &:hover .template-info {
        color: #DC3B75;
      }
    }

    .template-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .template-name {
      font-weight: 500;
    }

    .template-desc {
      font-size: 0.85rem;
      color: #666;
    }

    .template-date {
      font-size: 0.75rem;
      color: #999;
    }

    .delete-btn {
      color: #999;

      &:hover {
        color: #e53935;
      }
    }
  `,
})
export class LoadTemplateDialog {
  dialogRef = inject(MatDialogRef<LoadTemplateDialog>);
  templateService = inject(TemplateService);
  private snackBar = inject(MatSnackBar);

  onLoad(id: string): void {
    const template = this.templateService.getById(id);
    if (template) {
      this.snackBar.open(`Loaded template: ${template.name}`, 'OK', { duration: 3000 });
      this.dialogRef.close(template);
    }
  }

  onDelete(id: string, name: string): void {
    this.templateService.delete(id);
    this.snackBar.open(`Deleted template: ${name}`, 'OK', { duration: 3000 });
  }
}
