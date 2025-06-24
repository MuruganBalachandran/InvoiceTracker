export interface User {
  id: string;
  email: string;
  name: string;
  isAuthenticated: boolean;
  loading?: boolean;
  error?: string | null;
  monthlySalary?: number;
  salaryAllocation?: SalaryAllocation;
}

export interface Client {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  _id?: string;
  clientId: string;
  clientName: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  createdAt: string;
}

export interface Expense {
  id: string;
  _id?: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
}

export interface ExpenseCategory {
  name: string;
  color: string;
  total: number;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

export interface RootState {
  user: User;
  invoices: {
    invoices: Invoice[];
    clients: Client[];
  };
  expenses: {
    expenses: Expense[];
    monthlySalary: number;
  };
  theme: 'light' | 'dark';
}

export interface SalaryAllocation {
  needs: number; // 0-100
  wants: number; // 0-100
  savings: number; // 0-100
}