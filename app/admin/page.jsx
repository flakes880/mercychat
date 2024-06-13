"use server";

import AdminComponent from "@/components/admin";
import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { createClient } from "@/supabase/utils/server";

export default async function AdminPage() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  async function fetchUserProfile() {
    if (error || !user) {
      return null;
    }
    const userId = user.id;
    let { data } = await supabase
      .from("profile")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    return data;
  }

  const profile = await fetchUserProfile();

  return (
    <main className="flex items-center justify-center h-screen ">
      {["admin"].includes(profile?.role) ? (
        <AdminComponent />
      ) : (
        <Card className="shadow-md w-[80%] max-w-[450px] h-[420px] flex flex-col justify-center items-center bg-gray-200/30">
          <Lock className="h-16 w-16 mb-3" />
          <p className="font-medium">Admin Access Required</p>
        </Card>
      )}
    </main>
  );
}
