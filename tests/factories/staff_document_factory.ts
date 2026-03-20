import factory from '@adonisjs/lucid/factories'
import StaffDocument from '#models/staff_document'

export const StaffDocumentFactory = factory
  .define(StaffDocument, async ({ faker }) => {
    return {
      name: faker.helpers.arrayElement([
        'CNIC Copy',
        'Resume/CV',
        'Experience Certificate',
        'Degree Certificate',
        'Character Certificate',
        'Medical Certificate',
      ]),
      type: faker.helpers.arrayElement([
        'identity',
        'educational',
        'experience',
        'medical',
        'other',
      ]),
      fileUrl: `/uploads/staff/documents/${faker.string.uuid()}.pdf`,
      fileType: 'application/pdf',
      fileSize: faker.number.int({ min: 50000, max: 5000000 }),
      notes: null,
    }
  })
  .build()
