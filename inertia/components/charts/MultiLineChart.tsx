import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { DEFAULT_COLORS } from './index'

interface LineConfig {
  key: string
  name: string
  color?: string
  strokeWidth?: number
  dashed?: boolean
}

export interface MultiLineChartProps {
  data: Record<string, unknown>[]
  xKey: string
  lines: LineConfig[]
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  formatTooltip?: (value: number) => string
  formatYAxis?: (value: number) => string
  emptyMessage?: string
}

export function MultiLineChart({
  data,
  xKey,
  lines,
  height = 300,
  showGrid = true,
  showLegend = true,
  formatTooltip,
  formatYAxis,
  emptyMessage = 'No data available',
}: MultiLineChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground" style={{ height }}>
        {emptyMessage}
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis dataKey={xKey} />
        <YAxis tickFormatter={formatYAxis} />
        <Tooltip
          formatter={(value, name) => [formatTooltip ? formatTooltip(Number(value)) : value, name]}
        />
        {showLegend && <Legend />}
        {lines.map((line, index) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            stroke={line.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
            strokeWidth={line.strokeWidth || 2}
            strokeDasharray={line.dashed ? '5 5' : undefined}
            name={line.name}
            dot={{ fill: line.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length] }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
