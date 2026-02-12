# Mandalay Report Builder

A UI prototype for a Report Builder application built for **AMCS Group**, designed for the **Mandalay** weighbridge and facility management product. Built with Angular 21 and Angular Material.

## Features

### Data Table
- Sortable, paginated table with sticky headers and resizable columns
- Loads a 1,000-row sample CSV dataset (Transactions view)
- Pagination options: 25, 50, or 100 rows per page

### Column Selection
- Two-panel drag-and-drop dialog to include/exclude columns
- Reorder columns by dragging within the included list
- Reset to default column configuration
- 12 default columns: TicketNumber, DateIn, DateOut, SiteName, LicencePlate, TotalExTax, Levy, Tax, TotalRevenue, ProductWeightTonnes, Quantity, UnitPrice

### Filtering
- Excel-style column filtering from header buttons
- Checkbox list of unique values per column with search
- Select All / Clear quick actions
- Multiple simultaneous filters with visual indicators

### Grouping
- Drag column headers to a group bar above the table
- Multi-level grouping support
- Expandable/collapsible group rows with aggregated numeric totals
- Reorder and remove groups via drag-and-drop chips

### Export
- Toolbar buttons for CSV, Excel, and PDF export (UI only — no file generation)

### Templates
- Save and load report templates (name, description, column config, filters, grouping)
- Delete saved templates
- Three pre-loaded mock templates
- In-memory storage only (no backend persistence)

### Permissions
- Administration page with a roles and permissions matrix
- Four mock roles: Administrator, Report Manager, Analyst, Viewer
- CRUD + Export + Manage Templates permissions across Reports, Templates, and Users

### Navigation
- Sidebar with five data views: Transactions, Products, Clients, Vehicles, Administration
- Transactions view is fully implemented; others show placeholder pages

## Tech Stack

- **Angular** 21.1 (standalone components, signals, lazy-loaded routes)
- **Angular Material** 21.1 (table, toolbar, sidenav, dialogs, menus, chips, drag-and-drop)
- **TypeScript** 5.9
- **SCSS** for component-scoped styles
- **Vitest** for unit testing

## Getting Started

### Prerequisites

- Node.js (v20+)
- npm

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
ng serve
```

Open [http://localhost:4200](http://localhost:4200) in your browser. The app reloads automatically on file changes.

### Build

```bash
ng build
```

Build artifacts are output to the `dist/` directory.

### Run Tests

```bash
ng test
```

## Project Structure

```
src/app/
├── features/
│   ├── report/
│   │   ├── report-page.ts              # Main report container
│   │   └── components/
│   │       ├── data-table/             # Table with sorting, grouping, pagination
│   │       ├── column-filter/          # Excel-style column filter dropdown
│   │       ├── group-bar/              # Drag-and-drop grouping bar
│   │       └── report-toolbar/         # Export, template, and column buttons
│   ├── column-selection/               # Column include/exclude dialog
│   ├── templates/                      # Save and load template dialogs
│   ├── administration/                 # Permissions page
│   └── placeholder/                    # Placeholder for unimplemented views
├── services/
│   ├── csv-data.service.ts             # CSV loading and parsing
│   ├── filter.service.ts               # Column filter state and logic
│   ├── grouping.service.ts             # Grouping state management
│   ├── column-config.service.ts        # Column selection and ordering
│   ├── template.service.ts             # Report template management
│   └── export.service.ts               # Export placeholders
└── models/
    ├── column-definition.model.ts
    ├── report-template.model.ts
    └── permission.model.ts
```
