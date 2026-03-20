import School from '#models/school'
import SuperAdmin from '#models/super_admin'
import Student from '#models/student'
import Enrollment from '#models/enrollment'
import db from '@adonisjs/lucid/services/db'

export default class GetAdminDashboardStats {
  static async handle() {
    const [schoolsCount, superAdminsCount, totalStudents, totalEnrollments] = await Promise.all([
      School.query().count('* as total'),
      SuperAdmin.query().whereNull('revokedAt').count('* as total'),
      Student.query().count('* as total'),
      Enrollment.query().where('status', 'active').count('* as total'),
    ])

    // Get schools with student and enrollment counts
    const schools = await db
      .from('schools')
      .leftJoin('students', 'schools.id', 'students.school_id')
      .leftJoin('enrollments', (join) => {
        join
          .on('schools.id', '=', 'enrollments.school_id')
          .andOnVal('enrollments.status', '=', 'active')
      })
      .select('schools.id', 'schools.name')
      .countDistinct('students.id as students_count')
      .countDistinct('enrollments.id as enrollments_count')
      .groupBy('schools.id', 'schools.name')
      .orderBy('schools.name')

    return {
      stats: {
        schoolsCount: Number(schoolsCount[0].$extras.total),
        superAdminsCount: Number(superAdminsCount[0].$extras.total),
        totalStudents: Number(totalStudents[0].$extras.total),
        totalEnrollments: Number(totalEnrollments[0].$extras.total),
      },
      schools: schools.map((s) => ({
        id: s.id,
        name: s.name,
        studentsCount: Number(s.students_count),
        enrollmentsCount: Number(s.enrollments_count),
      })),
    }
  }
}
