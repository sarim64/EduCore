import factory from '@adonisjs/lucid/factories'
import Staff from '#models/staff_member'
import { DateTime } from 'luxon'

export const StaffFactory = factory
  .define(Staff, async ({ faker }) => {
    return {
      staffMemberId: `STF-${faker.string.alphanumeric(6).toUpperCase()}`,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      dateOfBirth: DateTime.fromJSDate(faker.date.birthdate({ min: 22, max: 60, mode: 'age' })),
      gender: faker.helpers.arrayElement(['male', 'female']),
      bloodGroup: faker.helpers.arrayElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
      maritalStatus: faker.helpers.arrayElement(['single', 'married', 'divorced', 'widowed']),
      nationality: 'Pakistani',
      nationalId: faker.string.numeric(13),
      email: faker.internet.email(),
      phone: faker.string.numeric(11), // Keep within varchar(20) limit
      alternatePhone: null,
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      postalCode: faker.string.numeric(6), // Keep within varchar(20) limit
      country: 'Pakistan',
      emergencyContactName: faker.person.fullName(),
      emergencyContactPhone: faker.string.numeric(11), // Keep within varchar(20) limit
      emergencyContactRelation: faker.helpers.arrayElement(['spouse', 'parent', 'sibling']),
      joiningDate: DateTime.fromJSDate(faker.date.past({ years: 5 })),
      employmentType: faker.helpers.arrayElement(['permanent', 'contract', 'temporary']),
      basicSalary: faker.number.int({ min: 30000, max: 150000 }),
      bankName: faker.helpers.arrayElement(['HBL', 'UBL', 'MCB', 'Allied Bank', 'Bank Alfalah']),
      bankAccountNumber: faker.finance.accountNumber(),
      status: 'active',
      photoUrl: null,
    }
  })
  .build()
