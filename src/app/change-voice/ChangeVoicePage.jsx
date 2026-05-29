"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
export default function ChangeVoice() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [currentVoiceId, setCurrentVoiceId] = useState(null);
  const router = useRouter();
  const voices = {
    "אבי": "2V7k6GOisfFlHlBdz8ec",
    "קרן": "uIZsnBL0YK1S5j69bAih",
    "רותם": "K7W7zLWeGoxU9YqWoB7A",
  };
  const imagePath = {
    "אבי": "/avi-avatar.png",
    "קרן": "/karen-avatar.png",
    "רותם": "/rotem-avatar.png",
  }
  async function checkIfUserLogedIn() {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/user/is-user-logged-in`,
        {
          withCredentials: true,
        }
      );

        const voiceId = response.data;

        setCurrentVoiceId(voiceId);

    } catch (e) {
      console.log("Login check error:", e);
      router.push("/login");
    }
  }
  async function handleOnChangeVoice() {
    try {
      await axios.post(
        `${API_BASE_URL}/api/user/set-voice-preference`,
        {
          voice_id: currentVoiceId,
        },
        {
          withCredentials: true,
        }
      );


      const responseAudio = await fetch("/api/voice-saved-speak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voiceId: currentVoiceId,
        }),
      });

      if (!responseAudio.ok) {
        const errorText = await responseAudio.text();
        console.log("failed to generate speech: ", errorText);
        return;
      }

      const audioBlob = await responseAudio.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error("Failed to change voice:", error);
    }
  }

  async function speakAvatarChangeRequest(voiceId, avatarName) {
    if (!voiceId || !avatarName) return;

    try {
      const response = await fetch("/api/speech-for-check-avatr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          avatarName: avatarName,
          voiceId: voiceId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log("failed to generate speech: ", errorText);
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (e) {
      console.log("error print: ", e);
    }
  }
  async function handleOnVoiceClick(voiceId, avatarName){
    setCurrentVoiceId(voiceId);
    await speakAvatarChangeRequest(voiceId, avatarName);
  }
  useEffect(() => {
    checkIfUserLogedIn();
  },[])
  return (
    <div className="flex-1">
      <button className="absolute top-6 left-6 px-4 py-3 bg-black text-xl cursor-pointer font-semibold text-white rounded-2xl"
      onClick={() => router.push("/")}> חזרה</button>
      <div className="mt-30 w-full overflow-x-auto overflow-y-hidden no-scrollbar px-6 py-4">
  <div className="flex w-max gap-4 mx-auto">
    {Object.entries(voices).map(([avatarName, voiceId]) => (
      <div key={voiceId} className="shrink-0">
        <button
          className={`p-4 rounded-xl cursor-pointer ml-2 flex flex-col items-center gap-2 w-40 border-2
            transition-all duration-200
            ${
              currentVoiceId === voiceId
                ? "bg-gray-100 border-black shadow-xl scale-105"
                : "bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md hover:scale-105"
            }`}
          onClick={() => handleOnVoiceClick(voiceId, avatarName)}
        >
          <div className="relative w-[150px] h-[200px] overflow-hidden bg-gray-200">
            <Image
              src={imagePath[avatarName]}
              alt={avatarName}
              fill
              className="object-cover"
            />
          </div>

          <span>{avatarName}</span>
        </button>
      </div>
    ))}
  </div>
</div>
      <div className="flex justify-center mt-8">
        <button className="px-13 py-4 rounded-2xl text-white font-semibold cursor-pointer
                          bg-gradient-to-r from-slate-700 to-slate-800
                          hover:from-slate-600 hover:to-slate-800
                           hover:shadow-m
                          transition-all duration-200"
                onClick={handleOnChangeVoice}>
          שמור קול
        </button>
      </div>
    </div>
  );
}