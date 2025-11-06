import Link from "next/link";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";

export default function ExpensePage() {
  return (
    <div className="min-h-screen bg-[#e9f6fa]">
      {/* HEADER */}
      <header className="bg-[#65c3dd] text-white px-8 py-3 flex items-center justify-between shadow">
        <h1 className="text-3xl font-bold tracking-wide">SECRET WEAPON</h1>

        <div className="flex items-center gap-4">
          {/* Avatar giả */}
          <img
            src="https://i.pravatar.cc/32"
            alt="avatar"
            className="w-8 h-8 rounded-full border-2 border-white"
          />
          <Link
            href="/"
            className="bg-white text-[#65c3dd] text-sm px-3 py-1 rounded hover:bg-sky-50 transition"
          >
            Home
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CỘT TRÁI - FORM */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-[#65c3dd]">
              TẠO BÁO CÁO CHI PHÍ
            </h2>
            <ExpenseForm />
          </div>

          {/* CỘT PHẢI - DANH SÁCH */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-6 text-[#48B7D6]">
              DANH SÁCH YÊU CẦU
            </h3>
            <ExpenseList />
          </div>
        </div>
      </main>
    </div>
  );
}
