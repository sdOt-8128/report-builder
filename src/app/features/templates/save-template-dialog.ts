import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { TemplateService } from '../../services/template.service';

@Component({
  selector: 'app-save-template-dialog',
  imports: [
    FormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
  ],
  template: `
    <h2 mat-dialog-title>Save Report Template</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Template Name</mat-label>
        <input matInput [(ngModel)]="name" placeholder="e.g. Daily Summary" required />
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Description</mat-label>
        <textarea matInput [(ngModel)]="description" rows="3" placeholder="Optional description..."></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-button color="primary" [disabled]="!name.trim()" (click)="onSave()">Save</button>
    </mat-dialog-actions>
  `,
  styles: `
    .full-width {
      width: 100%;
    }

    mat-dialog-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
  `,
})
export class SaveTemplateDialog {
  dialogRef = inject(MatDialogRef<SaveTemplateDialog>);
  private templateService = inject(TemplateService);

  name = '';
  description = '';

  onSave(): void {
    if (this.name.trim()) {
      this.templateService.save(this.name.trim(), this.description.trim());
      this.dialogRef.close(true);
    }
  }
}
