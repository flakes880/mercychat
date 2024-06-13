"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area"
import DeleteDocuments from "./delete-document"
import { useState } from "react";

export default function Documents({ documents, supabase }) {
  const [ trainingData, setTrainingData ] = useState(documents)
  
  function truncate(str, limit) {
    if (str.length <= limit) {
      return str;
    }
    return str.substring(0, limit - 3) + "..."; 
  }
  return (
    <Card className="shadow-md">
      <ScrollArea className="h-72 w-full px-4 py-2">
        {!trainingData || !trainingData.length ?
          <p className="text-center text-gray-800 font-medium mt-2">No training data found </p>
        : trainingData.map((document, key) => (
          <div className="flex justify-between items-center my-2" key={key}>
            <p className="w-[calc(100%-65px)]">
              {truncate(document.name, 40)}
            </p>
            <div className="w-[65px]">
              <DeleteDocuments 
                document={document}  
                supabase={supabase} 
                trainingData={trainingData}
                setTrainingData={setTrainingData}
              />
            </div>
          </div>
        ))}
      </ScrollArea>
    </Card>
  );
}
