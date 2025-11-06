'use client'
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'expense_requests_demo'

function loadRequests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveRequests(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export default function ExpenseList() {
  const [items, setItems] = useState([])

  useEffect(() => {
    setItems(loadRequests())
  }, [])

  const removeItem = (id) => {
    const next = items.filter(i => i.id !== id)
    setItems(next)
    saveRequests(next)
  }

  const toggleApprove = (id) => {
    const next = items.map(i =>
      i.id === id ? { ...i, status: i.status === 'Approved' ? 'Pending' : 'Approved' } : i
    )
    setItems(next)
    saveRequests(next)
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-lg font-semibold mb-2'>📋 Danh sách yêu cầu hoàn phí</h2>
      {items.length === 0 && (
        <div className='text-sm text-gray-500'>Chưa có yêu cầu nào được tạo.</div>
      )}

      {items.map(it => (
        <div
          key={it.id}
          className='border rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition flex gap-4'
        >
          {/* Cột chính */}
          <div className='flex-1'>
            <div className='flex items-center justify-between'>
              <div>
                <div className='font-semibold text-sky-700 text-base'>{it.title}</div>
                <div className='text-sm text-gray-500'>
                  Ngày yêu cầu: {it.date} • Loại: {it.category}
                </div>
              </div>
              <div
                className={`px-3 py-1 text-sm font-medium rounded ${
                  it.status === 'Approved'
                    ? 'bg-green-100 text-green-700'
                    : it.status === 'Draft'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {it.status}
              </div>
            </div>

            <div className='mt-3 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm'>
              <div><b>Mã NV:</b> {it.employeeId || '-'}</div>
              <div><b>Họ tên:</b> {it.employeeName || '-'}</div>
              <div><b>Phòng ban:</b> {it.department || '-'}</div>
              <div><b>Ngày phát sinh:</b> {it.expenseDate || '-'}</div>
              <div><b>Phương thức:</b> {it.paymentMethod || '-'}</div>
              <div><b>Nhà cung cấp:</b> {it.vendor || '-'}</div>
              <div><b>Số HĐ:</b> {it.invoiceNumber || '-'}</div>
              <div><b>Tiền tệ:</b> {it.currency || 'VND'}</div>
            </div>

            <div className='mt-3 text-sm'>
              <b>Số tiền:</b>{' '}
              <span className='font-semibold text-emerald-700'>
                {it.amount?.toLocaleString()} {it.currency || 'VND'}
              </span>
            </div>

            {it.note && (
              <div className='mt-2 text-sm text-gray-600'>
                <b>Ghi chú:</b> {it.note}
              </div>
            )}
          </div>

          {/* Cột phụ */}
          <div className='flex flex-col gap-2 items-center'>
            {it.receipt && (
              <img
                src={it.receipt}
                alt='receipt'
                className='w-28 border rounded-lg shadow-sm'
              />
            )}
            <button
              onClick={() => toggleApprove(it.id)}
              className='px-3 py-1 bg-sky-600 text-white rounded text-sm hover:bg-sky-700 transition'
            >
              Duyệt / Huỷ duyệt
            </button>
            <button
              onClick={() => removeItem(it.id)}
              className='px-3 py-1 border rounded text-sm hover:bg-gray-100 transition'
            >
              Xoá
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
