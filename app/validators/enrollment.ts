import vine from '@vinejs/vine'
import Enrollment from '#models/enrollment'

export const createEnrollmentValidator = vine.compile(
  vine.object({
    studentId: vine.string().uuid(),
    academicYearId: vine.string().uuid(),
    classId: vine.string().uuid(),
    sectionId: vine.string().uuid().optional(),
    rollNumber: vine.string().trim().maxLength(20).optional(),
    enrollmentDate: vine.date(),
  })
)

// Custom validation to check for duplicate enrollment
vine.messagesProvider = vine.messagesProvider || {
  getMessage(key: string) {
    return `${key} is invalid`
  },
}

export async function validateUniqueEnrollment(
  studentId: string,
  academicYearId: string
): Promise<boolean> {
  const existingEnrollment = await Enrollment.query()
    .where('studentId', studentId)
    .where('academicYearId', academicYearId)
    .first()

  return !existingEnrollment
}

export const updateEnrollmentValidator = vine.compile(
  vine.object({
    classId: vine.string().uuid().optional(),
    sectionId: vine.string().uuid().optional(),
    rollNumber: vine.string().trim().maxLength(20).optional(),
    status: vine.string().trim().maxLength(20).optional(),
  })
)
