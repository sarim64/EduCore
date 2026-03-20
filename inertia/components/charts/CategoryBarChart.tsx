import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { CHART_COLORS } from './index'
export interface CategoryBarChartProps {
  data: Record<string, unknown>[]
  categoryKey: string
  valueKey: string
  height?: number
  color?: string
  layout?: 'horizontal' | 'vertical'
  showGrid?: boolean
  formatTooltip?: (value: number) => string
  formatAxis?: (value: number) => string
  categoryWidth?: number
  emptyMessage?: string
  radius?: [number, number, number, number]
}

export function CategoryBarChart({
  data,
  categoryKey,
  valueKey,
  height = 300,
  color = CHART_COLORS.success,
  layout = 'horizontal',
  showGrid = true,
  formatTooltip,
  formatAxis,
  categoryWidth = 80,
  emptyMessage = 'No data available',
  radius = [4, 4, 0, 0],
}: CategoryBarChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground" style={{ height }}>
        {emptyMessage}
      </div>
    )
  }

  const isVertical = layout === 'vertical'
  const barRadius: [number, number, number, number] = isVertical
    ? [0, radius[0], radius[0], 0]
    : radius

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
          formatter={(value) => [formatTooltip ? formatTooltip(Number(value)) : value, valueKey]}
        />
        <Bar dataKey={valueKey} fill={color} radius={barRadius} />
      </BarChart>
    </ResponsiveContainer>
  )
}
