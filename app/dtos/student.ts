import { BaseModelDto } from '@adocasts.com/dto/base'
import Student from '#models/student'

export default class StudentDto extends BaseModelDto {
  declare id: string
  declare schoolId: string
  declare studentId: string
  declare firstName: string
  declare lastName: string | null
  declare dateOfBirth: string | null
  declare admissionDate: string | null
  declare gender: string | null
  declare bloodGroup: string | null
  declare religion: string | null
  declare nationality: string | null
  declare email: string | null
  declare phone: string | null
  declare address: string | null
  declare city: string | null
  declare state: string | null
  declare postalCode: string | null
  declare country: string | null
  declare previousSchool: string | null
  declare emergencyContactName: string | null
  declare emergencyContactPhone: string | null
  declare medicalConditions: string | null
  declare allergies: string | null
  declare status: string
  declare photoUrl: string | null
  declare createdAt: string
  declare updatedAt: string | null
  declare fullName: string

  constructor(student?: Student) {
    super()

    if (!student) return
    this.id = student.id
    this.schoolId = student.schoolId
    this.studentId = student.studentId
    this.firstName = student.firstName
    this.lastName = student.lastName
    this.dateOfBirth = student.dateOfBirth?.toISODate() ?? null
    this.admissionDate = student.admissionDate?.toISODate() ?? null
    this.gender = student.gender
    this.bloodGroup = student.bloodGroup
    this.religion = student.religion
    this.nationality = student.nationality
    this.email = student.email
    this.phone = student.phone
    this.address = student.address
    this.city = student.city
    this.state = student.state
    this.postalCode = student.postalCode
    this.country = student.country
    this.previousSchool = student.previousSchool
    this.emergencyContactName = student.emergencyContactName
    this.emergencyContactPhone = student.emergencyContactPhone
    this.medicalConditions = student.medicalConditions
    this.allergies = student.allergies
    this.status = student.status
    this.photoUrl = student.photoUrl
    this.createdAt = student.createdAt.toISO()!
    this.updatedAt = student.updatedAt?.toISO() ?? null
    this.fullName = student.fullName
  }
}
