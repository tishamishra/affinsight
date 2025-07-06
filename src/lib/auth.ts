import { supabase } from './supabase';

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function isAdminUser(email: string): Promise<boolean> {
  // Check if user email is in the allowed admin list
  const adminEmails = ['vishal@yourdomain.com']; // Add more admin emails as needed
  return adminEmails.includes(email);
}

export async function checkAdminAccess(): Promise<boolean> {
  const { user } = await getCurrentUser();
  if (!user?.email) return false;
  
  return await isAdminUser(user.email);
} 