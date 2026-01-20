
export enum TransactionType {
  INCOME = 'Einnahme',
  EXPENSE = 'Ausgabe'
}

export interface Transaction {
  id: string;
  date: string;
  desc: string;
  amount: number;
  type: TransactionType;
}

export interface Profile {
  id: string;
  name: string;
  taxId: string;
  responsible: string;
  taxRate: number;
  monthFilter: string;
  webhook1: string;
  webhook2: string;
  entries: Transaction[];
}

export interface User {
  username: string;
  display: string;
}

export interface AppState {
  activeProfileId: string;
  profiles: Record<string, Profile>;
}

export interface CalcResult {
  inc: number;
  exp: number;
  tax: number;
  net: number;
  filteredEntries: Transaction[];
}
