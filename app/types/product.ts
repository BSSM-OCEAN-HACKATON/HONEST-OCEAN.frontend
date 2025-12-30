export interface ProductComparisonRow {
  imageUrl: string
  estimatedWeight: string
  merchantPrice: string
  priceDifference: string
}

export interface ProductComparisonTableProps {
  title?: string
  showTitle?: boolean
  rows: ProductComparisonRow[]
  tableIndex?: number
  isSelecting?: boolean
}

export interface ProductComparisonTable {
  title: string
  showTitle: boolean
  rows: ProductComparisonRow[]
}


