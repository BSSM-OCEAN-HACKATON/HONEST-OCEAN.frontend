import { ReactNode } from 'react'

export interface ButtonProps {
  text: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'dark'
  fullWidth?: boolean
}

export interface TableColumn {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
}

export interface TableRow {
  [key: string]: ReactNode
}

export interface TableProps {
  title?: string
  showTitle?: boolean
  columns: TableColumn[]
  rows: TableRow[]
}

export interface InfoCardProps {
  label: string
  value: string
}

export interface InfoCardValueProps {
  value: string
}

export interface ComparisonItemProps {
  imageUrl: string
  title: string
  description: string
}

export interface StarRatingProps {
  rating?: number
  onRatingChange?: (rating: number) => void
  maxRating?: number
}

export interface QuantityButtonsProps {
  onIncrement?: () => void
  onDecrement?: () => void
}

export interface NumericKeypadProps {
  onNumberClick: (num: string) => void
  onBackspace: () => void
  onDoubleZero: () => void
}

