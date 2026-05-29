"use client";

import { useState } from "react";
import axios from "axios";

export default function ChangeVoice({ currentVoiceId }) {
  const [currentVoice, setCurrentVoice] = useState(currentVoiceId);

  const voices = {
    "אבי": "2V7k6GOisfFlHlBdz8ec",
    "קרן": "uIZsnBL0YK1S5j69bAih",
    "רותם": "K7W7zLWeGoxU9YqWoB7A",
  };

  async function handleOnChangeVoice(voiceId) {
    try {
      await axios.post(
        "/api/user/set-voice-preference",
        {
          voice_id: voiceId,
        },
        {
          withCredentials: true,
        }
      );

      setCurrentVoice(voiceId);

      const responseAudio = await fetch("/api/voice-saved-speak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voiceId: voiceId,
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

  return (
    <div className="flex-1">
      <div className="mt-30 flex  gap-4 justify-center">
        {Object.entries(voices).map(([avatarName, voiceId]) => (
          <div key={voiceId}>
            

            <button
              className="p-4 rounded-xl border bg-gray-100 ml-2"
              onClick={() => speakAvatarChangeRequest(voiceId, avatarName)}
            >
              {avatarName}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}