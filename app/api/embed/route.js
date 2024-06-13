import { WebPDFLoader } from "langchain/document_loaders/web/pdf";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const maxDuration = 300;

export async function POST(request, response) {
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseKey) throw new Error(`Expected SUPABASE_SERVICE_ROLE_KEY`)
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) throw new Error(`Expected env var NEXT_PUBLIC_SUPABASE_URL`)
  const client = createClient(url, supabaseKey)

  const bodyParams = await request.json();
  const { filePath, fileType, storageId } =  bodyParams;

  try { 
    const { data: docs, error } = await fetch (
      filePath.signedUrl,
      {
        method: 'GET',
        headers: { 'Accept': '*/*' }
      }
    )
    .then ((res) => res.blob())
    .then (async (blob) => {
      let loader;
      if(fileType == "application/pdf") {
        loader = new WebPDFLoader(blob, {
          parsedItemSeparator: "",
        });
      } else {
        loader = new DocxLoader(blob)
      }

      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      const docs = await loader.load();

      const resplitDocs = await splitter.splitDocuments(docs);

      const addedMetadataDocs = resplitDocs.map((doc) => {
        doc.metadata["storageId"] = storageId;
        return doc;
      })

      return {
        data: addedMetadataDocs,
        error: null
      }
    }).catch(error => {
      return {
        data: null,
        error
      }
    })

    if(error) {
      return Response.json(
        {
          status: false,
          data: "Error occured while processing your training data. Pleases try again."
        }, 
        { status: 500 }
      )
    }

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