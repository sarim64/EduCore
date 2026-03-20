import { ReactElement } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import DashboardLayout from '~/layouts/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'

type SchoolChoice = {
  id: string
  name: string
  code: string | null
  roleName: string
}

type Props = {
  schools: SchoolChoice[]
  canSwitch: boolean
  activeSchoolId?: string | null
}

export default function SelectSchoolPage({ schools, canSwitch, activeSchoolId }: Props) {
  const { post, setData, processing } = useForm({ schoolId: '' })

  function chooseSchool(schoolId: string) {
    setData('schoolId', schoolId)
    post('/schools/select')
  }

  return (
    <>
      <Head title="Select School" />
      <div className="max-w-3xl space-y-4">
        <h1 className="text-2xl font-semibold">{canSwitch ? 'Select School' : 'School Context'}</h1>
        {canSwitch ? (
          <p className="text-sm text-muted-foreground">
            You are a member of multiple schools. Choose the school context for this session.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            You are currently assigned to one school.
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {schools.map((school) => (
            <Card key={school.id}>
              <CardHeader>
                <CardTitle className="text-base">{school.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Role: <span className="font-medium text-foreground">{school.roleName}</span>
                </p>
                {school.code ? (
                  <p className="text-sm text-muted-foreground">
                    Code: <span className="font-medium text-foreground">{school.code}</span>
                  </p>
                ) : null}
                {canSwitch ? (
                  <Button type="button" onClick={() => chooseSchool(school.id)} disabled={processing}>
                    {activeSchoolId === school.id ? 'Current School' : 'Switch to This School'}
                  </Button>
                ) : (
                  <Button asChild type="button">
                    <Link href="/">Continue</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}

SelectSchoolPage.layout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>
