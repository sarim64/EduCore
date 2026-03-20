import { ReactElement, useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { FormField } from '~/components/FormField'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import type { ClassWithSections } from '~/types/academics'
import type { CalendarData } from '~/types/attendance'

const months = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
]

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const statusColors: Record<string, string> = {
  present: 'bg-green-200 hover:bg-green-300',
  absent: 'bg-red-200 hover:bg-red-300',
  late: 'bg-yellow-200 hover:bg-yellow-300',
  excused: 'bg-blue-200 hover:bg-blue-300',
  half_day: 'bg-orange-200 hover:bg-orange-300',
  holiday: 'bg-gray-100',
  no_data: 'bg-white',
}

export default function CalendarViewPage({
  classes,
  selectedClassId,
  selectedSectionId,
  selectedYear,
  selectedMonth,
  calendarData,
}: {
  classes: ClassWithSections[]
  selectedClassId: string | null
  selectedSectionId: string | null
  selectedYear: number
  selectedMonth: number
  calendarData: CalendarData | null
}) {
  const [classId, setClassId] = useState(selectedClassId || '')
  const [sectionId, setSectionId] = useState(selectedSectionId || '')
  const [year, setYear] = useState(selectedYear)
  const [month, setMonth] = useState(selectedMonth)

  const selectedClass = classes.find((c) => c.id === classId)
  const sections = selectedClass?.sections || []

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!classId) return
    const params = new URLSearchParams()
    if (classId) params.append('classId', classId)
    if (sectionId) params.append('sectionId', sectionId)
    params.append('year', String(year))
    params.append('month', String(month))
    router.get(`/attendance/reports/calendar?${params.toString()}`)
  }

  const firstDayOffset = calendarData?.days[0] ? calendarData.days[0].dayOfWeek - 1 : 0

  return (
    <>
      <Head title="Attendance Calendar" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Attendance Calendar</h1>
          <Link href="/attendance/reports">
            <Button variant="outline">Back to Reports</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
              <FormField label="Class" htmlFor="classId" required className="w-48">
                <Select
                  value={classId || 'none'}
                  onValueChange={(value) => {
                    const nextClass = value === 'none' ? '' : value
                    setClassId(nextClass)
                    setSectionId('')
                  }}
                >
                  <SelectTrigger id="classId" className="w-full">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select Class</SelectItem>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Section" htmlFor="sectionId" className="w-48">
                <Select
                  value={sectionId || 'all'}
                  onValueChange={(value) => setSectionId(value === 'all' ? '' : value)}
                  disabled={!classId}
                >
                  <SelectTrigger id="sectionId" className="w-full">
                    <SelectValue placeholder="All Sections" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    {sections.map((sec) => (
                      <SelectItem key={sec.id} value={sec.id}>
                        {sec.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Month" htmlFor="month" className="w-40">
                <Select value={String(month)} onValueChange={(value) => setMonth(Number(value))}>
                  <SelectTrigger id="month" className="w-full">
                    <SelectValue placeholder="Select Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m.value} value={String(m.value)}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Year" htmlFor="year" className="w-28">
                <Select value={String(year)} onValueChange={(value) => setYear(Number(value))}>
                  <SelectTrigger id="year" className="w-full">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <Button type="submit" disabled={!classId}>
                View Calendar
              </Button>
            </form>
          </CardContent>
        </Card>

        {calendarData && (
          <Card>
            <CardHeader>
              <CardTitle>
                {calendarData.month} {calendarData.year}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {calendarData.summary.totalWorkingDays}
                  </p>
                  <p className="text-sm text-blue-600">Working Days</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {calendarData.summary.averageAttendance}%
                  </p>
                  <p className="text-sm text-purple-600">Avg. Attendance</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-200 rounded"></div>
                  <span className="text-sm">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-200 rounded"></div>
                  <span className="text-sm">Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-200 rounded"></div>
                  <span className="text-sm">Late</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 rounded border"></div>
                  <span className="text-sm">Weekend/Holiday</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white rounded border"></div>
                  <span className="text-sm">No Data</span>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="p-2 text-center text-sm font-medium text-gray-500 bg-gray-50"
                  >
                    {day}
                  </div>
                ))}

                {Array.from({ length: firstDayOffset }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-2 min-h-16"></div>
                ))}

                {calendarData.days.map((day) => (
                  <div
                    key={day.date}
                    className={`p-2 min-h-16 rounded-lg border ${statusColors[day.status]} transition-colors cursor-pointer`}
                    title={
                      day.count
                        ? `Present: ${day.count.present}, Absent: ${day.count.absent}, Late: ${day.count.late}`
                        : 'No data'
                    }
                  >
                    <div className="text-sm font-medium">{new Date(day.date).getDate()}</div>
                    {day.count && (
                      <div className="text-xs text-gray-600 mt-1">
                        <span className="text-green-600">{day.count.present}</span>/
                        <span className="text-red-600">{day.count.absent}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}

CalendarViewPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>
