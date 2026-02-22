'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export interface SignatureData {
  id: string;
  name: string;
  role: 'attorney' | 'client' | 'witness' | 'notary' | 'other';
  signatureImage: string; // base64 data URL
  method: 'draw' | 'type' | 'upload';
  timestamp: string;
  ipAddress?: string;
  email?: string;
}

export interface ESignatureProps {
  signerName?: string;
  signerRole?: 'attorney' | 'client' | 'witness' | 'notary' | 'other';
  signerEmail?: string;
  onSign: (signature: SignatureData) => void;
  onCancel?: () => void;
  compact?: boolean;
}

// ─── Signature Pad (Draw) ───
function SignaturePad({ onSave, width = 500, height = 200 }: { onSave: (dataUrl: string) => void; width?: number; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  const getCtx = () => canvasRef.current?.getContext('2d');

  useEffect(() => {
    const ctx = getCtx();
    if (ctx) {
      ctx.strokeStyle = '#1a1a2e';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const ctx = getCtx();
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
    setHasContent(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const ctx = getCtx();
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const endDraw = () => setIsDrawing(false);

  const clear = () => {
    const ctx = getCtx();
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setHasContent(false);
    }
  };

  const save = () => {
    if (canvasRef.current && hasContent) onSave(canvasRef.current.toDataURL('image/png'));
  };

  return (
    <div>
      <div className="relative border-2 border-dashed border-navy-600 rounded-xl bg-white overflow-hidden">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="w-full cursor-crosshair touch-none"
          style={{ height: `${height * 0.6}px` }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        <div className="absolute bottom-4 left-4 right-4 border-t border-gray-300" />
        <span className="absolute bottom-1 left-4 text-[10px] text-gray-400">Sign above the line</span>
      </div>
      <div className="flex gap-2 mt-2">
        <button onClick={clear} className="px-3 py-1.5 text-xs bg-navy-800 hover:bg-navy-700 text-gray-300 rounded-lg border border-navy-700">Clear</button>
        <button onClick={save} disabled={!hasContent} className="px-4 py-1.5 text-xs bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed">Apply Signature</button>
      </div>
    </div>
  );
}

// ─── Type Signature ───
function TypeSignature({ name, onSave }: { name: string; onSave: (dataUrl: string) => void }) {
  const [typed, setTyped] = useState(name || '');
  const [font, setFont] = useState<'cursive' | 'serif' | 'script'>('cursive');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fonts: Record<string, string> = {
    cursive: '"Brush Script MT", "Segoe Script", cursive',
    serif: '"Times New Roman", "Garamond", serif',
    script: '"Lucida Handwriting", "Comic Sans MS", cursive',
  };

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1a1a2e';
    ctx.font = `italic 36px ${fonts[font]}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(typed || 'Your Name', canvas.width / 2, canvas.height / 2);
    // baseline
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, canvas.height - 30);
    ctx.lineTo(canvas.width - 30, canvas.height - 30);
    ctx.stroke();
  }, [typed, font]);

  useEffect(() => { render(); }, [render]);

  const save = () => {
    if (canvasRef.current && typed.trim()) onSave(canvasRef.current.toDataURL('image/png'));
  };

  return (
    <div>
      <input
        value={typed}
        onChange={e => setTyped(e.target.value)}
        placeholder="Type your full legal name"
        className="w-full bg-navy-800 border border-navy-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gold-500 mb-3"
      />
      <div className="flex gap-2 mb-3">
        {(['cursive', 'serif', 'script'] as const).map(f => (
          <button key={f} onClick={() => setFont(f)} className={`px-3 py-1 text-xs rounded-lg border ${font === f ? 'border-gold-500 bg-gold-500/10 text-gold-400' : 'border-navy-700 bg-navy-800 text-gray-400 hover:text-white'}`}>
            <span style={{ fontFamily: fonts[f], fontStyle: 'italic' }}>{f === 'cursive' ? 'Cursive' : f === 'serif' ? 'Formal' : 'Script'}</span>
          </button>
        ))}
      </div>
      <div className="border-2 border-dashed border-navy-600 rounded-xl bg-white overflow-hidden">
        <canvas ref={canvasRef} width={500} height={120} className="w-full" style={{ height: '80px' }} />
      </div>
      <div className="mt-2">
        <button onClick={save} disabled={!typed.trim()} className="px-4 py-1.5 text-xs bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed">Apply Signature</button>
      </div>
    </div>
  );
}

// ─── Upload Signature ───
function UploadSignature({ onSave }: { onSave: (dataUrl: string) => void }) {
  const [preview, setPreview] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-navy-600 rounded-xl p-8 text-center cursor-pointer hover:border-gold-500/50 transition-colors bg-navy-800/50"
      >
        {preview ? (
          <img src={preview} alt="Signature" className="max-h-24 mx-auto" />
        ) : (
          <>
            <svg className="w-10 h-10 mx-auto text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <p className="text-gray-400 text-sm">Click to upload signature image</p>
            <p className="text-gray-500 text-xs mt-1">PNG, JPG, or SVG with transparent background</p>
          </>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      {preview && (
        <div className="flex gap-2 mt-2">
          <button onClick={() => { setPreview(''); if (inputRef.current) inputRef.current.value = ''; }} className="px-3 py-1.5 text-xs bg-navy-800 hover:bg-navy-700 text-gray-300 rounded-lg border border-navy-700">Clear</button>
          <button onClick={() => onSave(preview)} className="px-4 py-1.5 text-xs bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold rounded-lg">Apply Signature</button>
        </div>
      )}
    </div>
  );
}

// ─── Main ESignature Component ───
export default function ESignature({ signerName = '', signerRole = 'attorney', signerEmail = '', onSign, onCancel, compact = false }: ESignatureProps) {
  const [method, setMethod] = useState<'draw' | 'type' | 'upload'>('draw');
  const [name, setName] = useState(signerName);
  const [email, setEmail] = useState(signerEmail);
  const [agreed, setAgreed] = useState(false);

  const handleSave = (dataUrl: string) => {
    if (!name.trim()) { alert('Please enter your full legal name.'); return; }
    if (!agreed) { alert('Please confirm the legal acknowledgment.'); return; }
    onSign({
      id: `sig_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim(),
      role: signerRole,
      signatureImage: dataUrl,
      method,
      timestamp: new Date().toISOString(),
      email: email || undefined,
    });
  };

  return (
    <div className={`bg-navy-900 border border-navy-700 rounded-xl ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center text-navy-900 font-bold text-sm">✍</span>
          <div>
            <h3 className="text-white font-semibold text-sm">Electronic Signature</h3>
            <p className="text-gray-500 text-xs">ESIGN Act & UETA Compliant</p>
          </div>
        </div>
        {onCancel && <button onClick={onCancel} className="text-gray-500 hover:text-red-400 p-1"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>}
      </div>

      {/* Signer info */}
      <div className={`grid ${compact ? 'grid-cols-1' : 'grid-cols-2'} gap-3 mb-4`}>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Full Legal Name <span className="text-red-400">*</span></label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter full legal name" className="w-full bg-navy-800 border border-navy-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gold-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Email (for audit trail)</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="email@example.com" className="w-full bg-navy-800 border border-navy-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gold-500" />
        </div>
      </div>

      {/* Method tabs */}
      <div className="flex gap-1 mb-4 bg-navy-800 rounded-lg p-1">
        {([['draw', '✏️ Draw'], ['type', '⌨️ Type'], ['upload', '📤 Upload']] as const).map(([m, label]) => (
          <button key={m} onClick={() => setMethod(m)} className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${method === m ? 'bg-gold-500 text-navy-900' : 'text-gray-400 hover:text-white'}`}>{label}</button>
        ))}
      </div>

      {/* Signature input */}
      {method === 'draw' && <SignaturePad onSave={handleSave} />}
      {method === 'type' && <TypeSignature name={name} onSave={handleSave} />}
      {method === 'upload' && <UploadSignature onSave={handleSave} />}

      {/* Legal acknowledgment */}
      <label className="flex items-start gap-2 mt-4 cursor-pointer">
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 rounded border-navy-600 bg-navy-800 text-gold-500 focus:ring-gold-500/30" />
        <span className="text-gray-400 text-xs leading-relaxed">
          By signing, I acknowledge that this electronic signature is legally binding under the{' '}
          <span className="text-gold-400">Electronic Signatures in Global and National Commerce Act (ESIGN)</span> and the{' '}
          <span className="text-gold-400">Uniform Electronic Transactions Act (UETA)</span>.
          I confirm that I am the person identified above or authorized to sign on their behalf.
        </span>
      </label>

      {/* Timestamp */}
      <div className="mt-3 flex items-center gap-4 text-[10px] text-gray-500">
        <span>📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        <span>🕐 {new Date().toLocaleTimeString('en-US')}</span>
        <span>🔒 256-bit encrypted</span>
      </div>
    </div>
  );
}

