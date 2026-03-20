import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

export interface ExportColumn {
  header: string
  accessor: string | ((row: Record<string, unknown>) => string | number)
  width?: number
}

export interface ExportOptions {
  title: string
  subtitle?: string
  filename: string
  columns: ExportColumn[]
  data: Record<string, unknown>[]
  orientation?: 'portrait' | 'landscape'
  showDate?: boolean
  summary?: { label: string; value: string | number }[]
}

function getColumnValue(row: Record<string, unknown>, accessor: ExportColumn['accessor']): string {
  if (typeof accessor === 'function') {
    return String(accessor(row))
  }
  const value = row[accessor]
  if (value === null || value === undefined) return ''
  return String(value)
}

export function exportToPDF(options: ExportOptions): void {
  const {
    title,
    subtitle,
    filename,
    columns,
    data,
    orientation = 'portrait',
    showDate = true,
    summary,
  } = options

  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  let yPos = 15

  // Title
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(title, pageWidth / 2, yPos, { align: 'center' })
  yPos += 8

  // Subtitle
  if (subtitle) {
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(subtitle, pageWidth / 2, yPos, { align: 'center' })
    yPos += 6
  }

  // Date
  if (showDate) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'italic')
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, {
      align: 'center',
    })
    yPos += 8
  }

  // Table
  const tableHeaders = columns.map((col) => col.header)
  const tableData = data.map((row) => columns.map((col) => getColumnValue(row, col.accessor)))

  autoTable(doc, {
    startY: yPos,
    head: [tableHeaders],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold',
      halign: 'center',
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    columnStyles: columns.reduce(
      (acc, col, index) => {
        if (col.width) {
          acc[index] = { cellWidth: col.width }
        }
        return acc
      },
      {} as Record<number, { cellWidth: number }>
    ),
  })

  // Summary section
  if (summary && summary.length > 0) {
    const finalY =
      (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Summary:', 14, finalY)

    doc.setFont('helvetica', 'normal')
    summary.forEach((item, index) => {
      doc.text(`${item.label}: ${item.value}`, 14, finalY + 6 + index * 5)
    })
  }

  // Footer with page numbers
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, {
      align: 'center',
    })
  }

  doc.save(`${filename}.pdf`)
}

export function exportToExcel(options: ExportOptions): void {
  const { title, filename, columns, data, summary } = options

  // Prepare data for worksheet
  const worksheetData: (string | number)[][] = []

  // Add title row
  worksheetData.push([title])
  worksheetData.push([`Generated: ${new Date().toLocaleDateString()}`])
  worksheetData.push([]) // Empty row

  // Add headers
  worksheetData.push(columns.map((col) => col.header))

  // Add data rows
  data.forEach((row) => {
    worksheetData.push(
      columns.map((col) => {
        const value = getColumnValue(row, col.accessor)
        // Try to preserve numbers
        const numValue = Number(value.replace(/[^0-9.-]/g, ''))
        return Number.isNaN(numValue) ? value : numValue
      })
    )
  })

  // Add summary if provided
  if (summary && summary.length > 0) {
    worksheetData.push([]) // Empty row
    worksheetData.push(['Summary'])
    summary.forEach((item) => {
      worksheetData.push([item.label, String(item.value)])
    })
  }

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

  // Set column widths
  const colWidths = columns.map((col) => ({ wch: col.width || 15 }))
  worksheet['!cols'] = colWidths

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report')

  // Save file
  XLSX.writeFile(workbook, `${filename}.xlsx`)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}
