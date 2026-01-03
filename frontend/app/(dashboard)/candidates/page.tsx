"use client"

import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import api from '../../../lib/api'

const fetcher = (url: string) => api.get(url).then((r: any) => r.data)

export default function CandidatesPage() {
  const { data, error, isLoading } = useSWR('/candidates', fetcher)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const [form, setForm] = useState({ fullName: '', email: '', yearsExp: '', position: '' })

  const onUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return setMessage('Choose a file')
    setUploading(true)
    setMessage(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await api.post('/candidates/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setMessage('Uploaded OK')
      setFile(null)
      mutate('/candidates')
    } catch (err: any) {
      setMessage(err?.response?.data?.message || err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = { fullName: form.fullName || null, email: form.email || null, yearsExp: form.yearsExp ? Number(form.yearsExp) : null, position: form.position || null }
      await api.post('/candidates', payload)
      setForm({ fullName: '', email: '', yearsExp: '', position: '' })
      mutate('/candidates')
      setMessage('Candidate created')
    } catch (err: any) {
      setMessage(err?.response?.data?.message || err.message || 'Create failed')
    }
  }

  if (error) return <div>Error loading</div>
  if (isLoading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Candidates</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">Upload CV</h3>
          <form onSubmit={onUpload} className="flex items-center gap-3">
            <input className="block" type="file" accept=".pdf,.doc,.docx,.txt" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] ?? null)} />
            <button className="px-3 py-1 bg-blue-600 text-white rounded" type="submit" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</button>
          </form>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">Create Candidate</h3>
          <form onSubmit={onCreate} className="grid gap-2">
            <input className="border p-2 rounded" placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            <input className="border p-2 rounded" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="border p-2 rounded" placeholder="Years experience" value={form.yearsExp} onChange={(e) => setForm({ ...form, yearsExp: e.target.value })} />
            <input className="border p-2 rounded" placeholder="Position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
            <div>
              <button className="px-3 py-1 bg-green-600 text-white rounded" type="submit">Create</button>
            </div>
          </form>
        </div>
      </div>

      {message && <div className="text-sm text-gray-700">{message}</div>}

      <div className="bg-white p-4 rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-gray-600">
              <th className="pb-2">Name</th>
              <th className="pb-2">Email</th>
              <th className="pb-2">Years</th>
              <th className="pb-2">Skills</th>
              <th className="pb-2">CreatedAt</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((c: any) => (
              <tr key={c.id} className="border-t">
                <td className="py-3">{c.fullName}</td>
                <td className="py-3">{c.email}</td>
                <td className="py-3">{c.yearsExp}</td>
                <td className="py-3">{c.skills?.map((s: any) => s.skill?.name || s.name).join(', ')}</td>
                <td className="py-3">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
