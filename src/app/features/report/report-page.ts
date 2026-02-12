import { Component } from '@angular/core';
import { ReportToolbarComponent } from './components/report-toolbar/report-toolbar';
import { GroupBarComponent } from './components/group-bar/group-bar';
import { DataTableComponent } from './components/data-table/data-table';

@Component({
  selector: 'app-report-page',
  imports: [ReportToolbarComponent, GroupBarComponent, DataTableComponent],
  template: `
    <div class="report-page">
      <app-report-toolbar />
      <app-group-bar />
      <app-data-table />
    </div>
  `,
  styles: `
    .report-page {
      display: flex;
      flex-direction: column;
      gap: 0;
      height: 100%;
    }
  `,
})
export class ReportPage {}
