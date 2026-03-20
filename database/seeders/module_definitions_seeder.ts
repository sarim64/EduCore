import ModuleDefinition from '#models/module_definition'
import Modules, { MODULE_METADATA } from '#enums/modules'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const allModuleKeys = Object.values(Modules)

    const existingModules = await ModuleDefinition.query().whereIn('key', allModuleKeys)
    const existingKeys = existingModules.map((m) => m.key)

    const modulesToCreate = allModuleKeys
      .filter((key) => !existingKeys.includes(key))
      .map((key) => {
        const meta = MODULE_METADATA[key]
        return {
          key,
          name: meta.name,
          description: meta.description,
          isBasic: meta.isBasic,
          displayOrder: meta.displayOrder,
          icon: meta.icon,
          dependencies: meta.dependencies,
        }
      })

    if (modulesToCreate.length > 0) {
      await ModuleDefinition.createMany(modulesToCreate)
    }
  }
}
