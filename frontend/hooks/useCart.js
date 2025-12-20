import { useAppSelector, useAppDispatch } from '../store/hooks'
import { addToCart, removeFromCart, updateCartItem } from '../store/slices/cartSlice'

export const useCart = () => {
  const dispatch = useAppDispatch()
  const { items, isLoading, error } = useAppSelector((state) => state.cart)

  const addItemToCart = (productId, quantity = 1) => {
    dispatch(addToCart({ productId, quantity }))
  }

  const removeItemFromCart = (cartItemId) => {
    dispatch(removeFromCart(cartItemId))
  }

  const updateItemQuantity = (cartItemId, quantity) => {
    dispatch(updateCartItem({ cartItemId, quantity }))
  }

  const getCartTotal = () => {
    return items.reduce((total, item) => {
      return total + (item.product.price * item.quantity)
    }, 0)
  }

  const getCartItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const isInCart = (productId) => {
    return items.some(item => item.productId === productId)
  }

  return {
    items,
    isLoading,
    error,
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
    getCartTotal,
    getCartItemCount,
    isInCart
  }
}