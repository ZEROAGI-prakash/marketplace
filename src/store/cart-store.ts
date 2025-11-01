import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  productId: string
  name: string
  price: number
  thumbnail: string
  isFree: boolean
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  getTotalPrice: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items
        const existingItem = items.find(i => i.productId === item.productId)
        
        if (!existingItem) {
          set({ items: [...items, item] })
        }
      },
      
      removeItem: (productId) => {
        set({ items: get().items.filter(item => item.productId !== productId) })
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.isFree ? 0 : item.price), 0)
      },
      
      getItemCount: () => {
        return get().items.length
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
