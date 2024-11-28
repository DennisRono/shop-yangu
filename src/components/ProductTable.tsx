import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Product } from '@/interfaces'
import CImage from './CustomImage'

interface ProductTableProps {
  products: Product[]
  onSort: (column: keyof Product) => void
  sortBy: keyof Product
  sortOrder: 'asc' | 'desc'
  onUpdate: (product: Product) => void
  onDelete: (product: Product) => void
}

export function ProductTable({
  products,
  onSort,
  sortBy,
  sortOrder,
  onUpdate,
  onDelete,
}: ProductTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No.</TableHead>
          <TableHead onClick={() => onSort('name')} className="cursor-pointer">
            Product Name{' '}
            {sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
          </TableHead>
          <TableHead>Description</TableHead>
          <TableHead onClick={() => onSort('price')} className="cursor-pointer">
            Price {sortBy === 'price' && (sortOrder === 'asc' ? '▲' : '▼')}
          </TableHead>
          <TableHead
            onClick={() => onSort('stock_level')}
            className="cursor-pointer"
          >
            Stock Level{' '}
            {sortBy === 'stock_level' && (sortOrder === 'asc' ? '▲' : '▼')}
          </TableHead>
          <TableHead>Image</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product, i) => (
          <TableRow key={product._id}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.description}</TableCell>
            <TableCell>Ksh. {product.price}</TableCell>
            <TableCell>{product.stock_level}</TableCell>
            <TableCell>
              {product.thumbnail && (
                <CImage logo={product.thumbnail} name={product.name} />
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-center">
                <Button onClick={() => onUpdate(product)} className="mr-2">
                  Update
                </Button>
                <Button onClick={() => onDelete(product)} variant="destructive">
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
