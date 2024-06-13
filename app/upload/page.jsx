"use server";

import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";
import UploadComponent from "@/components/upload";
import { createClient } from "@/supabase/utils/server";

export default async function UploadPage() {
  const supabase = createClient();
  const {
    data: {
      user: { id: userId },
    },
    error,
  } = await supabase.auth.getUser();

  async function fetchUserProfile() {
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
        <UploadComponent />
      ) : (
        <Card className="shadow-md w-[80%] max-w-[450px] h-[420px] flex flex-col justify-center items-center bg-gray-200/30">
          <Lock className="h-16 w-16 mb-3" />
          <p className="font-medium">Admin Access Required</p>
        </Card>
      )}
    </main>
  );
}
