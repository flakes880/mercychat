import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(req) {
  const { messages } = await req.json();
  
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: messages
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}
