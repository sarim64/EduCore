import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { DEFAULT_COLORS } from './index'
export interface DistributionPieChartProps {
  data: Record<string, unknown>[]
  nameKey: string
  valueKey: string
  height?: number
  colors?: string[]
  showLabels?: boolean
  showLegend?: boolean
  innerRadius?: number
  outerRadius?: number
  formatTooltip?: (value: number) => string
  emptyMessage?: string
}

export function DistributionPieChart({
  data,
  nameKey,
  valueKey,
  height = 300,
  colors = DEFAULT_COLORS,
  showLabels = true,
  showLegend = false,
  innerRadius = 0,
  outerRadius = 100,
  formatTooltip,
  emptyMessage = 'No data available',
}: DistributionPieChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground" style={{ height }}>
        {emptyMessage}
      </div>
    )
  }

  const renderLabel = showLabels
    ? ({ name, percent }: { name?: string; percent?: number }) =>
        `${name ?? ''} (${((percent ?? 0) * 100).toFixed(0)}%)`
    : false

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={showLabels}
          label={renderLabel}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          fill="#8884d8"
          dataKey={valueKey}
          nameKey={nameKey}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [formatTooltip ? formatTooltip(Number(value)) : value, valueKey]}
        />
        {showLegend && <Legend />}
      </PieChart>
    </ResponsiveContainer>
  )
}
