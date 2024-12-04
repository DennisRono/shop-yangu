'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Building2,
  DollarSign,
  Package,
  ShoppingBag,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

interface Metrics {
  totalShops: number
  totalProducts: number
  totalStock: number
  totalValue: number
}

interface ApiResponse {
  current: Metrics
  previous: Metrics
  stockDistribution: { status: string; count: number }[]
  topShops: { shopName: string; totalStock: number }[]
}

const Dash = () => {
  const [metrics, setMetrics] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      const res: any = await api('GET', 'metrics')
      const data = await res.json()
      if (res.ok) {
        setMetrics(data)
      } else {
        throw new Error(data.message)
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const format = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(amount)
  }

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 100
    return ((current - previous) / previous) * 100
  }

  if (loading || !metrics) {
    return <DashLoader />
  }

  const metricData = [
    {
      title: 'Total Shops',
      value: metrics.current.totalShops,
      previousValue: metrics.previous.totalShops,
      icon: Building2,
    },
    {
      title: 'Total Products',
      value: metrics.current.totalProducts,
      previousValue: metrics.previous.totalProducts,
      icon: Package,
    },
    {
      title: 'Total Value',
      value: metrics.current.totalValue,
      previousValue: metrics.previous.totalValue,
      icon: DollarSign,
      format,
    },
    {
      title: 'Total Stock',
      value: metrics.current.totalStock,
      previousValue: metrics.previous.totalStock,
      icon: ShoppingBag,
    },
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricData.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.format ? metric.format(metric.value) : metric.value}
              </div>
              {(() => {
                const percentageChange = getPercentageChange(
                  metric.value,
                  metric.previousValue
                )
                const isPositive = percentageChange > 0
                return (
                  <p
                    className={`flex items-center text-xs ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(percentageChange).toFixed(0)}%
                    <span className="text-muted-foreground ml-1">
                      from last period
                    </span>
                  </p>
                )
              })()}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 my-4 w-full">
        <Card className="flex-1 min-w-[200px] w-1/2">
          <CardHeader>
            <CardTitle>Stock Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <ChartContainer
              config={{
                count: {
                  label: 'Count',
                  color: 'hsl(var(--chart-1))',
                },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metrics.stockDistribution}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="status" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="flex-1 min-w-[200px] w-1/2">
          <CardHeader>
            <CardTitle>Top Shops by Stock</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <ChartContainer
              config={{
                totalStock: {
                  label: 'Total Stock',
                  color: 'hsl(var(--chart-2))',
                },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={metrics.topShops}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="shopName" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="totalStock"
                    stroke="var(--color-totalStock)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Shops</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shop Name</TableHead>
                <TableHead>Total Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.topShops.map((shop, index) => (
                <TableRow key={index}>
                  <TableCell>{shop.shopName}</TableCell>
                  <TableCell>{shop.totalStock}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dash

const DashLoader = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array(4)
        .fill(0)
        .map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[80px]" />
              <Skeleton className="h-4 w-[120px] mt-2" />
            </CardContent>
          </Card>
        ))}
    </div>

    <div className="flex flex-wrap gap-4">
      {Array(2)
        .fill(0)
        .map((_, index) => (
          <Card key={index} className="flex-1 min-w-[300px]">
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ))}
    </div>

    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[100px]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </CardContent>
    </Card>
  </div>
)
