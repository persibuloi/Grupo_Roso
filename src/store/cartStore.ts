import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartItem, Product } from '@/lib/types';

interface CartStore {
  cart: Cart;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
}

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.product.priceRetail * item.quantity), 0);
};

const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

export const useCartStore = create<CartStore>()(persist(
  (set, get) => ({
    cart: {
      items: [],
      total: 0,
      itemCount: 0
    },
    
    addItem: (product: Product, quantity = 1) => {
      set((state) => {
        const existingItem = state.cart.items.find(item => item.product.id === product.id);
        
        let newItems: CartItem[];
        
        if (existingItem) {
          newItems = state.cart.items.map(item => 
            item.product.id === product.id 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newItems = [...state.cart.items, { id: product.id, product, quantity }];
        }
        
        return {
          cart: {
            items: newItems,
            total: calculateTotal(newItems),
            itemCount: calculateItemCount(newItems)
          }
        };
      });
    },
    
    removeItem: (productId: string) => {
      set((state) => {
        const newItems = state.cart.items.filter(item => item.product.id !== productId);
        
        return {
          cart: {
            items: newItems,
            total: calculateTotal(newItems),
            itemCount: calculateItemCount(newItems)
          }
        };
      });
    },
    
    updateQuantity: (productId: string, quantity: number) => {
      set((state) => {
        if (quantity <= 0) {
          // Remover item si quantity es 0 o menor
          const newItems = state.cart.items.filter(item => item.product.id !== productId);
          
          return {
            cart: {
              items: newItems,
              total: calculateTotal(newItems),
              itemCount: calculateItemCount(newItems)
            }
          };
        }
        
        const newItems = state.cart.items.map(item => 
          item.product.id === productId 
            ? { ...item, quantity }
            : item
        );
        
        return {
          cart: {
            items: newItems,
            total: calculateTotal(newItems),
            itemCount: calculateItemCount(newItems)
          }
        };
      });
    },
    
    clearCart: () => {
      set({
        cart: {
          items: [],
          total: 0,
          itemCount: 0
        }
      });
    },
    
    getItemQuantity: (productId: string) => {
      const state = get();
      const item = state.cart.items.find(item => item.product.id === productId);
      return item ? item.quantity : 0;
    }
  }),
  {
    name: 'grupo-rosso-cart',
    partialize: (state) => ({ cart: state.cart })
  }
));