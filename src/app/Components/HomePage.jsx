"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios'
export default function HomePage({ seassionId }){
    const router = useRouter();
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    async function checkIfUserLogedIn(){
        try{
            await axios.get(`${API_BASE_URL}/api/user/is-user-logged-in`,
                {headers:{
                    seassion_id: seassionId
                }}
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