"use client";

import { useEffect, useRef } from "react";

export default function CameraPage({ sessionId, voiceId, wsRef }) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const wRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const streamRef = useRef(null);

  async function connectWebSocket() {
    const wsBaseUrl = API_BASE_URL.replace("https://", "wss://");

    const socket = new WebSocket(
      `${wsBaseUrl}/api/llm/check-face`
    );

    wRef.current = socket;

    if (wsRef) {
      wsRef.current = socket;
    }

    socket.onopen = () => {
      console.log("WebSocket connected");

      intervalRef.current = setInterval(() => {
        captureAndSend();
      }, 1500);
    };

    socket.onmessage = async (event) => {
      console.log("Message from server:", event.data);

      const response = JSON.parse(event.data);

      if (response.success === true) {
        await speakPersonInfo(
          response.data.name?.[0],
          response.data.whereIsKnownFrom?.[0]
        );
      }
    };

    socket.onclose = () => {
      console.log("web socket closed")
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

       if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });

        streamRef.current = null;
      }

      // לעצור גם את ה-stream שמחובר ל-video עצמו
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject;

        stream.getTracks().forEach((track) => {
          track.stop();
        });

        videoRef.current.pause();
        videoRef.current.srcObject = null;
        videoRef.current.load();
      }
    };

    socket.onerror = (e) => {
      console.log("WebSocket error:", e);
    };
  }

  async function enableCamera() {
    try {
      console.log("Trying to open camera...");

     const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
        },
        audio: false,
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (e) {
      console.log("Camera error:", e);
    }
  }
  
  function captureAndSend() {

    if (!videoRef.current || !canvasRef.current || !wRef.current) return;

    if (wRef.current.readyState !== WebSocket.OPEN) return;

    console.log("sending image");

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 640;
    canvas.height = 640;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        if (wRef.current?.readyState === WebSocket.OPEN) {
          wRef.current.send(blob);
        }
      },
      "image/jpeg",
      0.6
    );
  }

  async function speakPersonInfo(name, whereIsKnownFrom) {
    if (!name || !whereIsKnownFrom) return;

    if (!voiceId) {
      console.log("No voiceId yet");
      return;
    }

    const response = await fetch("/api/speech-person-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        whereIsKnownFrom,
        voiceId,
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
    audio.play();
  }

  useEffect(() => {

    async function initializeComponent() {
      await enableCamera();
      await connectWebSocket();
    }

    initializeComponent();

  }, []);

  return (
    <div className="fixed inset-0 bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-screen w-screen object-cover"
      />

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}