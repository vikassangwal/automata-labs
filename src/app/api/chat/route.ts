import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;

    // Fallback if API key is not configured
    if (!apiKey) {
      return NextResponse.json({ 
        reply: "Sorry, the AI is sleeping right now. Please configure the OPENROUTER_API_KEY environment variable to wake me up! 😊" 
      });
    }

    // Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://localhost:3000", 
        "X-Title": "Anti Gravity Chatbot", 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash", // Fast and cheap model
        messages: [
          {
            role: "system",
            content: "You are a helpful, professional, and friendly AI assistant for 'Anti Gravity 2.0', a web development and AI automation agency. Answer briefly and concisely in Hinglish or English based on the user's language."
          },
          ...messages
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API Error:", errorText);
      return NextResponse.json({ 
        reply: "Apologies, I am experiencing a technical issue right now." 
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No response generated.";

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { reply: "An error occurred while connecting to the AI." },
      { status: 500 }
    );
  }
}
