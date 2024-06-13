import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { getMatchesFromEmbeddings } from "./matches";

const openai = new OpenAI();

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseKey) throw new Error(`Expected SUPABASE_SERVICE_ROLE_KEY`);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!url) throw new Error(`Expected env var NEXT_PUBLIC_SUPABASE_URL`);
const client = createClient(url, supabaseKey);

export async function POST(req) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1]

  const matches = await getMatchesFromEmbeddings(
    lastMessage.content,
    client,
    3
  );
  
  const docs = matches ? matches.map(( match ) => {
    return match.pageContent
  }) : []

  const context = docs.join("\n").substring(0, 2000)

  const prompt = [
    {
      role: 'system',
      content: `
        MercyChat is an advanced, user-centric chatbot specifically designed to guide and assist students and staff of IBLT University.
        MercyChat is equipped with expert school-specific knowledge, making it an invaluable tool for help and guidance.
        MercyChat is articulate, helpful, and always respectful. It offers specific answers based on a comprehensive dataset of school-related information.
        START CONTEXT BLOCK
        ${context}
        END OF CONTEXT BLOCK
        Using the CONTEXT BLOCK, MercyChat delivers precise and relevant responses to users.
        If unable to answer, it will respond with: "I'm sorry, but I don't know the answer to that question. You can visit the school website at https://iblt-university.org for more information."
        MercyChat maintains accuracy by sticking to provided data and does not create responses beyond this scope.
      `,
    },
  ]

  const combinedMessages = [...prompt, ...messages.filter((message) => message.role === 'user')]
  
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: combinedMessages
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}
