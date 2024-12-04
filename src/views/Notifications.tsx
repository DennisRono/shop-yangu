'use client'

import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import {
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Trash2,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

interface Notification {
  id: string
  title: string
  message: string
  date: Date
  read: boolean
}

const ITEMS_PER_PAGE = 5

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New message',
      message: 'You have a new message from Dennis Kibet',
      date: new Date('2023-06-01'),
      read: false,
    },
  ])

  const [currentPage, setCurrentPage] = useState(1)
  const [dateFilter, setDateFilter] = useState('')
  const [loading, setLoading] = useState(false)

  const filteredNotifications = dateFilter
    ? notifications.filter(
        (notification) => format(notification.date, 'yyyy-MM-dd') === dateFilter
      )
    : notifications

  const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE)
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const handleDelete = (id: string) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    )
  }

  const handleDateFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter(e.target.value)
    setCurrentPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  return (
    <div className="mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center">
            <Bell className="mr-2" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Input
              type="date"
              value={dateFilter}
              onChange={handleDateFilterChange}
              className="w-40"
              disabled={loading}
            />
            <Button
              variant="outline"
              onClick={() => setDateFilter('')}
              disabled={loading}
            >
              <Filter className="mr-2 h-4 w-4" /> Clear Filter
            </Button>
          </div>
          {loading ? (
            <NotificationsSkeleton />
          ) : paginatedNotifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No notifications found.
            </div>
          ) : (
            <ul className="space-y-4">
              {paginatedNotifications.map((notification) => (
                <li key={notification.id}>
                  <Card className={notification.read ? 'bg-muted' : ''}>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        {notification.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2 flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        {format(notification.date, 'PPP')}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      {!notification.read && (
                        <Button
                          variant="outline"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Mark as Read
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
        {!loading && totalPages > 1 && (
          <CardFooter className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

const NotificationsSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
      <Card key={index}>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex items-center mt-2">
            <Skeleton className="h-4 w-4 mr-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-9" />
        </CardFooter>
      </Card>
    ))}
  </div>
)

export default Notifications
