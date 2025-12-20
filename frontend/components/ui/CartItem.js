import React from 'react'
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Divider,
} from '@mui/material'
import {
  Add,
  Remove,
  Delete,
} from '@mui/icons-material'
import Image from 'next/image'
import { formatPrice } from '../../lib/utils'

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return
    if (newQuantity > item.product.stock) return
    onUpdateQuantity(item.id, newQuantity)
  }

  const totalPrice = item.product.price * item.quantity

  return (
    <Box className="border rounded-lg p-4 mb-4">
      <Box className="flex items-center space-x-4">
        {/* Product Image */}
        <Image
          src={item.product.featuredImage || '/images/placeholder.jpg'}
          alt={item.product.name}
          width={80}
          height={80}
          className="rounded-lg object-cover"
        />

        {/* Product Details */}
        <Box className="flex-1">
          <Typography variant="h6" className="font-semibold">
            {item.product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatPrice(item.product.price)}
          </Typography>
          {item.product.stock < 10 && (
            <Typography variant="body2" color="warning.main">
              Only {item.product.stock} left in stock
            </Typography>
          )}
        </Box>

        {/* Quantity Controls */}
        <Box className="flex items-center space-x-2">
          <IconButton
            size="small"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Remove />
          </IconButton>
          
          <TextField
            value={item.quantity}
            size="small"
            className="w-16"
            inputProps={{ 
              style: { textAlign: 'center' },
              min: 1,
              max: item.product.stock
            }}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
          />
          
          <IconButton
            size="small"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={item.quantity >= item.product.stock}
          >
            <Add />
          </IconButton>
        </Box>

        {/* Total Price */}
        <Typography variant="h6" className="font-bold min-w-20 text-right">
          {formatPrice(totalPrice)}
        </Typography>

        {/* Remove Button */}
        <IconButton
          color="error"
          onClick={() => onRemove(item.id)}
        >
          <Delete />
        </IconButton>
      </Box>
    </Box>
  )
}

export default CartItem