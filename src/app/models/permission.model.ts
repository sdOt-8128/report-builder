export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface Permission {
  resource: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  export: boolean;
  manageTemplates: boolean;
}
