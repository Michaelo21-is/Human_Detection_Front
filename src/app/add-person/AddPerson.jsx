"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function AddPersonPage(){
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name:"",
        whereIsKnownFrom:""
    });
    const [faceImage, setFaceImage] = useState(null);
    async function handleOnSubmit(e) {
    e.preventDefault();

    if (!faceImage) {
        alert("צריך להעלות תמונה");
        return;
    }

    setLoading(true);

    try {
        const formData = new FormData();

        formData.append("name", form.name);
        formData.append("where_is_known_from", form.whereIsKnownFrom);
        formData.append("face", faceImage);

        const response = await axios.post(
            `${API_BASE_URL}/api/llm/save-person`,
            formData,
            {
                withCredentials: true,
               
            }
        );

        alert(response.data);
        router.push("/");
    } catch (e) {
        console.log("failed to save person ",e);
        alert("נכשל לשמור את המשתמש");
    } finally {
        setLoading(false);
    }
    }
    return(<div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="w-full max-w-md rounded-xl border border-black bg-white p-8 shadow-sm">
            <h1 className="mb-6 text-center text-2xl font-bold text-black">הוספת אדם מוכר</h1>

            <form className="space-y-4" onSubmit={handleOnSubmit}>
            <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-black text-right">
                    שם פרטי \ כינוי
                </label>
                <input
                dir="rtl"
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-md border border-black bg-white px-3 py-2 text-black outline-none focus:ring-2 focus:ring-black"
                />
            </div>

            <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-black text-right">
                    מאיפה הוא מוכר 
                </label>
                <input
                id="lastName"
                dir="rtl"
                type="text"
                required
                value={form.whereIsKnownFrom}
                onChange={(e) => setForm((prev) => ({ ...prev, whereIsKnownFrom: e.target.value }))}
                className="w-full rounded-md border border-black bg-white px-3 py-2 text-black outline-none focus:ring-2 focus:ring-black mb-2"
                />
            </div>
           <input 
           type="file" 
           accept="image/*"
           onChange={(e) =>{
            const file = e.target.files[0];
            setFaceImage(file)
           }} 
           className="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-black
            hover:file:bg-violet-100"
            />

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-black px-4 py-3 font-semibold text-white disabled:opacity-60"
            >
                {loading ? "טוען ....." : "הוסף לרשימת אנשים"}
            </button>
            </form>

           
        </div>
        </div>);
}