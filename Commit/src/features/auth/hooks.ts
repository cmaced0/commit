import { useContext } from 'react'
import { AuthContext } from '@/providers/AuthProvider'
import * as authApi from './api'

export function useAuth() {
    const { session, loading } = useContext(AuthContext)
    return { session, loading, ...authApi }
}