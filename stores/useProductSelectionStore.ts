import { create } from 'zustand'

interface SelectedProduct {
  tableIndex: number
  rowIndex: number
}

interface ProductSelectionStore {
  selectedProducts: SelectedProduct[]
  toggleProduct: (tableIndex: number, rowIndex: number) => void
  isSelected: (tableIndex: number, rowIndex: number) => boolean
  clearSelection: () => void
}

export const useProductSelectionStore = create<ProductSelectionStore>((set, get) => ({
  selectedProducts: [],
  
  toggleProduct: (tableIndex: number, rowIndex: number) => {
    set((state) => {
      const key = `${tableIndex}-${rowIndex}`
      const existingIndex = state.selectedProducts.findIndex(
        (p) => `${p.tableIndex}-${p.rowIndex}` === key
      )
      
      if (existingIndex >= 0) {
        // 이미 선택된 경우 제거
        return {
          selectedProducts: state.selectedProducts.filter((_, i) => i !== existingIndex),
        }
      } else {
        // 선택되지 않은 경우 추가
        return {
          selectedProducts: [...state.selectedProducts, { tableIndex, rowIndex }],
        }
      }
    })
  },
  
  isSelected: (tableIndex: number, rowIndex: number) => {
    const state = get()
    return state.selectedProducts.some(
      (p) => p.tableIndex === tableIndex && p.rowIndex === rowIndex
    )
  },
  
  clearSelection: () => {
    set({ selectedProducts: [] })
  },
}))

