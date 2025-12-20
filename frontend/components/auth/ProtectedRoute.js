'use client'
import { useEffect } from 'react'
import { useAppSelector } from '../../store/hooks'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '../ui/LoadingSpinner'

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
    
    if (!isLoading && requireAdmin && user?.role !== 'admin') {
      router.push('/')
    }
  }, [isAuthenticated, user, isLoading, requireAdmin, router])

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Checking authentication..." />
  }

  if (!isAuthenticated) {
    return <LoadingSpinner fullScreen message="Redirecting to login..." />
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <LoadingSpinner fullScreen message="Access denied. Redirecting..." />
  }

  return children
}

export default ProtectedRoute