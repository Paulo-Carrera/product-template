import { getSupabaseClient } from './client.js';

export async function insertOrder({ productName, status, email, stripeSessionId }) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from('orders').insert([
    {
      product_name: productName,
      status,
      email,
      stripe_session_id: stripeSessionId,
    }
  ]);
  if (error) console.error('Supabase insert error:', error);
}