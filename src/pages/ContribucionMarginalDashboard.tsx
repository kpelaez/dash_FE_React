/**
 * ============================================
 * ContribucionMarginalDashboard
 * ============================================
 *
 * Dashboard de Contribución Marginal por Cliente — Enero 2026
 *
 * ARQUITECTURA (MVP):
 *   Excel (.xlsx) → SheetJS (parse en browser) → estado local → UI
 *
 * MIGRACIÓN FUTURA (cuando haya backend):
 *   Solo reemplazar `loadFromExcel()` por `fetchFromAPI()`
 *   El resto del componente NO cambia.
 *
 * DEPENDENCIAS:
 *   npm install @tanstack/react-table xlsx
 *   (recharts ya está instalado)
 *
 * COLUMNAS DEL EXCEL (índices 0-17):
 *   0  Fecha ot         1  Nro ot          2  Cliente
 *   3  Fecha factura    4  Nro factura     5  Total bruto factura
 *   6  Fecha remito     7  Nro remito      8  Fecha consumo
 *   9  Nro consumo      10 Precio          11 Estado valorización
 *   12 Descripción      13 Fecha nc        14 Nro nc
 *   15 Total bruto nc   16 Contr. marginal 17 %margen
 */

import React, { useState, useMemo, useCallback, useRef } from 'react'
import * as XLSX from 'xlsx'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import {
  Upload,
  TrendingUp,
  DollarSign,
  BarChart2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react'

// ============================================================
// TIPOS
// ============================================================

interface RawRow {
  fechaOt: number | null
  nroOt: string
  cliente: string
  fechaFactura: number | null
  nroFactura: string
  totalBrutoFactura: number
  fechaRemito: number | null
  nroRemito: string
  fechaConsumo: number | null
  nroConsumo: number | null
  precio: number
  estadoValorizacion: string
  descripcion: string
  fechaNc: number | null
  nroNc: string
  totalBrutoNc: number
  contribMarginal: number
  pctMargen: number
}

interface ClienteSummary {
  cliente: string
  totalBruto: number
  totalNc: number
  costo: number
  contribMarginal: number
  pctMargen: number
  cantOTs: number
  estadoValorizacion: 'Valorizado' | 'Sin Valorizar' | 'Mixto'
}

// ============================================================
// HELPERS
// ============================================================

const fmt = (n: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n)

const fmtShort = (n: number): string => {
  if (Math.abs(n) >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n.toFixed(0)}`
}

const fmtPct = (n: number) => `${n.toFixed(1)}%`

/** Convierte número de serie Excel a string de fecha legible */
const excelDateToString = (serial: number | null): string => {
  if (!serial) return '—'
  const date = new Date((serial - 25569) * 86400 * 1000)
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

/** Parsea el Excel y devuelve array de RawRow */
function parseExcel(file: File): Promise<RawRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer)
        const wb = XLSX.read(data, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const raw: unknown[][] = XLSX.utils.sheet_to_json(ws, { header: 1 })

        // Saltar fila de encabezado (índice 0)
        const rows: RawRow[] = raw
          .slice(1)
          .filter((r: unknown[]) => r[2])         // filtrar filas sin cliente
          .filter((r: unknown[]) => !r[14])        // excluir registros con Nota de Crédito (col 14 = Nro NC)
          .map((r: unknown[]) => ({
            fechaOt: (r[0] as number) ?? null,
            nroOt: String(r[1] ?? ''),
            cliente: String(r[2] ?? ''),
            fechaFactura: (r[3] as number) ?? null,
            nroFactura: String(r[4] ?? ''),
            totalBrutoFactura: Number(r[5] ?? 0),
            fechaRemito: (r[6] as number) ?? null,
            nroRemito: String(r[7] ?? ''),
            fechaConsumo: (r[8] as number) ?? null,
            nroConsumo: (r[9] as number) ?? null,
            precio: Number(r[10] ?? 0),
            estadoValorizacion: String(r[11] ?? ''),
            descripcion: String(r[12] ?? ''),
            fechaNc: (r[13] as number) ?? null,
            nroNc: String(r[14] ?? ''),
            totalBrutoNc: Number(r[15] ?? 0),
            contribMarginal: Number(r[16] ?? 0),
            pctMargen: Number(r[17] ?? 0),
          }))
        resolve(rows)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('Error leyendo el archivo'))
    reader.readAsArrayBuffer(file)
  })
}

/** Agrupa filas por cliente y calcula totales */
function buildClienteSummaries(rows: RawRow[]): ClienteSummary[] {
  const map = new Map<string, ClienteSummary>()

  for (const r of rows) {
    const existing = map.get(r.cliente)
    if (!existing) {
      map.set(r.cliente, {
        cliente: r.cliente,
        totalBruto: r.totalBrutoFactura,
        totalNc: r.totalBrutoNc,
        costo: r.precio,
        contribMarginal: r.contribMarginal,
        pctMargen: 0, // recalculamos al final
        cantOTs: r.nroOt ? 1 : 0,
        estadoValorizacion: r.estadoValorizacion === 'Valorizado' ? 'Valorizado' : 'Sin Valorizar',
      })
    } else {
      existing.totalBruto += r.totalBrutoFactura
      existing.totalNc += r.totalBrutoNc
      existing.costo += r.precio
      existing.contribMarginal += r.contribMarginal
      if (r.nroOt) existing.cantOTs += 1
      if (existing.estadoValorizacion !== r.estadoValorizacion) {
        existing.estadoValorizacion = 'Mixto'
      }
    }
  }

  // Recalcular % margen final por cliente
  const result = Array.from(map.values()).map((c) => ({
    ...c,
    pctMargen: c.totalBruto > 0 ? (c.contribMarginal / c.totalBruto) * 100 : 0,
  }))

  return result.sort((a, b) => b.contribMarginal - a.contribMarginal)
}

// ============================================================
// COLORES
// ============================================================

const EMERALD_PALETTE = [
  '#059669', '#10b981', '#34d399', '#6ee7b7',
  '#047857', '#065f46', '#0d9488', '#0891b2',
  '#0284c7', '#2563eb', '#4f46e5', '#7c3aed',
]

const margenColor = (pct: number) => {
  if (pct >= 85) return 'text-emerald-600'
  if (pct >= 70) return 'text-blue-600'
  if (pct >= 50) return 'text-yellow-600'
  return 'text-red-500'
}

const margenBg = (pct: number) => {
  if (pct >= 85) return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (pct >= 70) return 'bg-blue-50 text-blue-700 border-blue-200'
  if (pct >= 50) return 'bg-yellow-50 text-yellow-700 border-yellow-200'
  return 'bg-red-50 text-red-700 border-red-200'
}

// ============================================================
// SUB-COMPONENTES
// ============================================================

/** Zona de drag-and-drop para subir el Excel */
const UploadZone: React.FC<{ onFile: (f: File) => void; loading: boolean }> = ({
  onFile,
  loading,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) onFile(file)
    },
    [onFile]
  )

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          w-full max-w-lg border-2 border-dashed rounded-2xl p-14
          flex flex-col items-center gap-5 cursor-pointer
          transition-all duration-200
          ${dragging
            ? 'border-emerald-500 bg-emerald-50 scale-[1.01]'
            : 'border-gray-300 bg-white hover:border-emerald-400 hover:bg-emerald-50/40'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
        />
        {loading ? (
          <>
            <div className="w-14 h-14 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
            <p className="text-gray-600 font-medium">Procesando archivo...</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <Upload size={30} className="text-emerald-600" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800">
                Cargar Excel de Contribución Marginal
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Arrastrá el archivo acá o hacé click para seleccionarlo
              </p>
              <p className="text-xs text-gray-400 mt-2">.xlsx o .xls</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/** Tarjeta de KPI */
const KpiCard: React.FC<{
  label: string
  value: string
  sub?: string
  icon: React.ReactNode
  accent: string
  trend?: string
}> = ({ label, value, sub, icon, accent, trend }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent}`}>
        {icon}
      </div>
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
    {trend && (
      <div className="text-xs font-medium text-emerald-600 flex items-center gap-1">
        <TrendingUp size={12} /> {trend}
      </div>
    )}
  </div>
)

