'use client'
import { useState } from 'react'

const STORAGE_KEY = 'expense_requests_demo'

function loadRequests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveRequests(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export default function ExpenseForm() {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [category, setCategory] = useState('Travel')
  const [note, setNote] = useState('')
  const [receipt, setReceipt] = useState(null)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const resetForm = () => {
    setTitle(''); setAmount(''); setDate(''); setCategory('Travel'); setNote(''); setReceipt(null)
    setMsg(''); setError('')
  }

  const handleFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => setReceipt(reader.result)
    reader.readAsDataURL(f)
  }

  const saveRequest = (status) => {
    if (!title || !amount || !date) {
      setError('❌ Vui lòng điền đầy đủ Tiêu đề, Số tiền và Ngày.')
      return false
    }

    const list = loadRequests()
    const item = {
      id: Date.now(),
      title,
      amount: Number(amount),
      date,
      category,
      note,
      receipt,
      status, // "Draft" hoặc "Pending"
    }
    list.unshift(item)
    saveRequests(list)
    return true
  }

  const handleSubmit = (e, status) => {
    e.preventDefault()
    setMsg('')
    setError('')

    const ok = saveRequest(status)
    if (!ok) return

    if (status === 'Draft') {
      setMsg('💾 Đã lưu bản nháp thành công!')
    } else {
      setMsg('✅ Yêu cầu đã được gửi thành công!')
    }

    resetForm()
    setTimeout(() => setMsg(''), 2500)
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {/* Thông báo */}
      {error && <div className='text-red-600 text-sm'>{error}</div>}
      {msg && <div className='text-green-600 text-sm'>{msg}</div>}

      <div>
        <label className='block text-sm text-gray-700'>
          Tiêu đề <span className="text-red-500">*</span>
        </label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className='w-full border p-2 rounded focus:ring-2 focus:ring-sky-300'
          placeholder='Nhập thông tin...'
        />
      </div>

      <div>
        <label className='block text-sm text-gray-700'>
          Mã nhân viên <span className="text-red-500">*</span>
        </label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className='w-full border p-2 rounded focus:ring-2 focus:ring-sky-300'
          placeholder='Nhập thông tin...'
        />
      </div>

      <div>
        <label className='block text-sm text-gray-700'>
          Họ và tên nhân viên <span className="text-red-500">*</span>
        </label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className='w-full border p-2 rounded focus:ring-2 focus:ring-sky-300'
          placeholder='Nhập thông tin...'
        />
      </div>

      <div>
        <label className='block text-sm text-gray-700'>
          Phòng ban <span className="text-red-500">*</span>
        </label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className='w-full border p-2 rounded focus:ring-2 focus:ring-sky-300'
          placeholder='Phòng ban...'
        >
          <option>Phòng Kế toán</option>
          <option>Phòng Kinh doanh</option>
          <option>Phòng Hành chính</option>
          <option>Phòng Nhân sự</option>
        </select>
      </div>

      <div>
        <label className='block text-sm text-gray-700'>
          Ngày tạo yêu cầu<span className="text-red-500">*</span>
        </label>
        <input
          value={date}
          onChange={e => setDate(e.target.value)}
          type='date'
          className='w-full border p-2 rounded focus:ring-2 focus:ring-sky-300'
        />
      </div>

      <div>
        <label className='block text-sm text-gray-700'>
          Loại chi phí <span className="text-red-500">*</span>
        </label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className='w-full border p-2 rounded focus:ring-2 focus:ring-sky-300'
          placeholder='Loại chi phí...'
        >
          <option>Ăn uống</option>
          <option>Di chuyển</option>
          <option>Chỗ ở</option>
          <option>Văn phòng phẩm</option>
          <option>Khác</option>
        </select>
      </div>

      <div>
        <label className='block text-sm text-gray-700'>
          Ngày phát sinh chi phí<span className="text-red-500">*</span>
        </label>
        <input
          value={date}
          onChange={e => setDate(e.target.value)}
          type='date'
          className='w-full border p-2 rounded focus:ring-2 focus:ring-sky-300'
        />
      </div>

      <div>
        <label className='block text-sm text-gray-700'>
          Số tiền (VND) <span className="text-red-500">*</span>
        </label>
        <input
          value={amount}
          onChange={e => setAmount(e.target.value)}
          type='number'
          min='0'
          className='w-full border p-2 rounded focus:ring-2 focus:ring-sky-300'
          placeholder='Nhập số tiền...'
        />
      </div>

      <div>
        <label className='block text-sm text-gray-700'>
          Đơn vị tiền tệ <span className="text-red-500">*</span>
        </label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className='w-full border p-2 rounded focus:ring-2 focus:ring-sky-300'
          placeholder='Đơn vị tiền tệ...'
        >
          <option>VND</option>
          <option>USD</option>
          <option>EUR</option>
          <option>JPY</option>
          <option>Khác</option>
        </select>
      </div>

      <div>
        <label className='block text-sm text-gray-700'>
          Phương thức thanh toán <span className="text-red-500">*</span>
        </label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className='w-full border p-2 rounded focus:ring-2 focus:ring-sky-300'
        >
          <option>Tiền mặt</option>
          <option>Chuyển khoản</option>
          <option>Thẻ tín dụng</option>
          <option>Khác</option>
        </select>
      </div>

      <div>
        <label className='block text-sm text-gray-700'>
          Nhà cung cấp/Người bán <span className="text-red-500">*</span>
        </label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className='w-full border p-2 rounded focus:ring-2 focus:ring-sky-300'
          placeholder='Nhập thông tin...'
        />
      </div>

      <div>
        <label className='block text-sm text-gray-700'>
          Số hóa đơn <span className="text-red-500">*</span>
        </label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className='w-full border p-2 rounded focus:ring-2 focus:ring-sky-300'
          placeholder='Nhập thông tin...'
        />
      </div>

      <div>
        <label className='block text-sm text-gray-700'>
          Đính kèm hóa đơn/biên lai</label><span className="text-red-500">*</span>
        <input onChange={handleFile} type='file' accept='image/*' className='w-full' />
        {receipt && <img src={receipt} alt='receipt' className='mt-2 w-48 border rounded' />}
      </div>

      <div>
        <label className='block text-sm text-gray-700'>Ghi chú</label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          className='w-full border p-2 rounded focus:ring-2 focus:ring-sky-300'
          rows={3}
          placeholder='Nhập thông tin...'
        />
      </div>

      <div className='pt-2'>
        <button className='bg-sky-600 text-white px-4 py-2 border rounded hover:bg-sky-500 transition'>
          Lưu bản nháp
        </button>

        <button className='bg-sky-600 text-white ml-3 px-4 py-2 border rounded hover:bg-sky-500 transition'>
          Gửi yêu cầu
        </button>

        <button
          type='button'
          onClick={resetForm}
          className='ml-3 px-3 py-2 border rounded hover:bg-gray-100 transition'
        >
          Huỷ
        </button>
      </div>
    </form>
  )
}

