import { TrendingUp, TrendingDown } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { DateTime } from 'luxon'
import type { SchoolAdminDashboardStats } from '~/types/dashboard'
import { formatPKR } from '~/lib/format-pkr'

export default function FeeCollectionChart({
  fees,
}: {
  fees: SchoolAdminDashboardStats['fees']
}) {
  const formatDate = (iso: string) => DateTime.fromISO(iso).toFormat('MMM d')
  const formatYAxis = (value: number) => formatPKR(value)
  const { trendChangePercent } = fees

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">Fee Collection — Last 2 Weeks</h2>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={fees.trend}>
          <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={formatYAxis} width={80} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number | undefined) => [formatPKR(value ?? 0), 'Collected']}
            labelFormatter={formatDate}
          />
          <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]}>
            {fees.trend.map((entry, i) => (
              <Cell key={i} fill={entry.amount === 0 ? '#e5e7eb' : '#6366f1'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-6 mt-3 text-sm text-gray-500">
        <span>
          Total: <span className="font-medium text-gray-900">{formatPKR(fees.trendTotal)}</span>
        </span>
        <span>
          Avg/day:{' '}
          <span className="font-medium text-gray-900">{formatPKR(fees.trendAvgPerDay)}</span>
        </span>
        <span className="flex items-center gap-1">
          {trendChangePercent >= 0 ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span
            className={
              trendChangePercent >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'
            }
          >
            {Math.abs(trendChangePercent)}% vs previous 2 weeks
          </span>
        </span>
      </div>
    </div>
  )
}
