export type FeeCategory = {
  id: string
  name: string
  code: string | null
  description: string | null
  isMandatory: boolean
  isActive: boolean
  displayOrder: number
}

export type FeeChallanItem = {
  id: string
  amount: number
  discountAmount: number
  netAmount: number
  feeCategory: { name: string } | null
}

export type FeePayment = {
  id: string
  receiptNumber: string
  amount: number
  paymentMethod: string
  paymentDate: string
}

export type FeeChallanStudent = {
  id: string
  studentId: string
  firstName: string
  lastName: string | null
}

export type FeeLedgerSummary = {
  totalFees: number
  totalDiscounts: number
  totalLateFees: number
  totalPayable: number
  totalPaid: number
  totalBalance: number
  overdueMonths: number
  isDefaulter: boolean
}

export type FeeCollectionPayment = {
  id: string
  receiptNumber: string
  amount: number
  paymentMethod: string
  paymentDate: string
  student: { firstName: string; lastName: string | null; studentId: string } | null
}

export type FeeCollectionSummary = {
  totalCollected: number
  totalTransactions: number
  totalOutstanding: number
  byPaymentMethod: Record<string, { count: number; amount: number }>
}

export type FeeCollectionGroupedItem = {
  label: string
  count: number
  amount: number
}

export type FeeCollectionFilters = {
  academicYearId: string
  classId: string
  startDate: string
  endDate: string
  groupBy: string
}

export type FeeDefaulter = {
  student: FeeChallanStudent
  className: string
  sectionName: string | null
  totalDue: number
  overdueMonths: number
  lastPaymentDate: string | null
}

export type FeeDefaultersSummary = {
  totalDefaulters: number
  totalOutstanding: number
  avgOverdueMonths: number
  byClass: Record<string, { count: number; amount: number }>
}

export type FeeDefaultersFilters = {
  academicYearId: string
  classId: string
  minOverdueMonths: number
}

export type FeeChallan = {
  id: string
  challanNumber: string
  period: string
  issueDate: string
  dueDate: string
  totalAmount: number
  discountAmount: number
  lateFeeAmount: number
  netAmount: number
  paidAmount: number
  balanceAmount: number
  status: string
  remarks?: string | null
  student: FeeChallanStudent | null
  items?: FeeChallanItem[]
  payments?: FeePayment[]
}
