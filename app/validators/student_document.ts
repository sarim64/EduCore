import vine from '@vinejs/vine'

export const createStudentDocumentValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(200),
    type: vine.string().trim().maxLength(50),
    file: vine.file({
      size: '5mb',
      extnames: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
    }),
  })
)
