import { Head, Link } from '@inertiajs/react'

export default function ModuleDisabled({ moduleName }: { moduleName: string }) {
  return (
    <>
      <Head title="Module Not Available" />
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-4 text-6xl text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Module Not Available</h1>
          <p className="mb-6 text-gray-600">
            The <span className="font-medium">{moduleName || 'requested'}</span> module is not
            enabled for your school. Please contact your administrator to enable this feature.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </>
  )
}
