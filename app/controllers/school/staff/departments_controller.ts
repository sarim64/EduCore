import DepartmentDto from '#dtos/department'
import ListDepartments from '#actions/school/staff/department/list_departments'
import GetDepartment from '#actions/school/staff/department/get_department'
import StoreDepartment from '#actions/school/staff/department/store_department'
import UpdateDepartment from '#actions/school/staff/department/update_department'
import DeleteDepartment from '#actions/school/staff/department/delete_department'
import { createDepartmentValidator, updateDepartmentValidator } from '#validators/department'
import type { HttpContext } from '@adonisjs/core/http'

export default class DepartmentsController {
  async index({ session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const departments = await ListDepartments.handle({ schoolId })

    return inertia.render('school/staff/departments/index', {
      departments: DepartmentDto.fromArray(departments),
    })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('school/staff/departments/create')
  }

  async store({ request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(createDepartmentValidator)

    await StoreDepartment.handle({ schoolId, data })

    session.flash('success', 'Department created successfully')
    return response.redirect().toRoute('staff.departments.index')
  }

  async edit({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const department = await GetDepartment.handle({
      departmentId: params.id,
      schoolId,
    })

    return inertia.render('school/staff/departments/edit', {
      department: new DepartmentDto(department),
    })
  }

  async update({ params, request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const data = await request.validateUsing(updateDepartmentValidator)

    await UpdateDepartment.handle({
      departmentId: params.id,
      schoolId,
      data,
    })

    session.flash('success', 'Department updated successfully')
    return response.redirect().toRoute('staff.departments.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')

    await DeleteDepartment.handle({
      departmentId: params.id,
      schoolId,
    })

    session.flash('success', 'Department deleted successfully')
    return response.redirect().toRoute('staff.departments.index')
  }
}