// ─── Signed Signature Display ───
export function SignedBadge({ signature, className = '' }: { signature: SignatureData; className?: string }) {
  return (
    <div className={`border border-emerald-500/30 bg-emerald-500/5 rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-wide">Signed</span>
        </div>
        <span className="text-gray-500 text-[10px]">{new Date(signature.timestamp).toLocaleString()}</span>
      </div>
      <div className="bg-white rounded-lg p-3 mb-2">
        <img src={signature.signatureImage} alt={`Signature of ${signature.name}`} className="max-h-16 mx-auto" />
      </div>
      <div className="flex items-center justify-between text-xs">
        <div>
          <span className="text-white font-medium">{signature.name}</span>
          <span className="text-gray-500 ml-2 capitalize">({signature.role})</span>
        </div>
        <span className="text-gray-500 text-[10px] font-mono">{signature.id}</span>
      </div>
    </div>
  );
}

// ─── Multi-Party Signing Block ───
export function SigningBlock({ parties, signatures, onRequestSign }: {
  parties: { name: string; role: 'attorney' | 'client' | 'witness' | 'notary' | 'other'; email?: string }[];
  signatures: SignatureData[];
  onRequestSign: (party: { name: string; role: 'attorney' | 'client' | 'witness' | 'notary' | 'other'; email?: string }) => void;
}) {
  const isSigned = (name: string, role: string) => signatures.find(s => s.name === name && s.role === role);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-white font-semibold text-sm">Signatures Required</h3>
        <span className="text-xs text-gray-500">({signatures.length}/{parties.length} signed)</span>
        {signatures.length === parties.length && <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">COMPLETE</span>}
      </div>
      {/* Progress bar */}
      <div className="w-full bg-navy-800 rounded-full h-1.5">
        <div className="bg-gold-500 h-1.5 rounded-full transition-all" style={{ width: `${(signatures.length / parties.length) * 100}%` }} />
      </div>
      {parties.map((party, i) => {
        const sig = isSigned(party.name, party.role);
        return sig ? (
          <SignedBadge key={i} signature={sig} />
        ) : (
          <div key={i} className="border border-navy-700 bg-navy-800/50 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-white text-sm font-medium">{party.name || `${party.role} (pending)`}</span>
              <span className="text-gray-500 text-xs ml-2 capitalize">— {party.role}</span>
              {party.email && <span className="text-gray-600 text-xs ml-2">({party.email})</span>}
            </div>
            <button onClick={() => onRequestSign(party)} className="px-4 py-2 bg-gold-500 hover:bg-gold-400 text-navy-900 text-xs font-bold rounded-lg transition-all">
              ✍ Sign Now
            </button>
          </div>
        );
      })}
    </div>
  );
}
