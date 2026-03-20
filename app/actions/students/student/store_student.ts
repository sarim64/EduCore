import Student from '#models/student'
import School from '#models/school'
import { createStudentValidator } from '#validators/student'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import SubscriptionLimitService from '#services/subscription_limit_service'

type Params = {
  schoolId: string
  data: Infer<typeof createStudentValidator>
}

export default class StoreStudent {
  static async handle({ schoolId, data }: Params) {
    return db.transaction(async (trx) => {
      await SubscriptionLimitService.assertCanAddStudents(schoolId, 1, trx)

      // Get school for settings
      const school = await School.findOrFail(schoolId, { client: trx })

      // Generate student ID
      const studentId = await this.#generateStudentId(school, trx)

      const student = await Student.create(
        {
          schoolId,
          studentId,
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth ? DateTime.fromJSDate(data.dateOfBirth) : null,
          gender: data.gender,
          bloodGroup: data.bloodGroup,
          religion: data.religion,
          nationality: data.nationality,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
          medicalConditions: data.medicalConditions,
          allergies: data.allergies,
          emergencyContactName: data.emergencyContactName,
          emergencyContactPhone: data.emergencyContactPhone,
          admissionDate: data.admissionDate ? DateTime.fromJSDate(data.admissionDate) : null,
          previousSchool: data.previousSchool,
          status: 'active',
        },
        { client: trx }
      )

      return student
    })
  }

  static async #generateStudentId(
    school: School,
    trx: ReturnType<typeof db.transaction> extends Promise<infer T> ? T : never
  ): Promise<string> {
    // Get format from school settings or use default
    const settings = school.settings as { studentIdFormat?: string; studentIdSequence?: number }
    const format = settings.studentIdFormat || 'STU-{YYYY}-{XXXX}'

    const year = DateTime.now().year
    const yearShort = year.toString().slice(-2)

    // Get the next sequence number
    let sequence = settings.studentIdSequence || 1

    // Check for existing students with this sequence to avoid duplicates
    let studentId = this.#formatStudentId(format, year, yearShort, sequence)
    let exists = await Student.query({ client: trx })
      .where('schoolId', school.id)
      .where('studentId', studentId)
      .first()

    // Increment sequence until we find an unused ID
    while (exists) {
      sequence++
      studentId = this.#formatStudentId(format, year, yearShort, sequence)
      exists = await Student.query({ client: trx })
        .where('schoolId', school.id)
        .where('studentId', studentId)
        .first()
    }

    // Update school settings with next sequence
    await school
      .merge({
        settings: {
          ...settings,
          studentIdSequence: sequence + 1,
        },
      })
      .save()

    return studentId
  }

  static #formatStudentId(
    format: string,
    year: number,
    yearShort: string,
    sequence: number
  ): string {
    return format
      .replace('{YYYY}', year.toString())
      .replace('{YY}', yearShort)
      .replace('{XXXX}', sequence.toString().padStart(4, '0'))
      .replace('{XXX}', sequence.toString().padStart(3, '0'))
      .replace('{XX}', sequence.toString().padStart(2, '0'))
  }
}
