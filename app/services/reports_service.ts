import Staff from '#models/staff_member'
import SchoolClass from '#models/school_class'
import Enrollment from '#models/enrollment'
import AcademicYear from '#models/academic_year'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export interface EnrollmentReportData {
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

export interface StaffDirectoryData {
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

export default class ReportsService {
  static async getEnrollmentReport(
    schoolId: string,
    academicYearId?: string
  ): Promise<EnrollmentReportData> {
    // Get academic year
    let academicYear: AcademicYear | null
    if (academicYearId) {
      academicYear = await AcademicYear.find(academicYearId)
    } else {
      academicYear = await AcademicYear.query()
        .where('schoolId', schoolId)
        .where('isCurrent', true)
        .first()
    }

    if (!academicYear) {
      return {
        academicYear: 'No Academic Year',
        generatedAt: DateTime.now().toISO()!,
        summary: {
          totalClasses: 0,
          totalSections: 0,
          totalEnrollments: 0,
          totalCapacity: 0,
          utilizationRate: 0,
        },
        classes: [],
        genderDistribution: [],
      }
    }

    // Get classes with sections
    const classes = await SchoolClass.query()
      .where('schoolId', schoolId)
      .preload('sections')
      .orderBy('displayOrder')

    const classData: EnrollmentReportData['classes'] = []
    let totalEnrollments = 0
    let totalCapacity = 0
    let totalSections = 0

    for (const schoolClass of classes) {
      const classSections: EnrollmentReportData['classes'][0]['sections'] = []
      let classEnrolled = 0
      let classCapacity = 0

      for (const section of schoolClass.sections) {
        totalSections++
        const sectionCapacity = section.capacity || 0
        classCapacity += sectionCapacity
        totalCapacity += sectionCapacity

        // Get enrollments for this section
        const enrollments = await Enrollment.query()
          .where('schoolId', schoolId)
          .where('academicYearId', academicYear.id)
          .where('classId', schoolClass.id)
          .where('sectionId', section.id)
          .where('status', 'active')
          .preload('student')
          .orderBy('rollNumber')

        const sectionEnrolled = enrollments.length
        classEnrolled += sectionEnrolled
        totalEnrollments += sectionEnrolled

        classSections.push({
          sectionId: section.id,
          sectionName: section.name,
          capacity: sectionCapacity,
          enrolled: sectionEnrolled,
          available: Math.max(0, sectionCapacity - sectionEnrolled),
          utilizationRate:
            sectionCapacity > 0 ? Math.round((sectionEnrolled / sectionCapacity) * 100) : 0,
          students: enrollments.map((e) => ({
            studentId: e.student.id,
            studentNumber: e.student.studentId,
            name: e.student.fullName,
            gender: e.student.gender,
            rollNumber: e.rollNumber,
            enrollmentDate: e.enrollmentDate?.toISODate() || '',
          })),
        })
      }

      classData.push({
        classId: schoolClass.id,
        className: schoolClass.name,
        sections: classSections,
        totalEnrolled: classEnrolled,
        totalCapacity: classCapacity,
      })
    }

    // Gender distribution
    const genderData = await db
      .from('enrollments')
      .join('students', 'enrollments.student_id', 'students.id')
      .where('enrollments.school_id', schoolId)
      .where('enrollments.academic_year_id', academicYear.id)
      .where('enrollments.status', 'active')
      .select('students.gender')
      .count('* as count')
      .groupBy('students.gender')

    const totalForGender = genderData.reduce((sum, g) => sum + Number(g.count), 0)
    const genderDistribution = genderData.map((g) => ({
      gender: g.gender || 'Not Specified',
      count: Number(g.count),
      percentage: totalForGender > 0 ? Math.round((Number(g.count) / totalForGender) * 100) : 0,
    }))

    return {
      academicYear: academicYear.name,
      generatedAt: DateTime.now().toISO()!,
      summary: {
        totalClasses: classes.length,
        totalSections,
        totalEnrollments,
        totalCapacity,
        utilizationRate:
          totalCapacity > 0 ? Math.round((totalEnrollments / totalCapacity) * 100) : 0,
      },
      classes: classData,
      genderDistribution,
    }
  }

  static async getStaffDirectory(schoolId: string): Promise<StaffDirectoryData> {
    // Get all staff with departments and designations
    const staff = await Staff.query()
      .where('schoolId', schoolId)
      .preload('department')
      .preload('designation')
      .orderBy('firstName')

    // Group by department
    const departmentMap = new Map<string | null, Staff[]>()
    staff.forEach((s) => {
      const deptId = s.departmentId
      if (!departmentMap.has(deptId)) {
        departmentMap.set(deptId, [])
      }
      departmentMap.get(deptId)!.push(s)
    })

    const departments: StaffDirectoryData['departments'] = []
    const uniqueDesignations = new Set<string>()

    for (const [deptId, deptStaff] of departmentMap) {
      const deptName = deptStaff[0]?.department?.name || 'Unassigned'

      departments.push({
        departmentId: deptId,
        departmentName: deptName,
        staff: deptStaff.map((s) => {
          if (s.designation?.name) {
            uniqueDesignations.add(s.designation.name)
          }
          return {
            staffMemberId: s.id,
            staffNumber: s.staffMemberId,
            name: s.fullName,
            designation: s.designation?.name || null,
            email: s.email,
            phone: s.phone,
            joiningDate: s.joiningDate?.toISODate() || null,
            status: s.status,
          }
        }),
        count: deptStaff.length,
      })
    }

    // Sort departments alphabetically, but put "Unassigned" last
    departments.sort((a, b) => {
      if (a.departmentName === 'Unassigned') return 1
      if (b.departmentName === 'Unassigned') return -1
      return a.departmentName.localeCompare(b.departmentName)
    })

    const activeStaff = staff.filter((s) => s.status === 'active').length

    return {
      generatedAt: DateTime.now().toISO()!,
      summary: {
        totalStaff: staff.length,
        activeStaff,
        departments: departmentMap.size,
        designations: uniqueDesignations.size,
      },
      departments,
    }
  }

}
