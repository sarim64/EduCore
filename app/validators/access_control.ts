import vine from '@vinejs/vine'

export const updateAccessControlValidator = vine.compile(
  vine.object({
    settings: vine.record(vine.record(vine.boolean())),
  })
)
