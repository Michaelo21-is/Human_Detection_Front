"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios'
export default function HomePage(){
    const router = useRouter();
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    async function checkIfUserLogedIn(){
        try{
            await axios.get(`${API_BASE_URL}/api/user/is-user-logged-in`,
                {
                    withCredentials: true,
                }
            );
        }
        catch(e){
            router.push("/login")
        }
    }
    useEffect(()=>{
        checkIfUserLogedIn()
    },[])
    return(
        <div>
            home page
        </div>
    )
}