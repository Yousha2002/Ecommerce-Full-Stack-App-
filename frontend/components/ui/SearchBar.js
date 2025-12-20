'use client'
import React, { useState } from 'react'
import {
  Paper,
  InputBase,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'
import { Search, Clear } from '@mui/icons-material'
import { useRouter } from 'next/navigation'

const SearchBar = ({ placeholder = "Search products...", size = "medium" }) => {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`)
      setQuery('')
      setIsFocused(false)
    }
  }

  const handleClear = () => {
    setQuery('')
    setIsFocused(false)
  }

  const heightClass = size === 'large' ? 'h-14' : 'h-10'
  const textSize = size === 'large' ? 'text-lg' : 'text-base'

  return (
    <Box className="relative w-full max-w-2xl">
      <Paper
        component="form"
        onSubmit={handleSearch}
        className={`flex items-center w-full ${heightClass} px-4`}
        elevation={isFocused ? 2 : 1}
      >
        <IconButton type="submit" className="p-2">
          <Search />
        </IconButton>
        
        <InputBase
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className={`flex-1 ml-2 ${textSize}`}
          inputProps={{ 'aria-label': 'search products' }}
        />
        
        {query && (
          <IconButton onClick={handleClear} className="p-2">
            <Clear />
          </IconButton>
        )}
      </Paper>

      {/* Search Suggestions */}
      {isFocused && query && (
        <Paper className="absolute top-full left-0 right-0 mt-1 max-h-80 overflow-auto z-10 shadow-lg">
          <List>
            <ListItem 
              button 
              onClick={() => {
                router.push(`/products?search=${encodeURIComponent(query)}`)
                setIsFocused(false)
              }}
            >
              <ListItemText 
                primary={
                  <Box className="flex items-center">
                    <Search className="mr-2 text-gray-400" />
                    <Typography>
                      Search for "{query}"
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            
            {/* Popular searches or recent searches can be added here */}
            <ListItem button onClick={() => {
              router.push('/products?category=1')
              setIsFocused(false)
            }}>
              <ListItemText primary="Electronics" />
            </ListItem>
            
            <ListItem button onClick={() => {
              router.push('/products?category=2')
              setIsFocused(false)
            }}>
              <ListItemText primary="Clothing" />
            </ListItem>
          </List>
        </Paper>
      )}
    </Box>
  )
}

export default SearchBar