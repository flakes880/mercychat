"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/supabase/utils/server";

export async function signup(formData) {
  const supabase = createClient();

  const data = {
    email: formData["email"],
    password: formData["password"],
    options: {
      emailRedirectTo: process.env.VERCEL_URL,
      data: {
        name: formData["name"],
      }
    }
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) return error.message;

  revalidatePath("/?message=register", "layout");
  redirect("/?message=register");
}
