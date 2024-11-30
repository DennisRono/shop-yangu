import Image from 'next/image'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Shop } from '@/interfaces'
import CImage from './CustomImage'

interface ShopTableProps {
  shops: Shop[]
  onSort: (column: keyof Shop) => void
  sortBy: keyof Shop
  sortOrder: 'asc' | 'desc'
  onUpdate: (shop: Shop) => void
  onDelete: (shop: Shop) => void
}

export function ShopTable({
  shops,
  onSort,
  sortBy,
  sortOrder,
  onUpdate,
  onDelete,
}: ShopTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No.</TableHead>
          <TableHead onClick={() => onSort('name')} className="cursor-pointer">
            Shop Name {sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
          </TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Logo</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shops.map((shop, i) => (
          <TableRow key={shop._id}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>
              <span className="overflow-ellipsis line-clamp-3">
                {shop.name}
              </span>
            </TableCell>
            <TableCell>
              <span className="overflow-ellipsis line-clamp-3">
                {shop.description}
              </span>
            </TableCell>
            <TableCell>
              {shop.logo && <CImage logo={shop.logo} name={shop.name} />}
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-center">
                <Button onClick={() => onUpdate(shop)} className="mr-2">
                  Update
                </Button>
                <Button onClick={() => onDelete(shop)} variant="destructive">
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
