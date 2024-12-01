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
            className="cursor-pointer text-center"
          >
            Stock Level{' '}
            {sortBy === 'stock_level' && (sortOrder === 'asc' ? '▲' : '▼')}
          </TableHead>
          <TableHead>Image</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product: Product, i) => (
          <TableRow key={product._id}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>
              <span className="overflow-ellipsis line-clamp-3">
                {product?.name || ''}
              </span>
            </TableCell>
            <TableCell>
              <span className="overflow-ellipsis line-clamp-3">
                {product.description}
              </span>
            </TableCell>
            <TableCell className="whitespace-nowrap">
              Ksh. {product.price}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2 justify-center">
                <span>{product.stock_level}</span>
                <span
                  className={`px-2 py-1 rounded-full whitespace-nowrap text-xs ${getStatusColor(
                    product.stock_level
                  )}`}
                >
                  {product.stock_level > 5
                    ? 'in stock'
                    : product.stock_level === 0
                    ? 'out of stock'
                    : 'low stock'}
                </span>
              </div>
            </TableCell>
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

const getStatusColor = (stock: number) => {
  if (stock > 5) {
    return `bg-green-200 text-green-800`
  } else if (stock === 0) {
    return `bg-red-100 text-red-800`
  } else {
    return `bg-yellow-100 text-yellow-800`
  }
}
