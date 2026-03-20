export type EnrollmentReportData = {
  academicYear: string
  generatedAt: string
  summary: {
    totalClasses: number
    totalSections: number
    totalEnrollments: number
    totalCapacity: number
    utilizationRate: number
  }
  classes: {
    classId: string
    className: string
    sections: {
      sectionId: string
      sectionName: string
      capacity: number
      enrolled: number
      available: number
      utilizationRate: number
      students: {
        studentId: string
        studentNumber: string
        name: string
        gender: string | null
        rollNumber: string | null
        enrollmentDate: string
      }[]
    }[]
    totalEnrolled: number
    totalCapacity: number
  }[]
  genderDistribution: {
    gender: string
    count: number
    percentage: number
  }[]
}

export type IncomeExpenseSummaryData = {
  period: {
    startDate: string
    endDate: string
  }
  generatedAt: string
  income: {
    total: number
    byCategory: { category: string; amount: number }[]
  }
  expenses: {
    total: number
    byCategory: { category: string; amount: number }[]
    byStatus: { status: string; amount: number; count: number }[]
  }
  netIncome: number
  monthlyTrend: {
    month: string
    income: number
    expenses: number
    net: number
  }[]
}

export type StaffDirectoryData = {
  generatedAt: string
  summary: {
    totalStaff: number
    activeStaff: number
    departments: number
    designations: number
  }
  departments: {
    departmentId: string | null
    departmentName: string
    staff: {
      staffMemberId: string
      staffNumber: string
      name: string
      designation: string | null
      email: string | null
      phone: string | null
      joiningDate: string | null
      status: string
    }[]
    count: number
  }[]
}
