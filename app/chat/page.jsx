/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInput, ChatMessages } from "@/components/chat";
import { useChat } from "ai/react";

export default function Chat() {
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [clientInfo, setClientInfo] = useState("");
  const [isErrorOccurred, setIsErrorOccurred] = useState(false);

  const handleOnResponse = () => {
    setIsWaitingForResponse(false);
  };

  const handleOnError = (error) => {
    setIsErrorOccurred(true);
    setIsWaitingForResponse(false);
    setIsGenerating(false);
  };

  const handleOnFinish = () => {
    setIsGenerating(false);
  };

  const { messages, setMessages, append  } = useChat({
    api: "/api/chat",
    onError: handleOnError,
    onResponse: handleOnResponse,
    onFinish: handleOnFinish,
  });

  useEffect(() => {
    const clientData = JSON.parse(localStorage.getItem("clientInfo"));
    if (clientData && clientData.name) {
      setClientInfo(clientData);
    }
  }, []);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if(
      lastMessage &&
      lastMessage.role === "assistant" && 
      lastMessage.content.includes("<!DOCTYPE html>")
    ) {
      setIsErrorOccurred(true);
      const newMessage = messages;
      newMessage.pop();
      setMessages(newMessage)
    }
  }, [messages])
  

  return (
    <main className="">
      <h1 className="text-center font-semibold text-lg mb-2 mt-3">
        MercyChat (IBLT University Chatbot)
      </h1>
      <section className="w-full flex justify-center h-[cal(100vh-80px)]">
        <Card className="w-[90%] max-w-[600px] shadow-md py-0 relative">
          <ScrollArea className="w-full sm:h-[calc(100vh-110px)] h-[calc(100vh-160px)] mb-1">
            <CardContent>
              <ChatMessages
                clientInfo={clientInfo}
                messages={messages}
                isWaitingForResponse={isWaitingForResponse}
                isErrorOccurred={isErrorOccurred}
              />
            </CardContent>
          </ScrollArea>
          <CardFooter className="!pb-3 px-4">
            <ChatInput
              setIsWaitingForResponse={setIsWaitingForResponse}
              setIsGenerating={setIsGenerating}
              append={append}
              isGenerating={isGenerating}
              clientInfo={clientInfo}
              setClientInfo={setClientInfo}
              setIsErrorOccurred={setIsErrorOccurred}
            />
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}
