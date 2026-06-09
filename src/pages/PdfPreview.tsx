import { useState, useRef, useCallback, useEffect } from 'react';
import { PdfDocument } from '@/components/pdf/PdfDocument';
import { TEST_PDF_DATA, type PdfData } from '@/lib/quiz/pdf-types';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Download, Wand2, FileText, ArrowLeft, RefreshCw, Users } from 'lucide-react';
import { toast } from 'sonner';
import { AdminLogin } from '@/components/admin/AdminLogin';
import type { Session } from '@supabase/supabase-js';

interface Submission {
  id: string;
  session_id: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  contact_instagram: string;
  profile_primary: string;
  profile_secondary: string;
  profile_temperature: string;
  raw_data: any;
  pdf_generated: boolean;
  created_at: string;
}

const PROFILE_LABELS: Record<string, string> = {
  R: 'Recrutare', Re: 'Retenție', M: 'Motivație',
  D: 'Delegare', C: 'Control', S: 'Structură',
};

const TEMP_COLORS: Record<string, string> = {
  HOT: '#ef4444', WARM: '#f59e0b', COLD: '#3b82f6',
};

export default function PdfPreviewPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [view, setView] = useState<'list' | 'pdf'>('list');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [pdfData, setPdfData] = useState<PdfData>(TEST_PDF_DATA);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  // Check auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('quiz_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast.error('Eroare la încărcarea datelor: ' + error.message);
    } else {
      setSubmissions((data as any) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (session) fetchSubmissions();
  }, [session, fetchSubmissions]);

  // Realtime: auto-refresh when new submissions arrive
  useEffect(() => {
    if (!session) return;
    const channel = supabase
      .channel('quiz-submissions-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'quiz_submissions' },
        () => {
          fetchSubmissions();
          toast.info('Completare nouă primită!');
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [session, fetchSubmissions]);

  const generateAiText = useCallback(async (quizData: any) => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-pdf-text', {
        body: { quizData },
      });
      if (error) {
        toast.error('Eroare la generarea textului AI: ' + error.message);
        return null;
      }
      return data as PdfData;
    } catch (err: any) {
      toast.error('Eroare: ' + (err.message ?? 'Necunoscută'));
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleGenerateForSubmission = useCallback(async (sub: Submission) => {
    setSelectedSubmission(sub);
    const result = await generateAiText(sub.raw_data);
    if (result) {
      setPdfData(result);
      // Mark as generated
      await supabase.from('quiz_submissions').update({ pdf_generated: true } as any).eq('id', sub.id as any);
      setSubmissions(prev => prev.map(s => s.id === sub.id ? { ...s, pdf_generated: true } : s));
      setView('pdf');
      toast.success('PDF generat cu succes!');
    }
  }, [generateAiText]);

  const handleExportPdf = useCallback(async () => {
    setIsExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const pages = document.querySelectorAll('.pdf-page') as NodeListOf<HTMLElement>;
      if (!pages.length) return;

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const A4_W = 210;
      const A4_H = 297;

      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i], {
          scale: 2,
          useCORS: true,
          backgroundColor: '#0B1319',
          width: pages[i].scrollWidth,
          height: pages[i].scrollHeight,
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        const ratio = canvas.width / canvas.height;
        const imgW = A4_W;
        const imgH = imgW / ratio;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 0, imgW, Math.max(imgH, A4_H));
      }

      pdf.save(`Analiza_${pdfData.contact.name.replace(/\s+/g, '_')}.pdf`);
      toast.success('PDF descărcat!');
    } catch (err: any) {
      toast.error('Eroare la export: ' + (err.message ?? 'Necunoscută'));
    } finally {
      setIsExporting(false);
    }
  }, [pdfData]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: '#0A9678' }} />
      </div>
    );
  }

  if (!session) {
    return <AdminLogin onAuthenticated={() => {}} />;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Narrow:ital,wght@0,400..700;1,400..700&family=Arimo:ital,wght@0,400..700;1,400..700&display=swap');
        body { background: #111827; }
      `}} />

      <div className="min-h-screen" style={{ background: '#111827', color: '#E0F4F0', fontFamily: "'Arimo', sans-serif" }}>
        {/* Toolbar */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(11,19,25,0.95)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #203546',
          padding: '12px 24px',
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        }}>
          {view === 'pdf' && (
            <button onClick={() => setView('list')} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '6px 12px', borderRadius: 6,
              background: '#203546', color: '#73D4BE', border: 'none', cursor: 'pointer',
              fontFamily: "'Archivo Narrow', sans-serif", fontWeight: 700, fontSize: 12, textTransform: 'uppercase',
            }}>
              <ArrowLeft size={14} /> Înapoi la listă
            </button>
          )}

          <FileText size={20} style={{ color: '#0A9678' }} />
          <span style={{ fontFamily: "'Archivo Narrow', sans-serif", fontWeight: 700, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#73D4BE' }}>
            {view === 'list' ? 'Completări Quiz' : `PDF — ${pdfData.contact.name}`}
          </span>

          <div style={{ flex: 1 }} />

          {view === 'list' && (
            <button onClick={fetchSubmissions} disabled={loading} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 6,
              background: '#203546', color: '#73D4BE', border: 'none', cursor: 'pointer',
              fontFamily: "'Archivo Narrow', sans-serif", fontWeight: 700, fontSize: 13, textTransform: 'uppercase',
            }}>
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Reîncarcă
            </button>
          )}

          {view === 'pdf' && (
            <button onClick={handleExportPdf} disabled={isExporting} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 6,
              background: '#FFFFFF', color: '#0B1319', border: 'none', cursor: 'pointer',
              fontFamily: "'Archivo Narrow', sans-serif", fontWeight: 700, fontSize: 13, textTransform: 'uppercase',
            }}>
              {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              Descarcă PDF
            </button>
          )}
        </div>

        {/* List View */}
        {view === 'list' && (
          <div style={{ padding: '24px', maxWidth: 900, margin: '0 auto' }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
                <Loader2 size={32} className="animate-spin" style={{ color: '#0A9678' }} />
              </div>
            ) : submissions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#4a8a7e' }}>
                <Users size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                <p style={{ fontSize: 18, fontWeight: 600 }}>Nicio completare încă</p>
                <p style={{ fontSize: 14, marginTop: 8 }}>Completările quiz-ului vor apărea aici automat.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p style={{ fontSize: 12, color: '#4a8a7e', marginBottom: 4 }}>
                  {submissions.length} completăr{submissions.length === 1 ? 'e' : 'i'} totale
                </p>
                {submissions.map(sub => (
                  <div key={sub.id} style={{
                    background: '#162430', borderRadius: 10, border: '1px solid #203546',
                    padding: '16px 20px',
                    display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
                  }}>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{sub.contact_name || 'Fără nume'}</div>
                      <div style={{ fontSize: 13, color: '#73D4BE', marginTop: 2 }}>{sub.contact_email}</div>
                      <div style={{ fontSize: 12, color: '#4a8a7e', marginTop: 2 }}>{sub.contact_phone}</div>
                    </div>

                    {/* Profile badges */}
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{
                        padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                        background: '#0A9678', color: '#fff',
                        fontFamily: "'Archivo Narrow', sans-serif", textTransform: 'uppercase',
                      }}>
                        {PROFILE_LABELS[sub.profile_primary] ?? sub.profile_primary}
                      </span>
                      {sub.profile_secondary && (
                        <span style={{
                          padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                          background: '#203546', color: '#73D4BE',
                          fontFamily: "'Archivo Narrow', sans-serif", textTransform: 'uppercase',
                        }}>
                          {PROFILE_LABELS[sub.profile_secondary] ?? sub.profile_secondary}
                        </span>
                      )}
                      {sub.profile_temperature && (
                        <span style={{
                          padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                          background: TEMP_COLORS[sub.profile_temperature] ?? '#666',
                          color: '#fff',
                          fontFamily: "'Archivo Narrow', sans-serif", textTransform: 'uppercase',
                        }}>
                          {sub.profile_temperature}
                        </span>
                      )}
                    </div>

                    {/* Date */}
                    <div style={{ fontSize: 11, color: '#4a8a7e', minWidth: 120, textAlign: 'right' }}>
                      {formatDate(sub.created_at)}
                    </div>

                    {/* Actions */}
                    <button
                      onClick={() => handleGenerateForSubmission(sub)}
                      disabled={isGenerating}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '8px 16px', borderRadius: 6,
                        background: sub.pdf_generated ? '#203546' : '#0A9678',
                        color: sub.pdf_generated ? '#73D4BE' : '#fff',
                        border: 'none', cursor: isGenerating ? 'wait' : 'pointer',
                        fontFamily: "'Archivo Narrow', sans-serif", fontWeight: 700, fontSize: 12,
                        textTransform: 'uppercase', whiteSpace: 'nowrap',
                      }}
                    >
                      {isGenerating && selectedSubmission?.id === sub.id
                        ? <Loader2 size={14} className="animate-spin" />
                        : <Wand2 size={14} />}
                      {sub.pdf_generated ? 'Regenerează PDF' : 'Generează PDF'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PDF View */}
        {view === 'pdf' && (
          <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
            <div ref={pdfRef} style={{
              boxShadow: '0 25px 80px rgba(0,0,0,0.5)',
              borderRadius: 4, overflow: 'hidden',
            }}>
              <PdfDocument data={pdfData} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}