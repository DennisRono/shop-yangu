'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const Dash = () => {
  const [metrics, setMetrics] = useState({
    totalShops: 0,
    totalProducts: 0,
    totalStock: 0,
    totalValue: 0,
    stockDistribution: [],
    topShops: [],
  })
  const [loading, setLoading] = useState(false)
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

  if (loading) {
    return <DashLoader />
  }

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalShops}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {format(metrics.totalValue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalStock}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Stock Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: 'Count',
                  color: 'hsl(var(--chart-1))',
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.stockDistribution}>
                  <XAxis dataKey="status" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Shops by Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                totalStock: {
                  label: 'Total Stock',
                  color: 'hsl(var(--chart-2))',
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.topShops}>
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
    </div>
  )
}

export default Dash

const DashLoader = () => (
  <div className="min-h-screen bg-gray-100 px-4 py-8">
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="bg-gray-300 h-24 rounded-lg animate-pulse"
            ></div>
          ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-300 h-64 rounded-lg animate-pulse"></div>
        <div className="bg-gray-300 h-64 rounded-lg animate-pulse"></div>
      </div>

      <div className="mt-4 bg-gray-300 rounded-lg p-6 animate-pulse">
        <div className="h-6 w-1/4 bg-gray-400 rounded mb-4 animate-pulse"></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <th
                      key={index}
                      className="h-4 bg-gray-400 rounded w-1/6 animate-pulse"
                    ></th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {Array(5)
                .fill(0)
                .map((_, rowIndex) => (
                  <tr key={rowIndex} className="border-b">
                    {Array(4)
                      .fill(0)
                      .map((_, colIndex) => (
                        <td
                          key={colIndex}
                          className="py-2 bg-gray-300 h-4 rounded animate-pulse"
                        ></td>
                      ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
)
