import StudentAttendance from '#models/student_attendance'
import Student from '#models/student'
import { markStudentAttendanceValidator } from '#validators/student_attendance'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'

type Params = {
  schoolId: string
  userId: string
  data: Infer<typeof markStudentAttendanceValidator>
}

export default class MarkStudentAttendance {
  static async handle({ schoolId, userId, data }: Params) {
    // Verify student belongs to school
    const student = await Student.query()
      .where('id', data.studentId)
      .where('schoolId', schoolId)
      .first()

    if (!student) {
      throw new Error('Student not found or does not belong to this school')
    }

    // Verify date is not in the future
    const attendanceDate = DateTime.fromJSDate(data.date)
    if (attendanceDate > DateTime.now().startOf('day')) {
      throw new Error('Cannot mark attendance for future dates')
    }

    // Check if attendance already exists for this student and date
    const existingAttendance = await StudentAttendance.query()
      .where('schoolId', schoolId)
      .where('studentId', data.studentId)
      .whereRaw('date = ?', [attendanceDate.toISODate()!])
      .first()

    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.status = data.status
      existingAttendance.remarks = data.remarks ?? null
      existingAttendance.academicYearId = data.academicYearId
      existingAttendance.classId = data.classId ?? null
      existingAttendance.sectionId = data.sectionId ?? null
      existingAttendance.markedById = userId
      await existingAttendance.save()
      return existingAttendance
    }

    // Create new attendance record
    return StudentAttendance.create({
      schoolId,
      studentId: data.studentId,
      academicYearId: data.academicYearId,
      classId: data.classId ?? null,
      sectionId: data.sectionId ?? null,
      date: attendanceDate,
      status: data.status,
      remarks: data.remarks ?? null,
      markedById: userId,
    })
  }
}
