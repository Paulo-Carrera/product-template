import { getSupabaseClient } from './client.js';
const supabase = getSupabaseClient();

export async function insertOrder({ product_name, status, email, stripe_session_id }) {
  const { data, error } = await supabase
    .from('orders')
    .insert([{ product_name, status, email, stripe_session_id }]);

  if (error) console.error('❌ Supabase insert error:', error);
  return data;
}