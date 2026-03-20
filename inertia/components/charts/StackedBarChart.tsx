import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { DEFAULT_COLORS } from './index'
interface BarConfig {
  key: string
  name: string
  color?: string
}

export interface StackedBarChartProps {
  data: Record<string, unknown>[]
  categoryKey: string
  bars: BarConfig[]
  height?: number
  layout?: 'horizontal' | 'vertical'
  showGrid?: boolean
  showLegend?: boolean
  formatTooltip?: (value: number) => string
  formatAxis?: (value: number) => string
  categoryWidth?: number
  emptyMessage?: string
  stacked?: boolean
}

export function StackedBarChart({
  data,
  categoryKey,
  bars,
  height = 300,
  layout = 'horizontal',
  showGrid = true,
  showLegend = true,
  formatTooltip,
  formatAxis,
  categoryWidth = 80,
  emptyMessage = 'No data available',
  stacked = true,
}: StackedBarChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground" style={{ height }}>
        {emptyMessage}
      </div>
    )
  }

  const isVertical = layout === 'vertical'
  const stackId = stacked ? 'stack' : undefined

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout={isVertical ? 'vertical' : 'horizontal'}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        {isVertical ? (
          <>
            <XAxis type="number" tickFormatter={formatAxis} />
            <YAxis dataKey={categoryKey} type="category" width={categoryWidth} />
          </>
        ) : (
          <>
            <XAxis dataKey={categoryKey} />
            <YAxis tickFormatter={formatAxis} />
          </>
        )}
        <Tooltip
          formatter={(value, name) => [formatTooltip ? formatTooltip(Number(value)) : value, name]}
        />
        {showLegend && <Legend />}
        {bars.map((bar, index) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            fill={bar.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
            name={bar.name}
            stackId={stackId}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
