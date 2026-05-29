"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import CameraPage from "./CameraPage";

export default function HomePage({ sessionId }) {
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const wsRef = useRef(null);

  const [userVoiceId, setUserVoiceId] = useState("");

  async function checkIfUserLogedIn() {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/user/is-user-logged-in`,
        {
          withCredentials: true,
        }
      );

        const voiceId = response.data;

        setUserVoiceId(voiceId);

    } catch (e) {
      console.log("Login check error:", e);
      router.push("/login");
    }
  }
  function closeWebSocketAndNavigate(path) {
    if(wsRef.current){
      wsRef.current.close();
    }
    wsRef.current = null;
  
    router.push(path);
  }

  useEffect(() => {
    checkIfUserLogedIn();
  }, []);

  return (
    <div>
      <button
        className="fixed top-10 left-5 z-50 p-4 cursor-pointer bg-black text-lg font-semibold text-white rounded-lg"
        onClick={() => closeWebSocketAndNavigate("/add-person")}
      >
        הוספת אדם מוכר
      </button>

      <button
        className="fixed top-10 left-52 z-50 p-4 bg-black cursor-pointer text-lg font-semibold text-white rounded-lg"
        onClick={() => closeWebSocketAndNavigate("/change-voice")}
      >
        שינוי קול
      </button>

      {userVoiceId && (
        <CameraPage sessionId={sessionId} voiceId={userVoiceId} wsRef = {wsRef}/>
        )}
    </div>
  );
}