import { apiFetch } from '../../services/api';

export async function GET() {
  const token = '123'; // Dummy, it will fail 401 if we don't have a real token
  try {
    const data = await apiFetch('/api/admin/master/travel-bookings/11111111-1111-1111-1111-111111111111/status', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ booking_status: 'menunggu_pembayaran', price: 150000 })
    });
    return new Response(JSON.stringify({ status: 200, data }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }));
  }
}
