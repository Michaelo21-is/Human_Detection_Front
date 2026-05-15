"use client"

import Link from "next/link"
import axios from 'axios'
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function SignUpPage(){
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });
    async function handleOnSubmit(e){
        e.preventDefault();
        setLoading(true);
        try{
            await axios.post(`${API_BASE_URL}/api/auth/register`,
                form,{
                    withCredentials: true,
                }
            );
            console.log("successfully saved user")
            router.push("/");
            setLoading(false);
        }
        catch(e){
            alert("נכשל ביצירת המשתמש אנה נסה שוב");
            setLoading(false);
        }
    }
    return(
        <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="w-full max-w-md rounded-xl border border-black bg-white p-8 shadow-sm">
            <h1 className="mb-6 text-center text-2xl font-bold text-black">הרשמה</h1>

            <form className="space-y-4" onSubmit={handleOnSubmit}>
            <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-black text-right">
                 שם פרטי
                </label>
                <input
                dir="rtl"
                id="name"
                type="text"
                required
                value={form.firstName}
                onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
                className="w-full rounded-md border border-black bg-white px-3 py-2 text-black outline-none focus:ring-2 focus:ring-black"
                />
            </div>

            <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-black text-right">
                שם משפחה
                </label>
                <input
                id="lastName"
                dir="rtl"
                type="text"
                required
                value={form.lastName}
                onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
                className="w-full rounded-md border border-black bg-white px-3 py-2 text-black outline-none focus:ring-2 focus:ring-black"
                />
            </div>
            <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-black text-right">
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
                {loading ? "טוען ....." : "הרשמה"}
            </button>
            </form>

            <p className="mt-5 text-center text-sm text-black">
                לעמוד 
            <Link href="/login" className="mr-1 font-semibold text-black underline">
                התחברות
            </Link>
            </p>
        </div>
        </div>
    );
}