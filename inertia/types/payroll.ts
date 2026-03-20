export type SalaryComponent = {
  id: string
  name: string
  type: 'earning' | 'deduction'
  description: string | null
  isTaxable: boolean
  isActive: boolean
}

export type SalaryStructure = {
  id: string
  staffMemberId: string
  salaryComponentId: string
  amount: number
  isActive: boolean
  salaryComponent: SalaryComponent
}

export type PayslipItem = {
  id: string
  componentName: string
  componentType: 'earning' | 'deduction'
  amount: number
}

export type PayslipStaff = {
  id: string
  firstName: string
  lastName: string | null
  fullName: string
  staffMemberId: string
  email?: string | null
  phone?: string | null
  departmentId?: string | null
  designationId?: string | null
}

export type PayslipSchool = {
  name: string
  address: string | null
  phone: string | null
}

export type Payslip = {
  id: string
  payrollRunId?: string
  payslipNumber: string
  month?: number
  year?: number
  totalEarnings: number
  totalDeductions: number
  netPay: number
  workingDays: number
  daysPresent: number
  daysAbsent: number
  leaveDays: number
  attendanceDeduction: number
  status: 'generated' | 'paid' | 'cancelled'
  staff: PayslipStaff
  items: PayslipItem[]
}

export type PayrollRun = {
  id: string
  month?: number
  year?: number
  periodName: string
  status: string
  runDate: string | null
  notes?: string | null
  totalEarnings: number
  totalDeductions: number
  totalNetPay: number
  staffMemberCount: number
}
