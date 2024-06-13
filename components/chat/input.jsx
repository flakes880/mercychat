"use client";

import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import NewClient from "./new-client";

export default function ChatInput({ 
  setIsWaitingForResponse, 
  setIsGenerating, 
  isGenerating,
  append,
  clientInfo, 
  setClientInfo,
  setIsErrorOccurred
}) {
  const [input, setInput] = useState("");
  const [isOpenNewClient, setIsOpenNewClient] = useState(false);

  const inputLength = input.trim().length;

  const onSubmit = (event) => {
    event.preventDefault();
    submitMessage();
  }

  const submitMessage = () => {
    if (inputLength === 0) return;

    if(!clientInfo) {
      setIsOpenNewClient(true);
      return ;
    }
    
    setIsErrorOccurred(false);
    setIsWaitingForResponse(true);  
    setIsGenerating(true);

    append({  
      role: "user",
      content: input,
    });

    setInput("");
  };

  useEffect(() => {
    if (!isOpenNewClient && inputLength !== 0) {
      submitMessage();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenNewClient])  
  

  return (
    <>
      <div className="relative w-full">
        {isGenerating && (
          <div className="absolute  w-full -top-[30px]">
            <div className="bg-primary text-primary-foreground border border-stone-50 rounded w-fit mx-auto px-4 py-[2px] text-sm mb-1">
              <div className="flex justify-center items-center">
                <Loader className="h-4 w-4 mr-1" />
                Generating...
              </div>
            </div>
          </div>
        )}

        <form
          onSubmit={onSubmit}
          className="flex w-full items-center space-x-2"
        >
          <Input
            id="message"
            placeholder="Type your message..."
            className="flex-1"
            autoComplete="off"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <Button type="submit" size="icon" disabled={inputLength === 0}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>

      { isOpenNewClient &&  
        <NewClient 
          setClientInfo={setClientInfo}
          setIsOpenNewClient={setIsOpenNewClient}
        />
      }
    </>
  );
}
