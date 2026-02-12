# Report Builder Specifications

## Overview

The project is to build a **UI prototype** for a Report Builder application, demonstrating how it might look and navigate. It does not need to be connected to a back end — functionality like saving reports is not required, only the UI elements (buttons, modals, menus, etc.).

## Branding

This project is for AMCS Group in the waste management industry, and for the Mandalay product which is weighbridge software plus everything required to manage their facility.
The colour theme includes: #DC3B75, #F5F5F5, #131619 and small amounts of a dark green for the waste product. Please use a light mode colour theme not dark.
This will be for professional use by our clients some of which are large corporations, business themed.

## Data Views

The Report Builder will connect to the following views:

- **Transactions**
- **Products**
- **Clients**
- **Vehicles**
- **Administration**

> For this UI prototype, a small sample dataset of **1,000 rows** will be provided for the **Transactions** view.

## Editor & Default Columns

When a user opens the Report Builder, the Transactions view will display in the editor with the following default columns:

| Column Field                                | Display Name   |
| ------------------------------------------- | -------------- |
| TicketNumber                                | TicketNumber   |
| DateIn                                      | DateIn         |
| DateOut                                     | DateOut        |
| SiteName                                    | SiteName       |
| LicencePlate                                | LicencePlate   |
| TotalExTax                                  | TotalExTax     |
| Transaction_Levy                            | Levy           |
| Transaction_Tax                             | Tax            |
| Total_Transaction_Price_Inc_Levy_Inc_Tax    | TotalRevenue   |
| ProductWeightTonnes                         | ProductWeightTonnes |
| Quantity                                    | Quantity       |
| Unit_Price_Ex_Tax                           | Unit_Price_Ex_Tax |

## Column Selection

- Users can select additional columns to include in the report.
- Presented as **two side-by-side lists**: *Included* and *Excluded*.
- Columns can be moved between lists via **drag and drop**.

## Filtering

- Column-level filtering from the **column headers**, similar to Excel-style filtering.

## Column Ordering / Sorting

- Users can reorder columns by:
  - Assigning a sort number, **or**
  - Dragging and dropping within the column selection list.

## Grouping

- Users can **group by columns** by dragging a column header to a designated area above the column headers (a "group bar").
- **Multiple grouping** levels should be supported.

## Export

Buttons are required for exporting the report to:

- **CSV**
- **Excel**
- **PDF**

## Save & Load Templates

- **Save**: A modal allowing the user to save a report with a *name* and *description*.
- **Load**: A list of saved report templates that can be loaded into the Report Builder.
- **Delete**: Ability to delete saved templates.

> Since there is no back end, these will be **UI-only** (menus and modals without actual persistence).

## Permissions

- A menu for managing **permissions**.
- Includes **roles** and **levels of permission** for users.
