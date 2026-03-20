import Staff from '#models/staff_member'
import StaffDocument from '#models/staff_document'
import StaffDto from '#dtos/staff_member'
import StaffDocumentDto from '#dtos/staff_document'
import StoreStaffDocument from '#actions/staff/document/store_staff_document'
import {
  createStaffDocumentValidator,
  updateStaffDocumentValidator,
} from '#validators/staff_document'
import type { HttpContext } from '@adonisjs/core/http'

export default class StaffDocumentsController {
  async index({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const staff = await Staff.query()
      .where('id', params.staffId)
      .where('schoolId', schoolId)
      .preload('documents')
      .firstOrFail()

    return inertia.render('staff/documents/index', {
      staff: new StaffDto(staff),
      documents: StaffDocumentDto.fromArray(staff.documents),
    })
  }

  async create({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const staff = await Staff.query()
      .where('id', params.staffId)
      .where('schoolId', schoolId)
      .firstOrFail()

    return inertia.render('staff/documents/create', {
      staff: new StaffDto(staff),
    })
  }

  async store({ params, request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const staff = await Staff.query()
      .where('id', params.staffId)
      .where('schoolId', schoolId)
      .firstOrFail()

    const data = await request.validateUsing(createStaffDocumentValidator)

    await StoreStaffDocument.handle({ staffMemberId: staff.id, data })

    session.flash('success', 'Document added successfully')
    return response.redirect().toRoute('staff.members.documents.index', {
      staffId: staff.id,
    })
  }

  async edit({ params, session, inertia }: HttpContext) {
    const schoolId = session.get('schoolId')
    const staff = await Staff.query()
      .where('id', params.staffId)
      .where('schoolId', schoolId)
      .firstOrFail()

    const document = await StaffDocument.query()
      .where('id', params.id)
      .where('staffMemberId', staff.id)
      .firstOrFail()

    return inertia.render('staff/documents/edit', {
      staff: new StaffDto(staff),
      document: new StaffDocumentDto(document),
    })
  }

  async update({ params, request, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const staff = await Staff.query()
      .where('id', params.staffId)
      .where('schoolId', schoolId)
      .firstOrFail()

    const document = await StaffDocument.query()
      .where('id', params.id)
      .where('staffMemberId', staff.id)
      .firstOrFail()

    const data = await request.validateUsing(updateStaffDocumentValidator)

    document.merge(data)
    await document.save()

    session.flash('success', 'Document updated successfully')
    return response.redirect().toRoute('staff.members.documents.index', {
      staffId: staff.id,
    })
  }

  async destroy({ params, response, session }: HttpContext) {
    const schoolId = session.get('schoolId')
    const staff = await Staff.query()
      .where('id', params.staffId)
      .where('schoolId', schoolId)
      .firstOrFail()

    const document = await StaffDocument.query()
      .where('id', params.id)
      .where('staffMemberId', staff.id)
      .firstOrFail()

    await document.delete()

    session.flash('success', 'Document deleted successfully')
    return response.redirect().toRoute('staff.members.documents.index', {
      staffId: staff.id,
    })
  }
}
