import React from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setTab } from '@/store/slices/tabSlice'
import {
  Home,
  Plus,
  ShoppingBag,
  Package,
  ChevronLeft,
  ChevronRight,
  Store,
  PlusSquare,
  Search,
  BarChart2,
  Award,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  expanded: boolean
  setExpanded: (expanded: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ expanded, setExpanded }) => {
  const playtab = useAppSelector((state: any) => state.tab).tab
  const dispatch = useAppDispatch()

  const menuItems = [
    { name: 'Dashboard', icon: Home, key: 'dashboard' },
    { name: 'Shops', icon: Store, key: 'shops' },
    { name: 'Products', icon: ShoppingBag, key: 'products' },
    { name: 'Search & Filter', icon: Search, key: 'search-filter' },
    { name: 'Overview Metrics', icon: BarChart2, key: 'overview-metrics' },
    { name: 'Stock Status', icon: Package, key: 'stock-status' },
    { name: 'Top Shops', icon: Award, key: 'top-shops' },
  ]

  return (
    <aside
      className={cn(
        'bg-gray-900 text-gray-100 flex flex-col transition-all duration-300',
        expanded ? 'w-64' : 'w-20'
      )}
    >
      <div className="p-4 flex items-center justify-between">
        <div
          className={cn(
            'flex items-center',
            expanded ? 'gap-2 w-full' : 'justify-center'
          )}
        >
          {expanded && <span className="font-bold text-xl">ShopYangu</span>}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={
            ' mx-auto p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }
        >
          {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-2 space-y-1">
          {menuItems.map((item) => (
            <li key={item.key}>
              <button
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-lg transition-colors',
                  playtab === item.key
                    ? 'bg-white text-gray-900'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white',
                  !expanded && 'justify-center'
                )}
                onClick={() => dispatch(setTab({ tab: item.key }))}
                aria-current={playtab === item.key ? 'page' : undefined}
              >
                <item.icon
                  size={20}
                  className={
                    playtab === item.key ? 'text-gray-900' : 'text-gray-400'
                  }
                />
                {expanded && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
