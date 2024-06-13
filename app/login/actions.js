"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/supabase/utils/server";

export async function login(formData) {
  const supabase = createClient();

  const data = {
    email: formData["email"],
    password: formData["password"],
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) return error.message;

  revalidatePath("/", "layout");
  redirect("/");
}
