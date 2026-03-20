import Staff from '#models/staff_member'
import StaffQualification from '#models/staff_qualification'
import StaffDto from '#dtos/staff_member'
import StaffQualificationDto from '#dtos/staff_qualification'
import StoreStaffQualification from '#actions/staff/qualification/store_staff_qualification'
import {
  createStaffQualificationValidator,
  updateStaffQualificationValidator,
} from '#validators/staff_qualification'
import type { HttpContext } from '@adonisjs/core/http'

export default class StaffQualificationsController {
  async index({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const staff = await Staff.query()
      .where('id', params.staffId)
      .where('schoolId', schoolId)
      .preload('qualifications')
      .firstOrFail()

    return inertia.render('staff/qualifications/index', {
      staff: new StaffDto(staff),
      qualifications: StaffQualificationDto.fromArray(staff.qualifications),
    })
  }

  async create({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const staff = await Staff.query()
      .where('id', params.staffId)
      .where('schoolId', schoolId)
      .firstOrFail()

    return inertia.render('staff/qualifications/create', {
      staff: new StaffDto(staff),
    })
  }

  async store({ params, request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const staff = await Staff.query()
      .where('id', params.staffId)
      .where('schoolId', schoolId)
      .firstOrFail()

    const data = await request.validateUsing(createStaffQualificationValidator)

    await StoreStaffQualification.handle({ staffMemberId: staff.id, data })

    session.flash('success', 'Qualification added successfully')
    return response.redirect().toRoute('staff.members.qualifications.index', {
      staffId: staff.id,
    })
  }

  async edit({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const staff = await Staff.query()
      .where('id', params.staffId)
      .where('schoolId', schoolId)
      .firstOrFail()

    const qualification = await StaffQualification.query()
      .where('id', params.id)
      .where('staffMemberId', staff.id)
      .firstOrFail()

    return inertia.render('staff/qualifications/edit', {
      staff: new StaffDto(staff),
      qualification: new StaffQualificationDto(qualification),
    })
  }

  async update({ params, request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const staff = await Staff.query()
      .where('id', params.staffId)
      .where('schoolId', schoolId)
      .firstOrFail()

    const qualification = await StaffQualification.query()
      .where('id', params.id)
      .where('staffMemberId', staff.id)
      .firstOrFail()

    const data = await request.validateUsing(updateStaffQualificationValidator)

    qualification.merge(data)
    await qualification.save()

    session.flash('success', 'Qualification updated successfully')
    return response.redirect().toRoute('staff.members.qualifications.index', {
      staffId: staff.id,
    })
  }

  async destroy({ params, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const staff = await Staff.query()
      .where('id', params.staffId)
      .where('schoolId', schoolId)
      .firstOrFail()

    const qualification = await StaffQualification.query()
      .where('id', params.id)
      .where('staffMemberId', staff.id)
      .firstOrFail()

    await qualification.delete()

    session.flash('success', 'Qualification deleted successfully')
    return response.redirect().toRoute('staff.members.qualifications.index', {
      staffId: staff.id,
    })
  }
}
