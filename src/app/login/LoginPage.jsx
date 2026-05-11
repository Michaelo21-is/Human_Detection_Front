"use client";

import Link from "next/link";
import axios from "axios";
import { useState } from "react";

export default function LoginPage() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  async function handleOnSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/auth/login`, form);
      router.push("/");
    } catch (e) {
      if (e?.response?.status === 401) {
        alert("סיסמא או אימייל לא נכונים");
      } else {
        alert("קרתה שגיאה בשרת אנה נסה שוב מאוחר יותר");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md rounded-xl border border-black bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold text-black">כניסה</h1>

        <form className="space-y-4" onSubmit={handleOnSubmit}>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-black text-right">
              אימייל
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full rounded-md border border-black bg-white px-3 py-2 text-black outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-black text-right">
              סיסמא
            </label>
            <input
              id="password"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              className="w-full rounded-md border border-black bg-white px-3 py-2 text-black outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black px-4 py-2 font-semibold text-white disabled:opacity-60"
          >
            {loading ? "טוען ....." : "כניסה"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-black">
          אין לך משתמש עדיין? לחץ כאן כדי ליצור
          <Link href="/sign-up" className="mr-1 font-semibold text-black underline ">
            הרשמה
          </Link>
        </p>
      </div>
    </div>
  );
}