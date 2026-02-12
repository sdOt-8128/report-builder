import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ExportService {
  private snackBar = inject(MatSnackBar);

  exportCsv(): void {
    this.snackBar.open('Exporting to CSV...', 'OK', { duration: 3000 });
  }

  exportExcel(): void {
    this.snackBar.open('Exporting to Excel...', 'OK', { duration: 3000 });
  }

  exportPdf(): void {
    this.snackBar.open('Exporting to PDF...', 'OK', { duration: 3000 });
  }
}
