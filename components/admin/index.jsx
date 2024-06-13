"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Users from "./users";
import Visitors from "./visitors";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/supabase/utils/clients";
import { toast } from "@/components/ui/use-toast";

export default function AdminComponent() {
  const supabase = createClient();
  const { data: users } = useQuery(["users"], async () => {
    const { data, error } = await supabase.from("profile").select().order('created_at', { ascending: false }) ;

    if (error) {
      toast({
        variant: "destructive",
        description: "Failed to fetch users",
      });
      throw error;
    }

    return data;
  });

  const { data: visitors } = useQuery(["visitors"], async () => {
    const { data, error } = await supabase.from("visitors").select().order('created_at', { ascending: false }) ;

    if (error) {
      toast({
        variant: "destructive",
        description: "Failed to fetch visitors",
      });
      throw error;
    }

    return data;
  });

  return (
    <Tabs defaultValue="users" className="w-[80%] max-w-[450px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="visitors">Visitors</TabsTrigger>
      </TabsList>
      <TabsContent value="users">
        <Users usersData={users} supabase={supabase} />
      </TabsContent>
      <TabsContent value="visitors">
        <Visitors visitorData={visitors} />
      </TabsContent>
    </Tabs>
  );
}
