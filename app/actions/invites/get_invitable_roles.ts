import Role from '#models/role'
import Roles from '#enums/roles'

const INVITABLE_ROLE_IDS = [
  Roles.ACCOUNTANT,
  Roles.PRINCIPAL,
  Roles.VICE_PRINCIPAL,
  Roles.TEACHER,
  Roles.SUPPORT_STAFF,
]

export default class GetInvitableRoles {
  static async handle() {
    return Role.query().whereIn('id', INVITABLE_ROLE_IDS).orderBy('name', 'asc')
  }
}