// ============================================================
// CUSTOM Y-AXIS TICK — trunca nombres largos con tooltip nativo
// ============================================================

const CustomYAxisTick = ({ x, y, payload }: { x?: number; y?: number; payload?: { value: string } }) => {
  const maxChars = 22
  const name = payload?.value ?? ''
  const display = name.length > maxChars ? name.substring(0, maxChars) + '…' : name
  return (
    <g transform={`translate(${x},${y})`}>
      <title>{name}</title>
      <text
        x={0}
        y={0}
        dy={4}
        textAnchor="end"
        fill="#374151"
        fontSize={11}
        fontFamily="system-ui, sans-serif"
      >
        {display}
      </text>
    </g>
  )
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

const ContribucionMarginalDashboard: React.FC = () => {
  // ── Estado ─────────────────────────────────────────────
  const [rows, setRows] = useState<RawRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'resumen' | 'detalle'>('resumen')
  // Estado compartido: cliente seleccionado desde el gráfico → filtra en DetalleTab
  const [selectedCliente, setSelectedCliente] = useState<string | null>(null)

  // TanStack Table — resumen por cliente
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'contribMarginal', desc: true },
  ])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  // ── Cargar archivo ──────────────────────────────────────
  const handleFile = useCallback(async (file: File) => {
    setLoading(true)
    setError(null)
    try {
      const parsed = await parseExcel(file)
      setRows(parsed)
      setFileName(file.name)
    } catch (e) {
      setError('Error al procesar el archivo. Verificá que sea el formato correcto.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Datos derivados ─────────────────────────────────────
  const summaries = useMemo(() => buildClienteSummaries(rows), [rows])

  const kpis = useMemo(() => {
    const totalBruto = rows.reduce((s, r) => s + r.totalBrutoFactura, 0)
    const totalCosto = rows.reduce((s, r) => s + r.precio, 0)
    const totalCM = rows.reduce((s, r) => s + r.contribMarginal, 0)
    const pctMargen = totalBruto > 0 ? (totalCM / totalBruto) * 100 : 0
    const valorizado = rows.filter((r) => r.estadoValorizacion === 'Valorizado').length
    const sinValorizar = rows.filter((r) => r.estadoValorizacion === 'Sin Valorizar').length
    const pctValorizado = rows.length > 0 ? (valorizado / rows.length) * 100 : 0

    return { totalBruto, totalCosto, totalCM, pctMargen, valorizado, sinValorizar, pctValorizado }
  }, [rows])

  // Datos para gráfico de barras — Top 10 por CM
  // IMPORTANTE: usar fullName como key única para evitar duplicados en el eje Y
  const barData = useMemo(
    () =>
      summaries.slice(0, 10).map((c) => ({
        name: c.cliente, // nombre completo — el CustomTick lo trunca visualmente
        fullName: c.cliente,
        cm: c.contribMarginal,
        bruto: c.totalBruto,
        pct: c.pctMargen,
      })),
    [summaries]
  )


  // ── Columnas TanStack Table ─────────────────────────────
  const columns = useMemo<ColumnDef<ClienteSummary>[]>(
    () => [
      {
        accessorKey: 'cliente',
        header: 'Cliente',
        cell: ({ getValue }) => (
          <span className="font-medium text-gray-800 text-sm">{getValue() as string}</span>
        ),
        size: 280,
      },
      {
        accessorKey: 'cantOTs',
        header: 'OTs',
        cell: ({ getValue }) => (
          <span className="text-center block text-gray-600">{getValue() as number}</span>
        ),
        size: 60,
      },
      {
        accessorKey: 'totalBruto',
        header: 'Total Bruto',
        cell: ({ getValue }) => (
          <span className="text-right block font-mono text-gray-700 text-sm">
            {fmt(getValue() as number)}
          </span>
        ),
      },
      {
        accessorKey: 'costo',
        header: 'Costo (P.P.P.)',
        cell: ({ getValue }) => (
          <span className="text-right block font-mono text-gray-500 text-sm">
            {fmt(getValue() as number)}
          </span>
        ),
      },
      {
        accessorKey: 'contribMarginal',
        header: 'Contrib. Marginal',
        cell: ({ getValue }) => (
          <span className="text-right block font-mono font-semibold text-emerald-700 text-sm">
            {fmt(getValue() as number)}
          </span>
        ),
      },
      {
        accessorKey: 'pctMargen',
        header: '% Margen',
        cell: ({ getValue }) => {
          const pct = getValue() as number
          return (
            <div className="flex justify-end">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${margenBg(pct)}`}
              >
                {fmtPct(pct)}
              </span>
            </div>
          )
        },
      },
      {
        accessorKey: 'estadoValorizacion',
        header: 'Estado',
        cell: ({ getValue }) => {
          const v = getValue() as string
          return (
            <div className="flex justify-center">
              {v === 'Valorizado' ? (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-700">
                  <CheckCircle2 size={13} /> Valorizado
                </span>
              ) : v === 'Sin Valorizar' ? (
                <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                  <Clock size={13} /> Sin Valorizar
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                  <AlertCircle size={13} /> Mixto
                </span>
              )}
            </div>
          )
        },
      },
    ],
    []
  )

  const table = useReactTable({
    data: summaries,
    columns,
    state: { sorting, columnFilters, globalFilter, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  // ── Render ──────────────────────────────────────────────

  // Sin datos — mostrar upload
  if (rows.length === 0) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Contribución Marginal por Cliente
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Enero 2026 — Cargá el archivo Excel para visualizar el dashboard
          </p>
        </div>
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        <UploadZone onFile={handleFile} loading={loading} />
      </div>
    )
  }

  // Con datos — mostrar dashboard
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Contribución Marginal por Cliente
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Enero 2026 · {summaries.length} clientes · {rows.length} operaciones ·{' '}
            <span className="text-emerald-600 font-medium">{fileName}</span>
          </p>
        </div>
        <button
          onClick={() => { setRows([]); setFileName('') }}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Upload size={15} /> Cambiar archivo
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          label="Total Facturado Bruto"
          value={fmtShort(kpis.totalBruto)}
          sub={fmt(kpis.totalBruto)}
          icon={<DollarSign size={18} className="text-emerald-600" />}
          accent="bg-emerald-100"
        />
        <KpiCard
          label="Contribución Marginal"
          value={fmtShort(kpis.totalCM)}
          sub={fmt(kpis.totalCM)}
          icon={<TrendingUp size={18} className="text-blue-600" />}
          accent="bg-blue-100"
          trend={`${fmtPct(kpis.pctMargen)} de margen global`}
        />
        <KpiCard
          label="Costo Total (P.P.P.)"
          value={fmtShort(kpis.totalCosto)}
          sub={fmt(kpis.totalCosto)}
          icon={<BarChart2 size={18} className="text-violet-600" />}
          accent="bg-violet-100"
        />

      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-4">
        {/* Bar chart — Top 10 CM */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h2 className="text-sm font-semibold text-gray-700">
                Top 10 Clientes por Contribución Marginal
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Hacé click en una barra para filtrar el detalle de operaciones
              </p>
            </div>
            {selectedCliente && (
              <button
                onClick={() => setSelectedCliente(null)}
                className="text-xs text-emerald-600 hover:text-emerald-800 font-medium flex items-center gap-1 shrink-0"
              >
                ✕ Limpiar filtro
              </button>
            )}
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={barData}
              layout="vertical"
              margin={{ left: 10, right: 50, top: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis
                type="number"
                tickFormatter={fmtShort}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={160}
                tick={<CustomYAxisTick />}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value: number, _name: string, props) => [
                  `${fmt(value)} (${fmtPct(props.payload.pct)})`,
                  'Contribución Marginal',
                ]}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ''}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '12px',
                }}
                cursor={{ fill: 'rgba(16,185,129,0.08)' }}
              />
              <Bar
                dataKey="cm"
                radius={[0, 4, 4, 0]}
                maxBarSize={22}
                style={{ cursor: 'pointer' }}
                onClick={(data) => {
                  // Recharts tipea data como BarRectangleItem — el payload real está en data
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const clicked = (data as any)?.fullName as string | undefined
                  if (clicked) {
                    setSelectedCliente((prev) => (prev === clicked ? null : clicked))
                    setActiveTab('detalle')
                  }
                }}
              >
                {barData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={
                      selectedCliente === null || selectedCliente === entry.fullName
                        ? EMERALD_PALETTE[i % EMERALD_PALETTE.length]
                        : '#e5e7eb'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Tabs: Resumen / Detalle */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Tab Bar */}
        <div className="flex border-b border-gray-200">
          {(['resumen', 'detalle'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3.5 text-sm font-medium transition-colors capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-emerald-600 text-emerald-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab === 'resumen' ? 'Resumen por Cliente' : 'Detalle de Operaciones'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'resumen' ? (
          <div>
            {/* Search bar */}
            <div className="p-4 border-b border-gray-100">
              <div className="relative max-w-sm">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Buscar cliente..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  {table.getHeaderGroups().map((hg) => (
                    <tr key={hg.id} className="bg-gray-50 border-b border-gray-200">
                      {hg.headers.map((header) => (
                        <th
                          key={header.id}
                          onClick={header.column.getToggleSortingHandler()}
                          className={`
                            px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide
                            ${header.column.getCanSort() ? 'cursor-pointer select-none hover:bg-gray-100' : ''}
                          `}
                          style={{ width: header.getSize() }}
                        >
                          <div className="flex items-center gap-1.5">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getCanSort() && (
                              <span className="text-gray-400">
                                {header.column.getIsSorted() === 'asc' ? (
                                  <ChevronUp size={13} />
                                ) : header.column.getIsSorted() === 'desc' ? (
                                  <ChevronDown size={13} />
                                ) : (
                                  <ChevronsUpDown size={13} />
                                )}
                              </span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row, i) => (
                    <tr
                      key={row.id}
                      className={`
                        border-b border-gray-100 hover:bg-emerald-50/40 transition-colors
                        ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}
                      `}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
              <span>
                {table.getFilteredRowModel().rows.length} clientes
                {globalFilter && ` (filtrado de ${summaries.length})`}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-medium">
                  Pág. {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                </span>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Detalle de operaciones */
          <DetalleTab rows={rows} selectedCliente={selectedCliente} onClearCliente={() => setSelectedCliente(null)} />
        )}
      </div>
    </div>
  )
}

// ============================================================
// TAB DETALLE — tabla de operaciones individuales
// ============================================================

const DetalleTab: React.FC<{
  rows: RawRow[]
  selectedCliente: string | null
  onClearCliente: () => void
}> = ({ rows, selectedCliente, onClearCliente }) => {
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 })

  // Cuando cambia selectedCliente desde el gráfico, resetear a página 1
  React.useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }))
  }, [selectedCliente])

  // Filtrar filas: si hay cliente seleccionado desde el gráfico, filtra primero
  const filteredRows = useMemo(() => {
    if (!selectedCliente) return rows
    return rows.filter((r) => r.cliente === selectedCliente)
  }, [rows, selectedCliente])

  const columns = useMemo<ColumnDef<RawRow>[]>(
    () => [
      {
        accessorKey: 'nroOt',
        header: 'N° OT',
        cell: ({ getValue }) => (
          <span className="font-mono text-xs text-gray-600">{getValue() as string || '—'}</span>
        ),
        size: 100,
      },
      {
        accessorKey: 'cliente',
        header: 'Cliente',
        cell: ({ getValue }) => (
          <span className="text-sm font-medium text-gray-800 truncate block max-w-[220px]">
            {getValue() as string}
          </span>
        ),
        size: 240,
      },
      {
        accessorKey: 'nroFactura',
        header: 'N° Factura',
        cell: ({ getValue }) => (
          <span className="font-mono text-xs text-gray-500">{getValue() as string}</span>
        ),
        size: 140,
      },
      {
        accessorKey: 'fechaFactura',
        header: 'Fecha Factura',
        cell: ({ getValue }) => (
          <span className="text-xs text-gray-500">{excelDateToString(getValue() as number)}</span>
        ),
        size: 110,
      },
      {
        accessorKey: 'totalBrutoFactura',
        header: 'Bruto',
        cell: ({ getValue }) => (
          <span className="text-right block font-mono text-xs text-gray-700">
            {fmt(getValue() as number)}
          </span>
        ),
      },
      {
        accessorKey: 'precio',
        header: 'Costo',
        cell: ({ getValue }) => (
          <span className="text-right block font-mono text-xs text-gray-500">
            {fmt(getValue() as number)}
          </span>
        ),
      },
      {
        accessorKey: 'contribMarginal',
        header: 'C. Marginal',
        cell: ({ getValue }) => (
          <span className="text-right block font-mono text-xs font-semibold text-emerald-700">
            {fmt(getValue() as number)}
          </span>
        ),
      },
      {
        accessorKey: 'pctMargen',
        header: '%',
        cell: ({ getValue }) => {
          const pct = getValue() as number
          return (
            <span className={`text-right block text-xs font-bold ${margenColor(pct)}`}>
              {fmtPct(pct)}
            </span>
          )
        },
        size: 65,
      },
      {
        accessorKey: 'estadoValorizacion',
        header: 'Estado',
        cell: ({ getValue }) => {
          const v = getValue() as string
          return (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                v === 'Valorizado'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {v}
            </span>
          )
        },
        size: 100,
      },
    ],
    []
  )

  const table = useReactTable({
    data: filteredRows,
    columns,
    state: { sorting, globalFilter, pagination },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div>
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Badge de cliente filtrado desde el gráfico */}
        {selectedCliente && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-700 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {selectedCliente.length > 40 ? selectedCliente.substring(0, 40) + '…' : selectedCliente}
            <button
              onClick={onClearCliente}
              className="ml-1 text-emerald-500 hover:text-emerald-800 font-bold leading-none"
              title="Quitar filtro"
            >
              ✕
            </button>
          </div>
        )}
        <div className="relative max-w-sm w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Buscar OT, cliente, factura..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="bg-gray-50 border-b border-gray-200">
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap
                      ${header.column.getCanSort() ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                    style={{ width: header.getSize() }}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="text-gray-400">
                          {header.column.getIsSorted() === 'asc' ? (
                            <ChevronUp size={12} />
                          ) : header.column.getIsSorted() === 'desc' ? (
                            <ChevronDown size={12} />
                          ) : (
                            <ChevronsUpDown size={12} />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, i) => (
              <tr
                key={row.id}
                className={`border-b border-gray-100 hover:bg-emerald-50/40 transition-colors
                  ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2.5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
        <span>
          {table.getFilteredRowModel().rows.length} operaciones
          {selectedCliente && ` de ${rows.length} totales`}
          {!selectedCliente && globalFilter && ` (filtrado de ${rows.length})`}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-medium">
            Pág. {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContribucionMarginalDashboard