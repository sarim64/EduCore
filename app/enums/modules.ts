enum Modules {
  ACADEMICS = 'academics',
  STUDENTS = 'students',
  STAFF = 'staff',
  ATTENDANCE = 'attendance',
  FEES = 'fees',
  REPORTS = 'reports',
}

export default Modules

// Plans that include each module — kept as string literals to avoid circular imports
// with subscription_plans.ts (which imports Modules)
export type ModulePlan = 'trial' | 'basic' | 'pro'

export const MODULE_METADATA: Record<
  Modules,
  {
    name: string
    description: string
    icon: string
    includedInPlans: ModulePlan[]
    displayOrder: number
    dependencies: Modules[]
  }
> = {
  [Modules.ACADEMICS]: {
    name: 'Academic Structure',
    description: 'Academic years, classes, sections, and subjects management',
    icon: 'GraduationCap',
    includedInPlans: ['trial', 'basic'],
    displayOrder: 1,
    dependencies: [],
  },
  [Modules.STUDENTS]: {
    name: 'Student Management',
    description: 'Student registration, enrollment, guardians, and documents',
    icon: 'Users',
    includedInPlans: ['trial', 'basic'],
    displayOrder: 2,
    dependencies: [],
  },
  [Modules.STAFF]: {
    name: 'Staff & HR',
    description: 'Departments, designations, staff profiles, and qualifications',
    icon: 'Briefcase',
    includedInPlans: ['trial', 'basic'],
    displayOrder: 3,
    dependencies: [],
  },
  [Modules.ATTENDANCE]: {
    name: 'Attendance',
    description: 'Student and staff attendance tracking, leave management',
    icon: 'ClipboardCheck',
    includedInPlans: ['trial', 'basic'],
    displayOrder: 4,
    dependencies: [],
  },
  [Modules.FEES]: {
    name: 'Fee Management',
    description: 'Fee structures, challans, payments, discounts, and student ledger',
    icon: 'Receipt',
    includedInPlans: ['trial', 'basic'],
    displayOrder: 5,
    dependencies: [],
  },
  [Modules.REPORTS]: {
    name: 'Reports',
    description: 'Enrollment, attendance, and staff directory reports',
    icon: 'BarChart3',
    includedInPlans: ['trial', 'basic'],
    displayOrder: 6,
    dependencies: [],
  },
}
