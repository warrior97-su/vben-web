export interface Menu {
  id?: number;
  name: string;
  path: string;
  component?: string;
  icon?: string;
  pid: number;
  sort: number;
  children?: Menu[];
}

export interface MenuCreate {
  name: string;
  path: string;
  component?: string;
  icon?: string;
  pid: number;
  sort: number;
  title?: string;
}

export interface MenuUpdate {
  id: number;
  name: string;
  path: string;
  component?: string;
  icon?: string;
  sort: number;
  title?: string;
}
