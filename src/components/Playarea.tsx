import React from 'react'
import { useAppSelector } from '@/store/hooks'
import Dash from '@/views/Dash'
import ShopList from '@/views/ShopList'
import ProductList from '@/views/ProductList'
import OverviewMetrics from '@/views/OverviewMetrics'
import SearchFilter from '@/views/SearchFilter'
import StockStatus from '@/views/StockStatus'
import TopShops from '@/views/TopShops'

const Playarea = () => {
  const playtab = useAppSelector((state: any) => state.tab).tab
  const renderContent = () => {
    switch (playtab) {
      case 'dashboard':
        return <Dash />
      case 'shops':
        return <ShopList />
      case 'products':
        return <ProductList />
      case 'search-filter':
        return <SearchFilter />
      case 'overview-metrics':
        return <OverviewMetrics />
      case 'stock-status':
        return <StockStatus />
      case 'top-shops':
        return <TopShops />
      default:
        return <Dash />
    }
  }
  return (
    <div className="h-[calc(100vh-56px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-transparent dark:bg-[#242424]">
      <div className="p-4 max-w-7xl mx-auto">{renderContent()}</div>
    </div>
  )
}

export default Playarea
