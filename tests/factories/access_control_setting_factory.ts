import factory from '@adonisjs/lucid/factories'
import AccessControlSetting from '#models/access_control_setting'

export const AccessControlSettingFactory = factory
  .define(AccessControlSetting, async () => {
    return {
      schoolId: '',
      roleId: 4,
      permission: 'dashboard.cards.students',
      enabled: true,
    }
  })
  .build()
