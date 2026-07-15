import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminLogin } from '@/components/admin/AdminLogin';
import type { Session } from '@supabase/supabase-js';
import { Loader2, Sparkles, ArrowLeft, Copy, ExternalLink } from 'lucide-react';

// Landingurile sunt servite ca subfoldere ale quizului (vezi public/arhitectura-afacerii*).
const SUBFOLDER: Record<string, string> = {
  'aa-start': 'arhitectura-afacerii-start',
  'aa-business': 'arhitectura-afacerii',
};
const linkVarianta = (produs: string, slug: string) =>
  `${window.location.origin}/${SUBFOLDER[produs]}/?v=${slug}`;

/**
 * „GPT-ul intern" pentru echipă: scrii în cuvintele tale cine e candidatul (durerile,
 * fricile, dorințele), alegi produsul, și primești un landing personalizat — fără să
 * treacă prin quiz. Cheamă aceeași funcție edge generate-landing ca butonul din admin.
 */
export default function GeneratorLandingAdmin() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [produs, setProdus] = useState<'aa-start' | 'aa-business'>('aa-start');
  const [brief, setBrief] = useState('');
  const [nume, setNume] = useState('');
  const [telefon, setTelefon] = useState('');

  const [stare, setStare] = useState<'idle' | 'lucru' | 'gata' | 'eroare'>('idle');
  const [mesaj, setMesaj] = useState('');
  const [rezultat, setRezultat] = useState<{ link: string; meta: any } | null>(null);
  const [copiat, setCopiat] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => { setSession(s); setAuthLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  async function genereaza() {
    if (brief.trim().length < 15) { setMesaj('Scrie mai multe detalii despre candidat.'); setStare('eroare'); return; }
    setStare('lucru'); setMesaj(''); setRezultat(null);
    try {
      const { data, error } = await supabase.functions.invoke('generate-landing', {
        body: { brief: brief.trim(), produs, nume: nume.trim() || undefined },
      });
      if (error) {
        let m = error.message;
        try { const b = await (error as any).context?.json?.(); if (b?.error) m = b.error; } catch { /* */ }
        throw new Error(m);
      }
      const slug = data.slug;
      // polling: așteaptă status='done' (max ~3 min)
      for (let i = 0; i < 60; i++) {
        await new Promise((r) => setTimeout(r, 3000));
        // cast: tabelul landing_variants nu e în tipurile generate ale clientului
        const { data: rows } = await (supabase as any)
          .from('landing_variants').select('status, produs, meta, eroare').eq('slug', slug).maybeSingle();
        if (rows?.status === 'done') {
          setRezultat({ link: linkVarianta(rows.produs, slug), meta: (rows as any).meta });
          setStare('gata'); return;
        }
        if (rows?.status === 'error') { setMesaj((rows as any).eroare || 'eroare'); setStare('eroare'); return; }
      }
      setMesaj('durează neobișnuit de mult — verifică mai târziu.'); setStare('eroare');
    } catch (e: any) {
      setMesaj(String(e?.message || e)); setStare('eroare');
    }
  }

  const waHref = rezultat && telefon
    ? `https://wa.me/${telefon.replace(/\D/g, '')}?text=${encodeURIComponent(
        `${nume || 'Salut'}, ți-am pregătit o pagină special pentru tine, pornind de la ce mi-ai spus. Aruncă un ochi: ${rezultat.link}`
      )}`
    : '';

  if (authLoading)
    return <div style={{ minHeight: '100vh', background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" color="#73D4BE" /></div>;
  if (!session) return <AdminLogin onAuthenticated={() => {}} />;

  const card: React.CSSProperties = { background: '#0B1319', border: '1px solid #203546', borderRadius: 14, padding: 22 };
  const label: React.CSSProperties = { fontFamily: "'Archivo Narrow', sans-serif", fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#73D4BE', display: 'block', margin: '14px 0 6px' };
  const input: React.CSSProperties = { width: '100%', background: '#111827', color: '#E0F4F0', border: '1px solid #203546', borderRadius: 10, padding: '11px 13px', font: 'inherit', fontSize: 14, boxSizing: 'border-box' };

  return (
    <div style={{ minHeight: '100vh', background: '#111827', color: '#E0F4F0', fontFamily: "'Arimo', sans-serif", padding: '28px 20px 80px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <a href="/admin/pdf" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#73D4BE', textDecoration: 'none', fontSize: 13, marginBottom: 18 }}><ArrowLeft size={15} /> Înapoi la leaduri</a>
        <h1 style={{ fontSize: 22, display: 'flex', alignItems: 'center', gap: 10, margin: '0 0 4px' }}><Sparkles size={20} color="#73D4BE" /> Generator landing din brief</h1>
        <p style={{ color: '#8fb3ab', fontSize: 14, margin: '0 0 22px' }}>Descrie candidatul în cuvintele tale — durerile, fricile, ce vrea — și primești un landing personalizat. Nu trebuie să treacă prin quiz.</p>

        <div style={card}>
          <label style={label}>Produsul</label>
          <div style={{ display: 'flex', gap: 10 }}>
            {([['aa-start', 'START — vrea să înceapă o afacere'], ['aa-business', 'BUSINESS — are deja o afacere']] as const).map(([val, txt]) => (
              <button key={val} onClick={() => setProdus(val)} style={{
                flex: 1, textAlign: 'left', padding: 12, borderRadius: 10, cursor: 'pointer', fontSize: 13,
                background: produs === val ? '#203546' : '#111827',
                border: `1px solid ${produs === val ? '#73D4BE' : '#203546'}`,
                color: produs === val ? '#E0F4F0' : '#8fb3ab',
              }}>{txt}</button>
            ))}
          </div>

          <label style={label}>Cine e candidatul? (nume, stadiu, nișă, ce-l doare, de ce se teme, ce vrea)</label>
          <textarea value={brief} onChange={(e) => setBrief(e.target.value)} style={{ ...input, minHeight: 150, resize: 'vertical' }}
            placeholder="ex: Andrei, student, vrea să deschidă un business de cleaning, are ideea de mult dar nu știe de unde să înceapă, se teme că va costa mult, are ambiții mari dar e la început." />

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={label}>Nume (opțional)</label>
              <input value={nume} onChange={(e) => setNume(e.target.value)} style={input} placeholder="Andrei" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={label}>Telefon WhatsApp (opțional)</label>
              <input value={telefon} onChange={(e) => setTelefon(e.target.value)} style={input} placeholder="373..." />
            </div>
          </div>

          <button onClick={genereaza} disabled={stare === 'lucru'} style={{
            marginTop: 18, width: '100%', padding: 13, borderRadius: 999, border: 'none', cursor: stare === 'lucru' ? 'wait' : 'pointer',
            background: '#0A9678', color: '#04241c', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: stare === 'lucru' ? 0.6 : 1,
          }}>
            {stare === 'lucru' ? <><Loader2 size={16} className="animate-spin" /> Se generează… (~1 min)</> : <><Sparkles size={16} /> Generează landingul</>}
          </button>
          {stare === 'eroare' && <p style={{ color: '#ef4444', fontSize: 13, marginTop: 12 }}>{mesaj}</p>}
        </div>

        {rezultat && stare === 'gata' && (
          <div style={{ ...card, marginTop: 18 }}>
            <label style={label}>Landingul e gata</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input readOnly value={rezultat.link} style={{ ...input, color: '#73D4BE', fontSize: 13 }} />
              <button onClick={() => { navigator.clipboard.writeText(rezultat.link); setCopiat(true); setTimeout(() => setCopiat(false), 1500); }}
                style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #203546', background: '#111827', color: '#73D4BE', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                <Copy size={14} /> {copiat ? 'Copiat' : 'Copiază'}</button>
              <a href={rezultat.link} target="_blank" rel="noreferrer" style={{ padding: '10px 12px', borderRadius: 10, background: '#203546', color: '#73D4BE', textDecoration: 'none', whiteSpace: 'nowrap' }}><ExternalLink size={14} /> Deschide</a>
            </div>
            {waHref && <a href={waHref} target="_blank" rel="noreferrer" style={{ display: 'block', textAlign: 'center', marginTop: 12, background: '#25D366', color: '#06280f', borderRadius: 999, padding: 12, fontWeight: 700, textDecoration: 'none' }}>Trimite pe WhatsApp →</a>}
            {rezultat.meta?.fir_rosu && <p style={{ fontSize: 13, color: '#8fb3ab', marginTop: 14 }}>Fir roșu: <b style={{ color: '#E0F4F0' }}>{rezultat.meta.fir_rosu.durere}</b> → <b style={{ color: '#E0F4F0' }}>{rezultat.meta.fir_rosu.dorinta}</b></p>}
            {rezultat.meta?.cost && <p style={{ fontSize: 12, color: '#8fb3ab', marginTop: 6 }}>💸 Cost: ${Number(rezultat.meta.cost.usd).toFixed(3)} · {rezultat.meta.schimbari} texte personalizate</p>}
          </div>
        )}
      </div>
    </div>
  );
}
