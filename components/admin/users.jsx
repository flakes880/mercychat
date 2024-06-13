"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area"
import MakeAdmin from "./make-admin"

export default function Users({ usersData, supabase }) {
  function truncate(str, limit) {
    if (str.length <= limit) {
      return str;
    }
    return str.substring(0, limit - 3) + "..."; 
  }
  return (
    <Card className="shadow-md">
        <CardTitle className="text-center mt-4 mb-1">Users Management</CardTitle>
      <CardContent>
        <ScrollArea className="h-72 w-full">
          {!usersData || !usersData.length ?
            <p className="text-center text-gray-800 font-medium mt-2">No users found.</p>
          : usersData.map((user, key) => (
            <div className="flex justify-between items-center my-2" key={key}>
              <div className="flex flex-col my-0.5 w-[calc(100%-120px)]" key={key}>
                <p className="font-medium leading-none">
                  {truncate(user.name, 45)}
                </p>
                <p className="text-sm leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
              <div className="w-[120px] flex justify-end">
                <MakeAdmin user={user}  supabase={supabase} />
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
