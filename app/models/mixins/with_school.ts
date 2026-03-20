import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import School from '#models/school'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export const WithSchool = <T extends NormalizeConstructor<typeof BaseModel>>(superclass: T) => {
  class MixinClass extends superclass {
    @column()
    declare schoolId: string

    @belongsTo(() => School)
    declare school: BelongsTo<typeof School>
  }

  return MixinClass
}
