export type ChartOfAccount = {
  id: string
  accountCode: string
  name: string
  accountType: string
  normalBalance: string
  currentBalance: number
  isActive: boolean
  isSystem: boolean
}

export type ParentAccount = {
  id: string
  accountCode: string
  name: string
}

export type ExpenseCategory = {
  id: string
  name: string
}

export type Expense = {
  id: string
  expenseNumber: string
  expenseDate: string
  description: string | null
  amount: number
  vendorName: string | null
  status: 'pending' | 'approved' | 'rejected' | 'paid'
  category: { id: string; name: string } | null
}

export type ExpenseFilters = {
  status: string | null
  categoryId: string | null
  startDate: string | null
  endDate: string | null
}

export type PaginatedExpenses = {
  data: Expense[]
  meta: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}

export type IncomeStatementRow = {
  accountId: string
  accountCode: string
  accountName: string
  amount: number
}

export type IncomeStatementReport = {
  startDate: string
  endDate: string
  incomeAccounts: IncomeStatementRow[]
  expenseAccounts: IncomeStatementRow[]
  totalIncome: number
  totalExpenses: number
  netIncome: number
}

export type TrialBalanceRow = {
  accountId: string
  accountCode: string
  accountName: string
  accountType: string
  debitBalance: number
  creditBalance: number
}

export type TrialBalanceReport = {
  asOfDate: string
  rows: TrialBalanceRow[]
  totalDebit: number
  totalCredit: number
  isBalanced: boolean
}

export type BalanceSheetRow = {
  accountId: string
  accountCode: string
  accountName: string
  amount: number
}

export type BalanceSheetReport = {
  asOfDate: string
  assets: BalanceSheetRow[]
  liabilities: BalanceSheetRow[]
  equity: BalanceSheetRow[]
  totalAssets: number
  totalLiabilities: number
  totalEquity: number
  retainedEarnings: number
  isBalanced: boolean
}
