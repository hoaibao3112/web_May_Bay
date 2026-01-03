'use client'

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await axios.post((process.env.NEXT_PUBLIC_API_URL || '') + '/auth/login', { email, password })
      if (res.data?.access_token) {
        localStorage.setItem('token', res.data.access_token)
        router.replace('/(dashboard)')
      } else {
        setError('Invalid credentials')
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={submit} className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <div className="mb-3">
          <label className="block text-sm mb-1">Email</label>
          <input className="w-full border p-2 rounded" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        </div>
        <div className="mb-3">
          <label className="block text-sm mb-1">Password</label>
          <input className="w-full border p-2 rounded" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        </div>
        <div className="mt-4">
          <button className="w-full bg-blue-600 text-white py-2 rounded" type="submit">Login</button>
        </div>
        {error && <p className="text-red-600 mt-3">{error}</p>}
      </form>
    </div>
  )
}
