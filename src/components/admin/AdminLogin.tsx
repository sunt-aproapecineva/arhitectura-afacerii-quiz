import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Lock } from 'lucide-react';

interface AdminLoginProps {
  onAuthenticated: () => void;
}

export function AdminLogin({ onAuthenticated }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError('Email sau parolă incorectă');
      setLoading(false);
    } else {
      onAuthenticated();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#111827',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Arimo', sans-serif",
    }}>
      <form onSubmit={handleLogin} style={{
        background: '#162430',
        border: '1px solid #203546',
        borderRadius: 12,
        padding: '40px 32px',
        width: '100%',
        maxWidth: 380,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <Lock size={32} style={{ color: '#0A9678', margin: '0 auto 12px' }} />
          <h1 style={{
            fontFamily: "'Archivo Narrow', sans-serif",
            fontWeight: 700,
            fontSize: 20,
            color: '#E0F4F0',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            Admin Panel
          </h1>
          <p style={{ fontSize: 13, color: '#4a8a7e', marginTop: 4 }}>
            Autentifică-te pentru a accesa completările
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 6,
            padding: '8px 12px',
            fontSize: 13,
            color: '#ef4444',
          }}>
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{
            padding: '10px 14px',
            borderRadius: 6,
            border: '1px solid #203546',
            background: '#0B1319',
            color: '#E0F4F0',
            fontSize: 14,
            outline: 'none',
          }}
        />
        <input
          type="password"
          placeholder="Parolă"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{
            padding: '10px 14px',
            borderRadius: 6,
            border: '1px solid #203546',
            background: '#0B1319',
            color: '#E0F4F0',
            fontSize: 14,
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 16px',
            borderRadius: 6,
            background: '#0A9678',
            color: '#fff',
            border: 'none',
            fontFamily: "'Archivo Narrow', sans-serif",
            fontWeight: 700,
            fontSize: 14,
            textTransform: 'uppercase',
            cursor: loading ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Autentificare
        </button>
      </form>
    </div>
  );
}
