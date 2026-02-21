import { api } from '@/shared/api/base';
import { queryClient } from '@/shared/api/query-client';
import { IS_AUTH_MARKER } from '@/shared/config';

export async function signOut() {
  try {
    await api.post('/auth/logout');
  } catch (e) {
    console.error('Logout API failed', e);
  } finally {
    queryClient.clear();
    localStorage.removeItem(IS_AUTH_MARKER);
  }
}
