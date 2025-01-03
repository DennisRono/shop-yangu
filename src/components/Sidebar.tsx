'use client'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setTab } from '@/store/slices/tabSlice'
import {
  Home,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Store,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  expanded: boolean
  setExpanded: (expanded: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ expanded, setExpanded }) => {
  const playtab = useAppSelector((state: any) => state.tab).tab
  const [isVisible, setIsVisible] = useState(false)
  const dispatch = useAppDispatch()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (expanded) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [expanded])

  useEffect(() => {
    if (isMobile) {
      setExpanded(false)
    }
  }, [playtab, isMobile, setExpanded])

  const menuItems = [
    { name: 'Dashboard', icon: Home, key: 'dashboard' },
    { name: 'Shops', icon: Store, key: 'shops' },
    { name: 'Products', icon: ShoppingBag, key: 'products' },
  ]

  const handleTabChange = (key: string) => {
    dispatch(setTab({ tab: key }))
  }

  return (
    <aside
      className={cn(
        'bg-gray-900 text-gray-100 flex flex-col transition-all duration-300 ease-in-out',
        expanded
          ? 'absolute w-full h-screen z-50 md:!relative md:w-64'
          : 'block w-0 md:w-20'
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
            'mx-auto p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
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
                onClick={() => handleTabChange(item.key)}
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
