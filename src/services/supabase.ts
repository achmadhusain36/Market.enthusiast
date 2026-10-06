import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    !supabaseUrl.includes('placeholder')
);

// Fallback Mock Client when live Supabase credentials have not been configured yet
class MockSupabaseAuth {
  async signUp({ email, password, options }: any) {
    const user = {
      id: `usr_${Date.now()}`,
      email,
      user_metadata: options?.data || { username: email.split('@')[0], role: 'user' },
      created_at: new Date().toISOString(),
    };
    localStorage.setItem('me_auth_session', JSON.stringify({ user, token: 'mock-jwt-token' }));
    return { data: { user, session: { access_token: 'mock-jwt-token' } }, error: null };
  }

  async signInWithPassword({ email }: any) {
    const role = email.toLowerCase().includes('admin') ? 'admin' : 'user';
    const user = {
      id: `usr_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email,
      user_metadata: {
        username: email.split('@')[0],
        role,
        full_name: role === 'admin' ? 'Market Administrator' : 'Market Enthusiast',
      },
    };
    localStorage.setItem('me_auth_session', JSON.stringify({ user, token: 'mock-jwt-token' }));
    return { data: { user, session: { access_token: 'mock-jwt-token' } }, error: null };
  }

  async signOut() {
    localStorage.removeItem('me_auth_session');
    localStorage.removeItem('nusa_auth_session');
    return { error: null };
  }

  async resetPasswordForEmail() {
    return { data: {}, error: null };
  }

  async getSession() {
    const raw = localStorage.getItem('me_auth_session') || localStorage.getItem('nusa_auth_session');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        return { data: { session: parsed }, error: null };
      } catch (e) {}
    }
    return { data: { session: null }, error: null };
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return {
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    };
  }
}

class MockSupabaseQueryBuilder {
  private table: string;
  constructor(table: string) {
    this.table = table;
  }
  select() { return this; }
  insert(data: any) { return { data, error: null }; }
  update(data: any) { return { data, error: null }; }
  delete() { return { data: null, error: null }; }
  eq() { return this; }
  order() { return this; }
  limit() { return this; }
  async single() { return { data: null, error: null }; }
  async then(resolve: (val: any) => void) {
    resolve({ data: [], error: null });
  }
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : ({
      auth: new MockSupabaseAuth(),
      from: (table: string) => new MockSupabaseQueryBuilder(table),
    } as any);
