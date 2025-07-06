import { supabase, type Network, type Offer } from './supabase';

// Network operations
export async function getNetworks() {
  const { data, error } = await supabase
    .from('networks')
    .select('*')
    .order('created_at', { ascending: false });
  
  return { data, error };
}

export async function getNetworkById(id: string) {
  const { data, error } = await supabase
    .from('networks')
    .select('*')
    .eq('id', id)
    .single();
  
  return { data, error };
}

export async function createNetwork(network: Omit<Network, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('networks')
    .insert([network])
    .select()
    .single();
  
  return { data, error };
}

export async function updateNetwork(id: string, updates: Partial<Network>) {
  const { data, error } = await supabase
    .from('networks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  return { data, error };
}

export async function deleteNetwork(id: string) {
  const { error } = await supabase
    .from('networks')
    .delete()
    .eq('id', id);
  
  return { error };
}

// Offer operations
export async function getOffers() {
  const { data, error } = await supabase
    .from('offers')
    .select(`
      *,
      networks (
        id,
        name
      )
    `)
    .order('created_at', { ascending: false });
  
  return { data, error };
}

export async function getOffersByNetwork(networkId: string) {
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .eq('network_id', networkId)
    .order('created_at', { ascending: false });
  
  return { data, error };
}

export async function getOfferById(id: string) {
  const { data, error } = await supabase
    .from('offers')
    .select(`
      *,
      networks (
        id,
        name
      )
    `)
    .eq('id', id)
    .single();
  
  return { data, error };
}

export async function createOffer(offer: Omit<Offer, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('offers')
    .insert([offer])
    .select()
    .single();
  
  return { data, error };
}

export async function updateOffer(id: string, updates: Partial<Offer>) {
  const { data, error } = await supabase
    .from('offers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  return { data, error };
}

export async function deleteOffer(id: string) {
  const { error } = await supabase
    .from('offers')
    .delete()
    .eq('id', id);
  
  return { error };
}

// Search functions
export async function searchNetworks(query: string) {
  const { data, error } = await supabase
    .from('networks')
    .select('*')
    .or(`name.ilike.%${query}%,category.ilike.%${query}%`)
    .order('created_at', { ascending: false });
  
  return { data, error };
}

export async function searchOffers(query: string) {
  const { data, error } = await supabase
    .from('offers')
    .select(`
      *,
      networks (
        id,
        name
      )
    `)
    .or(`offer_name.ilike.%${query}%,vertical.ilike.%${query}%`)
    .order('created_at', { ascending: false });
  
  return { data, error };
} 