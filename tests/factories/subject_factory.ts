import factory from '@adonisjs/lucid/factories'
import Subject from '#models/subject'

export const SubjectFactory = factory
  .define(Subject, async ({ faker }) => {
    const subjects = [
      { name: 'Mathematics', code: 'MATH' },
      { name: 'English', code: 'ENG' },
      { name: 'Science', code: 'SCI' },
      { name: 'History', code: 'HIST' },
      { name: 'Geography', code: 'GEO' },
      { name: 'Physics', code: 'PHY' },
      { name: 'Chemistry', code: 'CHEM' },
      { name: 'Biology', code: 'BIO' },
    ]
    const subject = faker.helpers.arrayElement(subjects)
    return {
      name: subject.name,
      code: subject.code,
      description: null,
      isElective: false,
    }
  })
  .build()
