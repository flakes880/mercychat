/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Link from "next/link"
import { 
  BotIcon,
} from "@/components/icon"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";
import { createClient } from "@/supabase/utils/clients";
import { toast } from "@/components/ui/use-toast";
import { SpinIcon } from "@/components/icon";
import Notification from "./notification"
import { useSearchParams } from 'next/navigation'

export default function Navbar() {
  const supabase = createClient();
  const [ isAuthenticated, setIsAuthenticated ] = useState(false);
  const [ isLoggingOut, setIsLoggingOut ] = useState(false);
  const [ notificationMessage, setNotificationMessage ] = useState("");

  const messageParams = useSearchParams();
  const message = messageParams.get('message');
  
  const userSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();

    if( !session || error ) {
      setIsAuthenticated(false);
      return ;
    } 

    setIsAuthenticated(true);
    return ;
  }

  const logout = async () => {
    setIsLoggingOut(true);

    const { error } = await supabase.auth.signOut();

    setIsLoggingOut(false);

    if(error) {
      toast({
        variant: "destructive",
        description:
          "Logout is unsuccessful. Please try again.",
      }); 
      return ;
    } 

    setIsAuthenticated(false);
  }

  const closeNotification = () => {
    setNotificationMessage("")
  }

  useEffect(() => {
    userSession();
  }, [])

  useEffect(() => {
    if(message === "register") {
      setNotificationMessage("Email confirmation required. Proceed to your email app for confirmation.");
    } else if (message === "confirm-email") {
      setNotificationMessage("Your email has been confirmed successfully.");
    }
  }, [])
  
  return (
    <>
      { notificationMessage &&
        <Notification
          closeNotification={closeNotification}
          notificationMessage={notificationMessage}
        />
      }
      <header className="flex h-16 items-center justify-between px-6 lg:px-12">
        <Link className="flex items-center" href="/">
          <BotIcon className="h-8 w-8" />
          <span className="ml-2 text-lg font-medium text-[#FF6B00]">MercyChat</span>
        </Link>

        { isAuthenticated ?
          <div>
            <Button
              className="rounded-md bg-[#FF6B00] px-4 py-2 text-sm font-medium text-gray-50 transition-colors hover:bg-[#FF8533] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF6B00] disabled:pointer-events-none disabled:opacity-50 dark:bg-[#FF6B00] dark:text-gray-900 dark:hover:bg-[#FF8533] dark:focus-visible:ring-[#FF6B00]"
              onClick={logout}
              disabled={isLoggingOut}
            >
              { isLoggingOut ? 
                <>
                  <SpinIcon />
                  {"Logging Out"}
                </>
              : "Logout" }
            </Button>
          </div>
          :
          <div className="flex items-center space-x-4">
            <Link
              className="rounded-md bg-[#FF6B00] px-4 py-2 text-sm font-medium text-gray-50 transition-colors hover:bg-[#FF8533] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF6B00] disabled:pointer-events-none disabled:opacity-50 dark:bg-[#FF6B00] dark:text-gray-900 dark:hover:bg-[#FF8533] dark:focus-visible:ring-[#FF6B00]"
              href="/login"
            >
              Login
            </Link>
            <Link
              className="rounded-md border border-[#FF6B00] bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF6B00] disabled:pointer-events-none disabled:opacity-50 dark:border-[#FF6B00] dark:bg-gray-950 dark:hover:bg-[#FF8533] dark:hover:text-gray-50 dark:focus-visible:ring-[#FF6B00]"
              href="/register"
            >
              Register
            </Link>
          </div>
        }
      </header>
    </>
  )
}
