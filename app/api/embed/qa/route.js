import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/supabase/utils/server";
import { Document } from "langchain/document";

export const maxDuration = 300;

export async function POST(request, response) {
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseKey) throw new Error(`Expected SUPABASE_SERVICE_ROLE_KEY`)
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) throw new Error(`Expected env var NEXT_PUBLIC_SUPABASE_URL`)
  const client = createClient(url, supabaseKey)
  const supabase = createServerClient();

  const bodyParams = await request.json();
  const { question, answer } =  bodyParams;

  try { 
    const text = `${question}\n\n
    ${answer}
    `;

    const { data: uploadedQuestion, error } = await supabase
    .from('questions')
    .upsert({ question })
    .select()

    if(error) {
      return Response.json(
        {
          status: false,
          data: "Error occured while processing your training data. Pleases try again."
        }, 
        { status: 400 }
      )
    }

    const docs = [
      new Document({ 
        pageContent: text, 
        metadata: {
          question,
          questionId: uploadedQuestion[0].id
        }
      }),
    ];

    const vectorStore = await SupabaseVectorStore.fromDocuments(
      docs,
      new OpenAIEmbeddings(),
      {
        client,
        tableName: 'document_contents',
        queryName: 'match_documents',
      }
    )
    
    return Response.json(
      {
        status: true,
        data: "Training data processed succcessfully."
      }, 
      { status: 201 }
    )
  } catch (error) {
    return Response.json(
      {
        status: false,
        data: "Error occured while processing your training data. Pleases try again."
      }, 
      { status: 500 }
    )
  }
};