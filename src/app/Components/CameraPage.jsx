"use client";

import { useEffect, useRef } from "react";
export default function CameraPage({ sessionId }) {
  const wRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);


  async function connectWebSocket() {
    const ws = new WebSocket(
      `ws://localhost:8000/api/llm/check-face?session_id=${sessionId}`
    );

    ws.onopen = () => {
      console.log("WebSocket connected");
      // when the web socket is open i am sending every 1 sec image to the backend  
      intervalRef.current = setInterval(() => {
        captureAndSend();
      }, 1000);
    };

    ws.onmessage = async (event) => {
      console.log("Message from server:", event.data);
      const response = JSON.parse(event.data);
      if(response.success === true){
        await Speak(response.data.name?.[0], response.data.whereIsKnownFrom?.[0])
      }
    };

    ws.onclose = () => {
      console.log("websocket closed");
    };

    ws.onerror = (e) => {
      console.log("WebSocket error:", e);
    };

    wRef.current = ws;
  }

  async function enableCamera() {
    try {
      console.log("Trying to open camera...");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      console.log("Camera stream:", stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (e) {
      console.log("Camera error:", e);
    }
  }

  function captureAndSend() {
    console.log("sendig image");
    if (!videoRef.current || !canvasRef.current || !wRef.current) return;

    if (wRef.current.readyState !== WebSocket.OPEN) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    // give me access to paint in the canvas which mean bring me access to take a photo
    const ctx = canvas.getContext("2d");

    // adjusting the canvas to fit the video resolution
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // take the image
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // convert the canvas to image bytes format
    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        if (wRef.current?.readyState === WebSocket.OPEN) {
          wRef.current.send(blob);
        }
      },
      "image/jpeg",
      0.85
    );
  }
  async function Speak(name, whereIsKnownFrom){
      if (!name || !whereIsKnownFrom) return;
     const response = await fetch("/api/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        whereIsKnownFrom,
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

    return () => {
      console.log("camera cleanup");

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (wRef.current) {
        wRef.current.close();
      }

      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
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