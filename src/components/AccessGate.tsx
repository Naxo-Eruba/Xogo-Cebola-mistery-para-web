import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldAlert, Volume2, VolumeX } from 'lucide-react';
import { ARCHIVE_ASSETS } from '../data/assets';
import { MEMBERS, MemberProfile, normalizeClave } from '../data/archivoData';
import { soundEngine } from '../utils/soundEngine';

interface AccessGateProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onAuthenticate: (member: MemberProfile) => void;
}

export const AccessGate: React.FC<AccessGateProps> = ({
  soundEnabled,
  onToggleSound,
  onAuthenticate,
}) => {
  const [codeInput, setCodeInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeClave(codeInput);

    if (!normalized) {
      soundEngine.playMutedKnock();
      setErrorMessage('Introduce tu código personal para abrir el expediente.');
      return;
    }

    if (normalized === 'EXPJ00' || normalized === 'J00') {
      soundEngine.playMutedKnock();
      setErrorMessage(
        'Expediente J-00 bloqueado: acceso denegado al comité de L\'Autòctone. Aquí mandan los viernes de La Lira.'
      );
      return;
    }

    const matched = MEMBERS.find(
      (m) =>
        (m.category === 'activo' || m.category === 'ocasional') &&
        normalizeClave(m.code) === normalized
    );

    if (!matched) {
      soundEngine.playMutedKnock();
      setErrorMessage(
        'Código no reconocido. Revisa el formato que recibiste (por ejemplo, AC-000) o consulta con Xoán.'
      );
      return;
    }

    soundEngine.playDocumentStamp();
    setErrorMessage(null);
    onAuthenticate(matched);
  };

  return (
    <div className="min-h-screen bg-[#111315] text-[#F2E9D8] px-4 py-6 sm:py-8">
      <div className="w-full max-w-lg mx-auto flex flex-col gap-5">
        {/* Compact Top Sound Control */}
        <div className="flex items-center justify-between">
          <span className="font-mono-code text-xs uppercase tracking-widest text-[#C59B48]">
            Protocolo Gouxa · 2046
          </span>
          <button
            type="button"
            onClick={onToggleSound}
            aria-pressed={soundEnabled}
            aria-label={soundEnabled ? 'Silenciar efectos de sonido' : 'Activar efectos de sonido'}
            className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#1B1E23] border border-[#C59B48]/25 text-xs font-medium text-[#F2E9D8]/85 hover:text-[#C59B48] flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#C59B48]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#F2E9D8]/50" />
            )}
            <span>{soundEnabled ? 'Sonido activo' : 'En silencio'}</span>
          </button>
        </div>

        {/* Vertical Dossier Cover Card */}
        <div className="bg-[#1B1E23] rounded-2xl overflow-hidden border border-[#C59B48]/20 shadow-2xl">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#181A1F]">
            {!imgError ? (
              <img
                src={ARCHIVE_ASSETS.dossierCover}
                alt="Carpeta confidencial sellada del Archivo Cero"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#1B1E23] to-[#111315]">
                <Lock className="w-10 h-10 text-[#C59B48] mb-3" />
                <p className="font-display text-lg text-[#F2E9D8]">Carpeta Reservada · 2046</p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111315]/95 via-[#111315]/30 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
              <div>
                <h1 className="font-display text-3xl font-semibold text-[#F2E9D8] leading-tight">
                  Archivo Cero
                </h1>
                <p className="text-xs font-mono-code text-[#F2E9D8]/75 mt-1">
                  Destino: La Cebolla · Mirador da Gouxa
                </p>
              </div>
              <span className="stamp-seal px-2.5 py-1 text-[11px] font-medium bg-[#F2E9D8]/95 rotate-[-2deg] shrink-0">
                CONFIDENCIAL
              </span>
            </div>
          </div>
        </div>

        {/* Vertical Aged Paper Access Card */}
        <div className="paper-surface rounded-2xl p-6 shadow-2xl border border-[#C59B48]/35 flex flex-col gap-5">
          <div className="flex items-center justify-between gap-3 border-b border-[#1D1A16]/15 pb-3.5">
            <span className="font-mono-code text-xs uppercase tracking-wider text-[#7B1E26] font-semibold">
              Remite: Capa Futura
            </span>
            <span className="font-mono-code text-xs text-[#1D1A16]/65">
              Acceso privado
            </span>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-2xl font-semibold text-[#1D1A16] leading-snug">
              Has recibido un archivo confidencial dirigido a La Cebolla
            </h2>
            <p className="text-[15px] text-[#1D1A16]/85 leading-relaxed">
              Llega desde 2046 con un aviso urgente: la casa de piedra junto a Gouxa está en juego.
              Dentro de tu expediente encontrarás pistas personales que nadie más ve en su móvil.
            </p>
            <p className="text-[15px] text-[#1D1A16]/85 leading-relaxed">
              Avanza a tu ritmo y cruza datos en WhatsApp cuando te falte una pieza. Nadie puede
              bloquear el progreso de los demás.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="pt-4 border-t border-[#1D1A16]/15 space-y-4">
            <div>
              <label
                htmlFor="expediente-code"
                className="block text-sm font-semibold text-[#1D1A16] mb-2"
              >
                Código personal de expediente
              </label>
              <input
                id="expediente-code"
                type="text"
                value={codeInput}
                onChange={(e) => {
                  soundEngine.playTypewriterClick();
                  setCodeInput(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Ej. AC-000"
                autoComplete="off"
                autoCapitalize="characters"
                className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-white/85 border border-[#1D1A16]/25 text-[#1D1A16] placeholder:text-[#1D1A16]/40 font-mono-code text-base tracking-wider uppercase focus:border-[#7B1E26] focus:outline-none"
              />
              <p className="text-xs text-[#1D1A16]/65 mt-2">
                Tu progreso y tus notas se guardan automáticamente en este dispositivo.
              </p>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#7B1E26]/10 border border-[#7B1E26]/30 text-[#7B1E26] text-sm"
              >
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#1D1A16] hover:bg-[#2B2620] active:scale-[0.99] text-[#F2E9D8] font-medium text-[15px] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Abrir expediente</span>
              <ArrowRight className="w-4 h-4 text-[#C59B48]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
