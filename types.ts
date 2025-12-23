
export enum AnimalType {
  PORK = 'CERDO',
  BEEF = 'RES'
}

export interface CutDefinition {
  name: string;
  percentage: number; // Percentage of total weight
  unitPrice: number;
}

export interface CutInventory {
  id: string;
  name: string;
  type: AnimalType;
  totalWeight: number;
  availableWeight: number;
  unitPrice: number;
}

export interface AnimalBatch {
  id: string;
  type: AnimalType;
  initialWeight: number;
  date: Date;
  cuts: CutInventory[];
}

export interface SaleItem {
  cutId: string;
  name: string;
  weight: number;
  price: number;
}

export interface SaleOrder {
  id: string;
  customerName: string;
  date: Date;
  items: SaleItem[];
  total: number;
}

export type View = 'dashboard' | 'inventory' | 'register-animal' | 'new-order' | 'sales-history';
