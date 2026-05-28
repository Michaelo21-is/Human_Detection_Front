import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { avatarName ,voiceId } = await req.json();
    
    const apiKey = process.env.ELEVEN_LABELS_API_KEY;

    if (!voiceId || !apiKey) {
      return NextResponse.json(
        { message: "Missing VOICE_ID or ELEVEN_LABELS_API_KEY" },
        { status: 500 }
      );
    }

    const text = `$שלום כאן {avatarName} ןאני אשמח אם תבחר בי`;

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_v3",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log("ElevenLabs error:", errorText);

      return NextResponse.json(
        {
          error: "Failed to generate audio",
          details: errorText,
        },
        { status: 500 }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (e) {
    console.error("Speech route error:", e);

    return NextResponse.json(
      {
        message: "failed to generate speech",
        error: e.message,
      },
      { status: 500 }
    );
  }
}