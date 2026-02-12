import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'report/transactions',
    pathMatch: 'full',
  },
  {
    path: 'report/transactions',
    loadComponent: () =>
      import('./features/report/report-page').then(m => m.ReportPage),
    data: { view: 'Transactions' },
  },
  {
    path: 'report/products',
    loadComponent: () =>
      import('./features/placeholder/placeholder-page').then(m => m.PlaceholderPage),
    data: { view: 'Products' },
  },
  {
    path: 'report/clients',
    loadComponent: () =>
      import('./features/placeholder/placeholder-page').then(m => m.PlaceholderPage),
    data: { view: 'Clients' },
  },
  {
    path: 'report/vehicles',
    loadComponent: () =>
      import('./features/placeholder/placeholder-page').then(m => m.PlaceholderPage),
    data: { view: 'Vehicles' },
  },
  {
    path: 'administration',
    loadComponent: () =>
      import('./features/administration/permissions-page').then(m => m.PermissionsPage),
    data: { view: 'Administration' },
  },
];
