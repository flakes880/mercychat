"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Visitors({ visitorData }) {
  function truncate(str, limit) {
    if (str.length <= limit) {
      return str;
    }
    return str.substring(0, limit - 3) + "..."; 
  }
  return (
    <Card className="shadow-md">
      <CardTitle className="text-center mt-4 mb-1">Visitors Management</CardTitle>
      <CardContent>
        <ScrollArea className="h-72 w-full">
          {!visitorData || !visitorData.length ?
            <p className="text-center text-gray-800 font-medium mt-2">No visitors found.</p>
          : visitorData.map((visitor, key) => (
            <div className="flex flex-col  my-2" key={key}>
              <p className="font-medium">
                {truncate(visitor.name, 70)}
              </p>
              <p className="text-sm leading-none text-muted-foreground">
                {visitor.email}
              </p>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
