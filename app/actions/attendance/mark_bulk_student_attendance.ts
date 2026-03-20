import StudentAttendance from '#models/student_attendance'
import Student from '#models/student'
import { bulkStudentAttendanceValidator } from '#validators/student_attendance'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

type Params = {
  schoolId: string
  userId: string
  data: Infer<typeof bulkStudentAttendanceValidator>
}

export default class MarkBulkStudentAttendance {
  static async handle({ schoolId, userId, data }: Params) {
    const attendanceDate = DateTime.fromJSDate(data.date)

    // Verify date is not in the future
    if (attendanceDate > DateTime.now().startOf('day')) {
      throw new Error('Cannot mark attendance for future dates')
    }

    // Get all student IDs from the request
    const studentIds = data.attendances.map((a) => a.studentId)

    // Verify all students belong to the school
    const students = await Student.query()
      .whereIn('id', studentIds)
      .where('schoolId', schoolId)
      .select('id')

    const validStudentIds = new Set(students.map((s) => s.id))
    const invalidStudents = studentIds.filter((id) => !validStudentIds.has(id))

    if (invalidStudents.length > 0) {
      throw new Error('Some students do not belong to this school')
    }

    return db.transaction(async (trx) => {
      const results = []

      for (const attendance of data.attendances) {
        // Check if attendance already exists for this student and date
        const existingAttendance = await StudentAttendance.query({ client: trx })
          .where('schoolId', schoolId)
          .where('studentId', attendance.studentId)
          .whereRaw('date = ?', [attendanceDate.toISODate()!])
          .first()

        if (existingAttendance) {
          // Update existing attendance
          existingAttendance.status = attendance.status
          existingAttendance.remarks = attendance.remarks ?? null
          existingAttendance.academicYearId = data.academicYearId
          existingAttendance.classId = data.classId
          existingAttendance.sectionId = data.sectionId ?? null
          existingAttendance.markedById = userId
          await existingAttendance.save()
          results.push(existingAttendance)
        } else {
          // Create new attendance record
          const newAttendance = await StudentAttendance.create(
            {
              schoolId,
              studentId: attendance.studentId,
              academicYearId: data.academicYearId,
              classId: data.classId,
              sectionId: data.sectionId ?? null,
              date: attendanceDate,
              status: attendance.status,
              remarks: attendance.remarks ?? null,
              markedById: userId,
            },
            { client: trx }
          )
          results.push(newAttendance)
        }
      }

      return results
    })
  }
}
