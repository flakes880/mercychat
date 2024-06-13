import { useRef, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import {
  CircleUser
} from "lucide-react"

export default function ChatMessages({ 
  clientInfo, 
  messages, 
  isWaitingForResponse, 
  isErrorOccurred
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({
      block: 'end',
      behavior: 'smooth',
    })
  }, [messages])

  return (
    <div ref={messagesEndRef}>
      <div className="flex items-start space-x-2 mb-3 mt-3">
        <div className="rounded-full bg-secondary h-10 w-10  flex justify-center items-center">
          <CircleUser className="h-6 w-6 text-primary" />
        </div>
        <div
          className={
            "flex w-fit max-w-[80%] flex-col rounded-lg px-3 py-2 text-sm bg-orange-200"
          }
        >
          <p>
            {clientInfo && clientInfo.name ?
              <span>
                Hello <strong>{clientInfo.name}</strong>, welcome to
              </span>
            : "Welcome to"
            }
            <strong> MercyChat</strong> your number 1 IBLT University chatbot. I am your IBLT school guide. 
            Ask me anything about{" "}
            <strong>IBLT University.</strong>
          </p>
        </div>
      </div>

      {messages.map((message, index) => (
        <div 
          className={cn(
            "flex items-start space-x-2 mb-3 mt-3", 
            message.role === "user"
              ? "justify-end"
              : "justify-start"
          )} 
          key={index}
        >
          { message.role !== "user" && 
            <div className="rounded-full bg-secondary h-10 w-10  flex justify-center items-center">
              <CircleUser className="h-6 w-6 text-primary" />
            </div> 
          }

          <div
            className={cn(
              "flex w-fit max-w-[80%] flex-col rounded-lg px-3 py-2 text-sm mb-3",
              message.role === "user"
                ? "ml-auto bg-primary text-primary-foreground"
                : "bg-orange-200"
            )}
          >
            <ReactMarkdown className="markdown_style">
              {message.content}
            </ReactMarkdown>
          </div>

          { message.role === "user" && 
            <div className="rounded-full bg-secondary h-10 w-10  flex justify-center items-center">
              <CircleUser className="h-6 w-6 text-primary" />
            </div>
          }
        </div>
      ))}

      {isWaitingForResponse && (
        <div className="flex items-start space-x-2 mb-3 mt-3">
          <div className="rounded-full bg-secondary h-10 w-10  flex justify-center items-center">
            <CircleUser className="h-6 w-6 text-primary" />
          </div> 
          <Skeleton className="h-20 w-[80%] rounded-lg bg-muted mb-4 bg-orange-200" />
        </div>
      )}

      { isErrorOccurred &&
        <div className="flex items-center space-x-2 mb-3 mt-3">
          <div className="rounded-full bg-red-200 h-10 w-10  flex justify-center items-center">
            <CircleUser className="h-6 w-6 text-red-400" />
          </div>
          <div className={"flex w-fit max-w-[80%] flex-col rounded-lg px-3 py-2 text-sm bg-red-200"}>
            <p>
              Error occured while processing your request. Please try again!
            </p>
          </div>
        </div>
      }


    </div>
  );
}
