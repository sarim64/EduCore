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
import { CHART_COLORS } from './index'

export interface TrendLineChartProps {
  data: Record<string, unknown>[]
  xKey: string
  yKey: string
  height?: number
  color?: string
  strokeWidth?: number
  showGrid?: boolean
  showLegend?: boolean
  yDomain?: [number, number]
  formatTooltip?: (value: number) => string
  formatYAxis?: (value: number) => string
  name?: string
  emptyMessage?: string
}

export function TrendLineChart({
  data,
  xKey,
  yKey,
  height = 300,
  color = CHART_COLORS.primary,
  strokeWidth = 2,
  showGrid = true,
  showLegend = false,
  yDomain,
  formatTooltip,
  formatYAxis,
  name,
  emptyMessage = 'No data available',
}: TrendLineChartProps) {
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
        <YAxis domain={yDomain} tickFormatter={formatYAxis} />
        <Tooltip
          formatter={(value) => [
            formatTooltip ? formatTooltip(Number(value)) : value,
            name || yKey,
          ]}
        />
        {showLegend && <Legend />}
        <Line
          type="monotone"
          dataKey={yKey}
          stroke={color}
          strokeWidth={strokeWidth}
          dot={{ fill: color }}
          name={name}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
