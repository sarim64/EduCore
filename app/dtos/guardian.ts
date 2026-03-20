import Guardian from '#models/guardian'

export default class GuardianDto {
  declare id: string
  declare schoolId: string
  declare firstName: string
  declare lastName: string | null
  declare fullName: string
  declare relation: string
  declare email: string | null
  declare phone: string
  declare alternatePhone: string | null
  declare address: string | null
  declare city: string | null
  declare state: string | null
  declare postalCode: string | null
  declare country: string | null
  declare occupation: string | null
  declare workplace: string | null
  declare workPhone: string | null
  declare nationalId: string | null
  declare createdAt: string
  declare updatedAt: string | null
  declare students?: Array<{ id: string; firstName: string; lastName: string | null }>

  // Pivot data (when accessing through student relationship)
  declare $extras?: {
    pivot_relation?: string
    pivot_is_primary?: boolean
    pivot_is_emergency_contact?: boolean
    pivot_can_pickup?: boolean
  }

  constructor(guardian?: Guardian) {
    if (!guardian) return

    this.id = guardian.id
    this.schoolId = guardian.schoolId
    this.firstName = guardian.firstName
    this.lastName = guardian.lastName
    this.fullName = guardian.fullName
    this.relation = guardian.relation
    this.email = guardian.email
    this.phone = guardian.phone
    this.alternatePhone = guardian.alternatePhone
    this.address = guardian.address
    this.city = guardian.city
    this.state = guardian.state
    this.postalCode = guardian.postalCode
    this.country = guardian.country
    this.occupation = guardian.occupation
    this.workplace = guardian.workplace
    this.workPhone = guardian.workPhone
    this.nationalId = guardian.nationalId
    this.createdAt = guardian.createdAt.toISO()!
    this.updatedAt = guardian.updatedAt?.toISO() ?? null

    if (Array.isArray((guardian as any).students)) {
      this.students = (guardian as any).students.map((student: any) => ({
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName ?? null,
      }))
    }

    // Include pivot data if present
    if (guardian.$extras) {
      this.$extras = {
        pivot_relation: guardian.$extras.pivot_relation,
        pivot_is_primary: guardian.$extras.pivot_is_primary,
        pivot_is_emergency_contact: guardian.$extras.pivot_is_emergency_contact,
        pivot_can_pickup: guardian.$extras.pivot_can_pickup,
      }
    }
  }
}
