import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body?.message;
    if (!query) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }
    
    // Connect to the local FastAPI server (from fastapi_retrieval.py)
    const fastApiResponse = await fetch("https://aptos-fastapi.onrender.com/chat_endpoint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });
    
    if (!fastApiResponse.ok) {
      return NextResponse.json(
        { error: "Error from FastAPI server" },
        { status: fastApiResponse.status }
      );
    }
    
    const data = await fastApiResponse.json();
    console.log(data);
    // Return the content received from FastAPI (assumed to be under the "content" key)
    return NextResponse.json({ response: data });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}