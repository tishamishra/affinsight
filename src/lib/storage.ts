import { supabase } from './supabase';

export async function uploadLogo(file: File): Promise<{ url: string; error: unknown }> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `logos/${fileName}`;

  const { error } = await supabase.storage
    .from('logos')
    .upload(filePath, file);

  if (error) {
    return { url: '', error };
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('logos')
    .getPublicUrl(filePath);

  return { url: publicUrl, error: null };
}

export async function deleteLogo(filePath: string): Promise<{ error: unknown }> {
  const { error } = await supabase.storage
    .from('logos')
    .remove([filePath]);

  return { error };
} 