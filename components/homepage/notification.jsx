"use client";

import { X } from "lucide-react";

export default function Notification({ 
  notificationMessage,
  closeNotification 
}) {
  
  return (
    <>
      <div className="bg-[#FFF5ED] py-2 px-3 flex items-center justify-center space-x-2">
        <p className="">
          {notificationMessage}
        </p>
        <X 
          className="h-4 w-4 text-[#FF6B00]" 
          onClick={closeNotification}
        />
      </div>
    </>
  )
}
