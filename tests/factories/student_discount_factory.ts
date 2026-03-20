import factory from '@adonisjs/lucid/factories'
import StudentDiscount from '#models/student_discount'
import { SchoolFactory } from './school_factory.js'
import { StudentFactory } from './student_factory.js'
import { FeeDiscountFactory } from './fee_discount_factory.js'
import { AcademicYearFactory } from './academic_year_factory.js'

export const StudentDiscountFactory = factory
  .define(StudentDiscount, async ({ faker }) => {
    return {
      remarks: faker.helpers.maybe(() => faker.lorem.sentence()),
      isActive: true,
    }
  })
  .relation('school', () => SchoolFactory)
  .relation('student', () => StudentFactory)
  .relation('feeDiscount', () => FeeDiscountFactory)
  .relation('academicYear', () => AcademicYearFactory)
  .build()
