import DesignationDto from '#dtos/designation'
import DepartmentDto from '#dtos/department'
import ListDesignations from '#actions/staff/designation/list_designations'
import GetDesignation from '#actions/staff/designation/get_designation'
import StoreDesignation from '#actions/staff/designation/store_designation'
import UpdateDesignation from '#actions/staff/designation/update_designation'
import DeleteDesignation from '#actions/staff/designation/delete_designation'
import ListDepartments from '#actions/staff/department/list_departments'
import { createDesignationValidator, updateDesignationValidator } from '#validators/designation'
import type { HttpContext } from '@adonisjs/core/http'

export default class DesignationsController {
  async index({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const designations = await ListDesignations.handle({ schoolId })

    return inertia.render('staff/designations/index', {
      designations: DesignationDto.fromArray(designations),
    })
  }

  async create({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const departments = await ListDepartments.handle({ schoolId })

    return inertia.render('staff/designations/create', {
      departments: DepartmentDto.fromArray(departments.filter((d) => d.isActive)),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(createDesignationValidator)

    await StoreDesignation.handle({ schoolId, data })

    session.flash('success', 'Designation created successfully')
    return response.redirect().toRoute('staff.designations.index')
  }

  async edit({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const designation = await GetDesignation.handle({
      designationId: params.id,
      schoolId,
    })
    const departments = await ListDepartments.handle({ schoolId })

    return inertia.render('staff/designations/edit', {
      designation: new DesignationDto(designation),
      departments: DepartmentDto.fromArray(departments.filter((d) => d.isActive)),
    })
  }

  async update({ params, request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(updateDesignationValidator)

    await UpdateDesignation.handle({
      designationId: params.id,
      schoolId,
      data,
    })

    session.flash('success', 'Designation updated successfully')
    return response.redirect().toRoute('staff.designations.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')

    await DeleteDesignation.handle({
      designationId: params.id,
      schoolId,
    })

    session.flash('success', 'Designation deleted successfully')
    return response.redirect().toRoute('staff.designations.index')
  }
}
