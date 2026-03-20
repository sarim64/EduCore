/**
 * Converts camelCase and snake_case field names in error messages to readable format
 * Example: "The firstName field must be defined" → "The first name field must be defined"
 * Also replaces "The [field] field must be defined" with "This field must be defined"
 */
export function formatErrorMessage(message: string): string {
  if (!message) return message

  return (
    message
      // User fields (camelCase)
      .replace(/firstName/g, 'first name')
      .replace(/lastName/g, 'last name')
      .replace(/roleId/g, 'role')
      .replace(/passwordConfirmation/g, 'password confirmation')
      .replace(/isActive/g, 'active status')
      // Patient fields (snake_case)
      .replace(/first_name/g, 'first name')
      .replace(/last_name/g, 'last name')
      .replace(/role_id/g, 'role')
      .replace(/password_confirmation/g, 'password confirmation')
      .replace(/is_active/g, 'active status')
      .replace(/national_id_number/g, 'national ID number')
      .replace(/national_id_type/g, 'national ID type')
      .replace(/medical_record_number/g, 'medical record number')
      .replace(/date_of_birth/g, 'date of birth')
      .replace(/address_line/g, 'address line')
      .replace(/postal_code/g, 'postal code')
      .replace(/emergency_contact_name/g, 'emergency contact name')
      .replace(/emergency_contact_phone/g, 'emergency contact phone')
      .replace(/procedure_type/g, 'procedure type')
      .replace(/request_date/g, 'request date')
      .replace(/requested_by/g, 'requested by')
      .replace(/patientId/g, 'patient')
      .replace(/report_date/g, 'report date')
      .replace(/radiologistId/g, 'radiologist')
      .replace(/checkup_request_id/g, 'checkup request')
  )
  // .replace(/The patient field must be defined/i, 'Patient must be selected')
}
