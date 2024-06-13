"use client";

import { useDropzone } from "react-dropzone";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { UploadIcon } from "@/components/icon";
import OverlayLoader from "@/components/loader/overlay";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export default function UploadFile({ supabase }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStage, setUploadStage] = useState(0)

  const overlayMessage = [
    {
      text_1: "Uploading document to the database.",
      text_2: "Relax and wait this might take up to a minute.",
    },
    {
      text_1: "Processing the document to train the chatbot.",
      text_2: "It is almost done. This might also take up to a minute.",
    },
  ]

  const { getRootProps, getInputProps, open, isDragActive, isDragReject  } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop: (acceptedFiles) => {
      setSelectedFiles(acceptedFiles);
    },
    accept: {
      'application/msword': ['.doc', '.docx'],
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  });

  
  const onUpload = async () => {
    const selectedFile = selectedFiles[0];

    if (selectedFile) {
      setUploading(true);
      const { error, data } = await supabase.storage
        .from("files")
        .upload(`${crypto.randomUUID()}/${selectedFile.name}`, selectedFile);

      if (error) {
        setUploading(false);
        toast({
          variant: "destructive",
          description:
            "There was an error uploading the training data. Please try again.",
        });
        return;
      }

      if (data) {
        setUploadStage(1)
        const { data: fileUrl, error: fileUrlError } = await supabase.storage
          .from('files')
          .createSignedUrl(data.path, 300);

        await onEmbedData(fileUrl, selectedFile.type, data.id);
        return;
      }
    }
  };

  const onEmbedData = async (filePath, fileType, storageId) => {
    await fetch("/api/embed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify({
        filePath,
        fileType,
        storageId
      }), 
    })
      .then((response) => response.json())
      .then((data) => {
        setUploading(false);
        setUploadStage(0)
        if(!data.status) {
          toast({
            variant: "destructive",
            description:
              "Error occured while processing your training data. Pleases try again.",
          });
        }

        setSelectedFiles([]);
        toast({
          description:
            "Your training data has been uploaded successfully.",
        });
      })
    return ;
  }

  useEffect(() => {
    if(isDragReject) {
      toast({
        variant: "destructive",
        description:
          "Only PDF and Word document are accepeted",
      });
      return  ;
    }
  }, [isDragReject])
  

  return (
    <Card className="shadow-md px-4 relative">
      <CardHeader>
        <CardTitle className="text-center">Upload your Training Document</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center" {...getRootProps()}>
          <label 
            className={cn(
              "relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-6 sm:p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer",
              isDragActive && "bg-gray-100"
            )}>
            <UploadIcon />
            <input
              {...getInputProps({
                onClick: (event) => event.stopPropagation(),
              })}
            />
            <span className="mt-2 sm:mt-2 block text-xs sm:text-sm font-semibold text-gray-800">
              {selectedFiles.length > 0
                ? selectedFiles.map((file) => file.name).join(", ")
                : "Drag and drop or click to select files to upload"}
            </span>
          </label>
        </div>

        <div className="text-center">
          <Button type="button" className="mt-5 px-7  w-full" onClick={onUpload}>
            Upload Data
          </Button>
        </div>

        { uploading && (
          <OverlayLoader>
            <p className="text-base text-gray-700 font-bold mb-1 mt-3 text-center">
              {overlayMessage[uploadStage].text_1}
            </p>
            <p className="text-sm text-gray-700 font-semibold text-center">
              {overlayMessage[uploadStage].text_2}
            </p>
          </OverlayLoader>
        )}
      </CardContent>
    </Card>
  );
}
