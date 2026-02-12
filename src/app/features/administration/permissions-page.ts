import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Role } from '../../models/permission.model';

const MOCK_ROLES: Role[] = [
  {
    id: '1',
    name: 'Administrator',
    description: 'Full access to all Report Builder features',
    permissions: [
      { resource: 'Reports', create: true, read: true, update: true, delete: true, export: true, manageTemplates: true },
      { resource: 'Templates', create: true, read: true, update: true, delete: true, export: true, manageTemplates: true },
      { resource: 'Users', create: true, read: true, update: true, delete: true, export: false, manageTemplates: false },
    ],
  },
  {
    id: '2',
    name: 'Report Manager',
    description: 'Can create and manage reports and templates',
    permissions: [
      { resource: 'Reports', create: true, read: true, update: true, delete: false, export: true, manageTemplates: true },
      { resource: 'Templates', create: true, read: true, update: true, delete: false, export: true, manageTemplates: true },
      { resource: 'Users', create: false, read: true, update: false, delete: false, export: false, manageTemplates: false },
    ],
  },
  {
    id: '3',
    name: 'Analyst',
    description: 'Can view and export reports using existing templates',
    permissions: [
      { resource: 'Reports', create: false, read: true, update: false, delete: false, export: true, manageTemplates: false },
      { resource: 'Templates', create: false, read: true, update: false, delete: false, export: false, manageTemplates: false },
      { resource: 'Users', create: false, read: false, update: false, delete: false, export: false, manageTemplates: false },
    ],
  },
  {
    id: '4',
    name: 'Viewer',
    description: 'Read-only access to reports',
    permissions: [
      { resource: 'Reports', create: false, read: true, update: false, delete: false, export: false, manageTemplates: false },
      { resource: 'Templates', create: false, read: true, update: false, delete: false, export: false, manageTemplates: false },
      { resource: 'Users', create: false, read: false, update: false, delete: false, export: false, manageTemplates: false },
    ],
  },
];

@Component({
  selector: 'app-permissions-page',
  imports: [
    FormsModule,
    MatTableModule,
    MatCheckbox,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatIcon,
  ],
  template: `
    <div class="permissions-page">
      <h2 class="page-title">
        <mat-icon>admin_panel_settings</mat-icon>
        Permissions Management
      </h2>

      @for (role of roles(); track role.id) {
        <mat-card class="role-card">
          <mat-card-header>
            <mat-card-title>{{ role.name }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p class="role-description">{{ role.description }}</p>
            <table mat-table [dataSource]="role.permissions" class="permissions-table">
              <ng-container matColumnDef="resource">
                <th mat-header-cell *matHeaderCellDef>Resource</th>
                <td mat-cell *matCellDef="let perm">{{ perm.resource }}</td>
              </ng-container>

              <ng-container matColumnDef="create">
                <th mat-header-cell *matHeaderCellDef>Create</th>
                <td mat-cell *matCellDef="let perm">
                  <mat-checkbox [checked]="perm.create" disabled />
                </td>
              </ng-container>

              <ng-container matColumnDef="read">
                <th mat-header-cell *matHeaderCellDef>Read</th>
                <td mat-cell *matCellDef="let perm">
                  <mat-checkbox [checked]="perm.read" disabled />
                </td>
              </ng-container>

              <ng-container matColumnDef="update">
                <th mat-header-cell *matHeaderCellDef>Update</th>
                <td mat-cell *matCellDef="let perm">
                  <mat-checkbox [checked]="perm.update" disabled />
                </td>
              </ng-container>

              <ng-container matColumnDef="delete">
                <th mat-header-cell *matHeaderCellDef>Delete</th>
                <td mat-cell *matCellDef="let perm">
                  <mat-checkbox [checked]="perm.delete" disabled />
                </td>
              </ng-container>

              <ng-container matColumnDef="export">
                <th mat-header-cell *matHeaderCellDef>Export</th>
                <td mat-cell *matCellDef="let perm">
                  <mat-checkbox [checked]="perm.export" disabled />
                </td>
              </ng-container>

              <ng-container matColumnDef="manageTemplates">
                <th mat-header-cell *matHeaderCellDef>Templates</th>
                <td mat-cell *matCellDef="let perm">
                  <mat-checkbox [checked]="perm.manageTemplates" disabled />
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="permissionColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: permissionColumns"></tr>
            </table>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: `
    .permissions-page {
      max-width: 900px;
    }

    .page-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 24px;
      color: #131619;

      mat-icon {
        color: #DC3B75;
      }
    }

    .role-card {
      margin-bottom: 16px;
    }

    .role-description {
      color: #666;
      font-size: 0.875rem;
      margin: 0 0 16px;
    }

    .permissions-table {
      width: 100%;
    }

    th {
      font-weight: 500;
    }
  `,
})
export class PermissionsPage {
  roles = signal(MOCK_ROLES);
  permissionColumns = ['resource', 'create', 'read', 'update', 'delete', 'export', 'manageTemplates'];
}
