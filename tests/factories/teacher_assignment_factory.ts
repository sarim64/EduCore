import factory from '@adonisjs/lucid/factories'
import TeacherAssignment from '#models/teacher_assignment'

export const TeacherAssignmentFactory = factory
  .define(TeacherAssignment, async ({ faker }) => {
    return {
      isClassTeacher: faker.datatype.boolean({ probability: 0.2 }),
      notes: null,
    }
  })
  .build()
