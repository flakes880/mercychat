'use server'

import { createClient } from '@/supabase/utils/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function logout () {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) return error;

  revalidatePath('/login', 'layout')
  redirect('/login')
}