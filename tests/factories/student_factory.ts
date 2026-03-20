import factory from '@adonisjs/lucid/factories'
import Student from '#models/student'
import { DateTime } from 'luxon'

export const StudentFactory = factory
  .define(Student, async ({ faker }) => {
    const year = DateTime.now().year
    const count = faker.number.int({ min: 1, max: 9999 })
    const studentId = `STU-${year}-${count.toString().padStart(4, '0')}`

    return {
      studentId,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      dateOfBirth: DateTime.fromJSDate(faker.date.birthdate({ min: 5, max: 18, mode: 'age' })),
      gender: faker.helpers.arrayElement(['male', 'female']),
      bloodGroup: faker.helpers.arrayElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
      email: faker.internet.email(),
      phone: faker.string.numeric(10),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      postalCode: faker.location.zipCode(),
      country: faker.location.country(),
      admissionDate: DateTime.now(),
      status: 'active',
    }
  })
  .build()
