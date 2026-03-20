import { BaseModelDto } from '@adocasts.com/dto/base'
import StaffMember from '#models/staff_member'
import DepartmentDto from '#dtos/department'
import DesignationDto from '#dtos/designation'
import UserDto from '#dtos/user'

export default class StaffDto extends BaseModelDto {
  declare id: string
  declare staffMemberId: string
  declare departmentId: string | null
  declare designationId: string | null
  declare userId: string | null
  declare firstName: string
  declare lastName: string | null
  declare fullName: string
  declare dateOfBirth: string | null
  declare gender: string | null
  declare bloodGroup: string | null
  declare maritalStatus: string | null
  declare nationality: string | null
  declare nationalId: string | null
  declare email: string | null
  declare phone: string | null
  declare alternatePhone: string | null
  declare address: string | null
  declare city: string | null
  declare state: string | null
  declare postalCode: string | null
  declare country: string | null
  declare emergencyContactName: string | null
  declare emergencyContactPhone: string | null
  declare emergencyContactRelation: string | null
  declare joiningDate: string | null
  declare employmentType: string
  declare basicSalary: number
  declare bankName: string | null
  declare bankAccountNumber: string | null
  declare status: string
  declare photoUrl: string | null
  declare createdAt: string
  declare updatedAt: string | null
  declare department: DepartmentDto | null
  declare designation: DesignationDto | null
  declare user: UserDto | null

  constructor(staffMember?: StaffMember) {
    super()

    if (!staffMember) return
    this.id = staffMember.id
    this.staffMemberId = staffMember.staffMemberId
    this.departmentId = staffMember.departmentId
    this.designationId = staffMember.designationId
    this.userId = staffMember.userId
    this.firstName = staffMember.firstName
    this.lastName = staffMember.lastName
    this.fullName = staffMember.fullName
    this.dateOfBirth = staffMember.dateOfBirth?.toISODate() ?? null
    this.gender = staffMember.gender
    this.bloodGroup = staffMember.bloodGroup
    this.maritalStatus = staffMember.maritalStatus
    this.nationality = staffMember.nationality
    this.nationalId = staffMember.nationalId
    this.email = staffMember.email
    this.phone = staffMember.phone
    this.alternatePhone = staffMember.alternatePhone
    this.address = staffMember.address
    this.city = staffMember.city
    this.state = staffMember.state
    this.postalCode = staffMember.postalCode
    this.country = staffMember.country
    this.emergencyContactName = staffMember.emergencyContactName
    this.emergencyContactPhone = staffMember.emergencyContactPhone
    this.emergencyContactRelation = staffMember.emergencyContactRelation
    this.joiningDate = staffMember.joiningDate?.toISODate() ?? null
    this.employmentType = staffMember.employmentType
    this.basicSalary = staffMember.basicSalary
    this.bankName = staffMember.bankName
    this.bankAccountNumber = staffMember.bankAccountNumber
    this.status = staffMember.status
    this.photoUrl = staffMember.photoUrl
    this.createdAt = staffMember.createdAt.toISO()!
    this.updatedAt = staffMember.updatedAt?.toISO() ?? null
    this.department = staffMember.department ? new DepartmentDto(staffMember.department) : null
    this.designation = staffMember.designation ? new DesignationDto(staffMember.designation) : null
    this.user = staffMember.user ? new UserDto(staffMember.user) : null
  }
}
