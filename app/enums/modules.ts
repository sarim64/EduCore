enum Modules {
  ACADEMICS = 'academics',
  STUDENTS = 'students',
  STAFF = 'staff',
  ATTENDANCE = 'attendance',
  FEES = 'fees',
  REPORTS = 'reports',
}

export default Modules

export const MODULE_METADATA: Record<
  Modules,
  {
    name: string
    description: string
    icon: string
    isBasic: boolean
    displayOrder: number
    dependencies: Modules[]
  }
> = {
  [Modules.ACADEMICS]: {
    name: 'Academic Structure',
    description: 'Academic years, classes, sections, and subjects management',
    icon: 'GraduationCap',
    isBasic: true,
    displayOrder: 1,
    dependencies: [],
  },
  [Modules.STUDENTS]: {
    name: 'Student Management',
    description: 'Student registration, enrollment, guardians, and documents',
    icon: 'Users',
    isBasic: true,
    displayOrder: 2,
    dependencies: [],
  },
  [Modules.STAFF]: {
    name: 'Staff & HR',
    description: 'Departments, designations, staff profiles, and qualifications',
    icon: 'Briefcase',
    isBasic: true,
    displayOrder: 3,
    dependencies: [],
  },
  [Modules.ATTENDANCE]: {
    name: 'Attendance',
    description: 'Student and staff attendance tracking, leave management',
    icon: 'ClipboardCheck',
    isBasic: true,
    displayOrder: 4,
    dependencies: [],
  },
  [Modules.FEES]: {
    name: 'Fee Management',
    description: 'Fee structures, challans, payments, discounts, and student ledger',
    icon: 'Receipt',
    isBasic: true,
    displayOrder: 5,
    dependencies: [],
  },
  [Modules.REPORTS]: {
    name: 'Reports',
    description: 'Enrollment, attendance, and staff directory reports',
    icon: 'BarChart3',
    isBasic: true,
    displayOrder: 6,
    dependencies: [],
  },
}
