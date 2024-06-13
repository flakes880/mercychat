"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadFile from "./file";
import UploadQA from "./qa";
import Documents from "./documents";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/supabase/utils/clients";
import { toast } from "@/components/ui/use-toast";

export default function UploadComponent() {
  const supabase = createClient();
  const { data: documents } = useQuery(["files"], async () => {
    const { data: documentData, error: documentError } = await supabase.from("documents").select().order('created_at', { ascending: false }) ;
    const { data: questionData, error: questionError } = await supabase.from("questions").select().order('created_at', { ascending: false });

    if (documentError || questionError) {
      toast({
        variant: "destructive",
        description: "Failed to fetch documents",
      });
      throw documentError || questionError;
    }

    const modDocuments = documentData.map((data) => {
      return {
        id: data.id,
        name: data.name,
        type: "document"
      }
    })

    const modQuestions = questionData.map((data) => {
      return {
        id: data.id,
        name: data.question,
        type: "question"
      }
    })

    return [
      ...modQuestions,
      ...modDocuments
    ];
  });

  return (
    <Tabs defaultValue="file" className="w-[80%] max-w-[450px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="file">Upload File</TabsTrigger>
        <TabsTrigger value="qa">Upload Q&A</TabsTrigger>
        <TabsTrigger value="documents">Training Data</TabsTrigger>
      </TabsList>
      <TabsContent value="file">
        <UploadFile supabase={supabase} />
      </TabsContent>
      <TabsContent value="qa">
        <UploadQA />
      </TabsContent>
      <TabsContent value="documents">
        <Documents documents={documents} supabase={supabase} />
      </TabsContent>
    </Tabs>
  );
}
