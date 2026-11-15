import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Copy,
  HelpCircle,
  KeyRound,
  Lock,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  FINAL_ACTA_2046,
  LAYER_4_KEYS,
  LAYER_BRIEFINGS,
  LAYER_SOLUTIONS,
  MEMBERS,
  MemberProfile,
  validateLayerAnswer,
  validateLayer4Vault,
} from '../data/archivoData';
import { ExpedienteState } from '../utils/storage';
import { soundEngine } from '../utils/soundEngine';

interface MisionTabProps {
  member: MemberProfile;
  state: ExpedienteState;
  onUpdateState: (updater: (prev: ExpedienteState) => ExpedienteState) => void;
  onCopyText: (text: string, feedback: string) => void;
  onGoToTab: (tab: 'archivo' | 'pruebas' | 'red' | 'diario') => void;
}

export const MisionTab: React.FC<MisionTabProps> = ({
  member,
  state,
  onUpdateState,
  onCopyText,
  onGoToTab,
}) => {
  const [answerInput, setAnswerInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [custodianConfirmStep, setCustodianConfirmStep] = useState(false);

  const isCompleted = state.unlockedLayer === 5;
  const activeLayer: 1 | 2 | 3 | 4 =
    state.unlockedLayer === 5 ? 4 : state.unlockedLayer;
  const briefing = LAYER_BRIEFINGS[activeLayer];

  const effectiveLayer4Keys = {
    maria:
      member.id === 'maria' && !state.layer4Keys.maria
        ? member.personalKey || ''
        : state.layer4Keys.maria,
    charo:
      member.id === 'charo' && !state.layer4Keys.charo
        ? member.personalKey || ''
        : state.layer4Keys.charo,
    rosi:
      member.id === 'rosi' && !state.layer4Keys.rosi
        ? member.personalKey || ''
        : state.layer4Keys.rosi,
    pilar:
      member.id === 'pilar' && !state.layer4Keys.pilar
        ? member.personalKey || ''
        : state.layer4Keys.pilar,
    juan:
      member.id === 'juan' && !state.layer4Keys.juan
        ? member.personalKey || ''
        : state.layer4Keys.juan,
  };

  const handleUnlockLayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeLayer === 4) {
      const result = validateLayer4Vault(effectiveLayer4Keys);
      if (!result.valid) {
        soundEngine.playMutedKnock();
        setErrorMsg(
          `Faltan o no coinciden las llaves de: ${result.missingOrWrong.join(', ')}. Contrasta las 5 palabras con los activos en WhatsApp.`
        );
        return;
      }
      soundEngine.playDocumentStamp();
      setTimeout(() => soundEngine.playBrassChime(), 160);
      setErrorMsg(null);
      setShowHint(false);
      onUpdateState((prev) => ({
        ...prev,
        layer4Keys: effectiveLayer4Keys,
        unlockedLayer: 5,
      }));
      return;
    }

    if (!answerInput.trim()) {
      soundEngine.playMutedKnock();
      setErrorMsg('Escribe la clave antes de comprobar.');
      return;
    }

    const ok = validateLayerAnswer(activeLayer, answerInput);
    if (!ok) {
      soundEngine.playMutedKnock();
      setErrorMsg(
        'Esa clave todavía no encaja. Revisa el orden o pide la pieza que te falta en WhatsApp.'
      );
      return;
    }

    soundEngine.playDocumentStamp();
    setErrorMsg(null);
    setAnswerInput('');
    setShowHint(false);
    const nextLayer = (activeLayer + 1) as 2 | 3 | 4;
    onUpdateState((prev) => ({
      ...prev,
      unlockedLayer: nextLayer,
    }));
  };

  const handleUpdateKey4 = (
    field: 'maria' | 'charo' | 'rosi' | 'pilar' | 'juan',
    val: string
  ) => {
    soundEngine.playTypewriterClick();
    setErrorMsg(null);
    onUpdateState((prev) => ({
      ...prev,
      layer4Keys: {
        ...effectiveLayer4Keys,
        [field]: val,
      },
    }));
  };

  const playableMembers = MEMBERS.filter(
    (m) => m.category === 'activo' || m.category === 'ocasional'
  );

  return (
    <div className="flex flex-col gap-5">
      {/* 4-Layer Progress Stepper */}
      <section aria-label="Progreso de investigación" className="bg-[#1B1E23] rounded-2xl p-4 border border-[#C59B48]/20">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-mono-code uppercase tracking-wider text-[#C59B48]">
            Progreso del protocolo
          </span>
          <span className="text-xs font-mono-code text-[#F2E9D8]/75 tabular-nums">
            {isCompleted ? '4 / 4 Capas resueltas' : `Capa ${activeLayer} de 4`}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {([1, 2, 3, 4] as const).map((step) => {
            const done = state.unlockedLayer > step;
            const current = state.unlockedLayer === step;
            return (
              <div
                key={step}
                className={`rounded-xl px-2 py-2 border transition-colors ${
                  done
                    ? 'bg-[#C59B48]/15 border-[#C59B48]/50 text-[#F2E9D8]'
                    : current
                      ? 'bg-[#F2E9D8]/10 border-[#C59B48] text-[#F2E9D8]'
                      : 'bg-[#111315]/50 border-[#F2E9D8]/10 text-[#F2E9D8]/45'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono-code text-[11px] font-semibold tabular-nums">
                    C{step}
                  </span>
                  {done ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C59B48] shrink-0" />
                  ) : current ? (
                    <KeyRound className="w-3.5 h-3.5 text-[#C59B48] shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 opacity-50 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] truncate mt-0.5 opacity-80">
                  {step === 1
                    ? 'Plano'
                    : step === 2
                      ? 'Memoria'
                      : step === 3
                        ? 'J-00'
                        : 'Núcleo'}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Collapsible Card: QUÉ TIENES ENTRE MANOS */}
      <section className="bg-[#1B1E23] rounded-2xl border border-[#C59B48]/30 overflow-hidden">
        <button
          type="button"
          onClick={() => {
            soundEngine.playPaperRustle();
            onUpdateState((prev) => ({ ...prev, introCardOpen: !prev.introCardOpen }));
          }}
          aria-expanded={state.introCardOpen}
          className="w-full min-h-[52px] px-5 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-[#F2E9D8]/5 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-4 h-4 text-[#C59B48] shrink-0" />
            <span className="font-mono-code text-xs font-semibold tracking-wide text-[#F2E9D8]">
              QUÉ TIENES ENTRE MANOS
            </span>
          </div>
          {state.introCardOpen ? (
            <ChevronUp className="w-4 h-4 text-[#C59B48] shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#C59B48] shrink-0" />
          )}
        </button>

        {state.introCardOpen && (
          <div className="px-5 pb-5 pt-2 border-t border-[#F2E9D8]/10 space-y-3 text-[15px] text-[#F2E9D8]/85 leading-relaxed">
            <p>
              Estás dentro del expediente personal de <strong className="text-[#F2E9D8]">{member.displayName}</strong>.
              En 2046, La Cebolla comparte una casa de piedra rehabilitada junto al Mirador da Gouxa,
              pero alguien en 2026 pretende convertirla en un restaurante elitista llamado <em>L&apos;Autòctone</em>.
            </p>
            <div className="flex flex-col gap-2.5 pt-1">
              <div className="p-3.5 rounded-xl bg-[#111315]/70 border border-[#F2E9D8]/10">
                <p className="font-mono-code text-xs text-[#C59B48] mb-0.5">1. Tu parte</p>
                <p className="text-sm text-[#F2E9D8]/80">
                  Cada expediente tiene pistas distintas que nadie más ve.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#111315]/70 border border-[#F2E9D8]/10">
                <p className="font-mono-code text-xs text-[#C59B48] mb-0.5">2. WhatsApp</p>
                <p className="text-sm text-[#F2E9D8]/80">
                  Pregunta en el grupo o por privado usando los botones de copiar.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#111315]/70 border border-[#F2E9D8]/10">
                <p className="font-mono-code text-xs text-[#C59B48] mb-0.5">3. Sin bloqueos</p>
                <p className="text-sm text-[#F2E9D8]/80">
                  Avanzas a tu ritmo. Si alguien ocasional tarda, tienes Contingencia en Red.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Main Vertical Flow: Active Mission or Completed Finale */}
      {isCompleted ? (
        <section className="paper-surface rounded-2xl p-5 sm:p-6 border border-[#C59B48]/50 shadow-xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1D1A16]/15 pb-4">
            <div>
              <span className="font-mono-code text-xs uppercase tracking-wider text-[#7B1E26] font-semibold">
                Cámara Núcleo Cero · Desbloqueada
              </span>
              <h2 className="font-display text-2xl font-semibold text-[#1D1A16] mt-1">
                {FINAL_ACTA_2046.identityRevealTitle}
              </h2>
            </div>
            <span className="stamp-seal px-3 py-1 text-xs font-semibold">
              ARCHIVO CERRADO · 2046
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#1D1A16]/5 border border-[#1D1A16]/15 space-y-2">
            <div className="flex items-center gap-2 text-[#7B1E26]">
              <Sparkles className="w-4 h-4 shrink-0" />
              <h3 className="font-display text-xl font-semibold text-[#1D1A16]">
                {FINAL_ACTA_2046.identityName}
              </h3>
            </div>
            <p className="text-[15px] text-[#1D1A16]/85 leading-relaxed">
              {FINAL_ACTA_2046.identityStory}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-display text-xl font-semibold text-[#1D1A16]">
              {FINAL_ACTA_2046.actaTitle}
            </h3>
            <ol className="space-y-3">
              {FINAL_ACTA_2046.clauses.map((clause, idx) => (
                <li
                  key={idx}
                  className="p-4 rounded-xl bg-white/65 border border-[#1D1A16]/12 flex items-start gap-3"
                >
                  <span className="font-mono-code text-xs font-semibold text-[#7B1E26] mt-1 shrink-0 tabular-nums">
                    0{idx + 1}.
                  </span>
                  <span className="text-[15px] text-[#1D1A16]/90 leading-relaxed">{clause}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() =>
                onCopyText(
                  '¡Hemos abierto la Cámara Núcleo Cero en Archivo Cero! Capa Futura era Rosi de 2046 y la casa de Gouxa queda a salvo para La Cebolla.',
                  'Mensaje final copiado para WhatsApp'
                )
              }
              className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-[#1D1A16] text-[#F2E9D8] text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#2B2620] transition-colors cursor-pointer"
            >
              <Copy className="w-4 h-4 text-[#C59B48]" />
              <span>Compartir final en WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => onGoToTab('archivo')}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-[#1D1A16]/25 text-[#1D1A16] text-sm font-medium hover:bg-[#1D1A16]/5 transition-colors cursor-pointer"
            >
              Revisar cartas y secreto reservado
            </button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col gap-5">
          {/* Aged Paper Mission Card */}
          <section className="paper-surface rounded-2xl p-5 sm:p-6 border border-[#C59B48]/40 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1D1A16]/15 pb-3">
              <span className="font-mono-code text-xs uppercase tracking-wider text-[#7B1E26] font-semibold">
                Misión activa · Capa {activeLayer}
              </span>
              <span className="font-mono-code text-xs text-[#1D1A16]/65">
                Expediente {member.code}
              </span>
            </div>

            <div>
              <h1 className="font-display text-2xl font-semibold text-[#1D1A16] leading-snug">
                {briefing.title}
              </h1>
              <p className="text-sm text-[#1D1A16]/70 mt-1">{briefing.subtitle}</p>
            </div>

            <div className="space-y-3 text-[15px] text-[#1D1A16]/85 leading-relaxed">
              {briefing.futureLetterBody.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* What THIS player holds */}
            <div className="p-4 rounded-xl bg-[#1D1A16]/6 border border-[#1D1A16]/15 space-y-1.5">
              <p className="font-mono-code text-xs uppercase tracking-wider text-[#7B1E26] font-semibold">
                Lo que guarda tu expediente ahora
              </p>
              <p className="text-[15px] font-medium text-[#1D1A16] leading-relaxed">
                {member.whatYouHoldByLayer[activeLayer]}
              </p>
            </div>

            {/* Quick cross-links to Pruebas / Red */}
            <div className="flex flex-col gap-2 pt-1">
              {activeLayer === 1 && (
                <button
                  type="button"
                  onClick={() => onGoToTab('pruebas')}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#1D1A16]/25 text-sm font-medium text-[#1D1A16] hover:bg-[#1D1A16]/5 transition-colors cursor-pointer"
                >
                  Abrir plano de Gouxa en Pruebas
                </button>
              )}
              {activeLayer === 2 && (
                <button
                  type="button"
                  onClick={() => onGoToTab('pruebas')}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#1D1A16]/25 text-sm font-medium text-[#1D1A16] hover:bg-[#1D1A16]/5 transition-colors cursor-pointer"
                >
                  Abrir espejo y entradas en Pruebas
                </button>
              )}
              {activeLayer === 3 && (
                <button
                  type="button"
                  onClick={() => onGoToTab('archivo')}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#1D1A16]/25 text-sm font-medium text-[#1D1A16] hover:bg-[#1D1A16]/5 transition-colors cursor-pointer"
                >
                  Leer cláusulas de L&apos;Autòctone en Archivo
                </button>
              )}
              <button
                type="button"
                onClick={() => onGoToTab('red')}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#1D1A16]/25 text-sm font-medium text-[#1D1A16] hover:bg-[#1D1A16]/5 transition-colors cursor-pointer"
              >
                Ver quién tiene cada pista en Red
              </button>
            </div>
          </section>

          {/* Unlock Form & WhatsApp Helper */}
          <section className="bg-[#1B1E23] rounded-2xl p-5 sm:p-6 border border-[#C59B48]/25 space-y-4">
            <div className="space-y-1.5">
              <span className="font-mono-code text-xs uppercase tracking-wider text-[#C59B48]">
                Desbloqueo de capa
              </span>
              <p className="text-[15px] text-[#F2E9D8]/90 leading-relaxed">
                {briefing.objective}
              </p>
            </div>

            <form onSubmit={handleUnlockLayer} className="space-y-4">
              {activeLayer === 4 ? (
                <div className="space-y-3">
                  {(
                    [
                      { key: 'maria', label: 'Llave de María' },
                      { key: 'charo', label: 'Llave de Charo' },
                      { key: 'rosi', label: 'Llave de Rosi' },
                      { key: 'pilar', label: 'Llave de Pilar' },
                      { key: 'juan', label: 'Llave de Xoán' },
                    ] as const
                  ).map((slot) => (
                    <div key={slot.key}>
                      <label
                        htmlFor={`key4-${slot.key}`}
                        className="block text-xs font-mono-code text-[#F2E9D8]/75 mb-1"
                      >
                        {slot.label}
                        {member.id === slot.key ? ' (Tu llave)' : ''}
                      </label>
                      <input
                        id={`key4-${slot.key}`}
                        type="text"
                        value={effectiveLayer4Keys[slot.key]}
                        onChange={(e) => handleUpdateKey4(slot.key, e.target.value)}
                        placeholder="Palabra clave..."
                        autoComplete="off"
                        className="w-full min-h-[46px] px-3.5 py-2 rounded-xl bg-[#111315] border border-[#F2E9D8]/20 text-[#F2E9D8] font-mono-code uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal placeholder:text-[#F2E9D8]/35 focus:border-[#C59B48] focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="layer-unlock-input"
                    className="block text-xs font-mono-code text-[#F2E9D8]/75 mb-1.5"
                  >
                    {briefing.inputLabel}
                  </label>
                  <input
                    id="layer-unlock-input"
                    type="text"
                    value={answerInput}
                    onChange={(e) => {
                      soundEngine.playTypewriterClick();
                      setAnswerInput(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder={briefing.inputPlaceholder}
                    autoComplete="off"
                    className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-[#111315] border border-[#F2E9D8]/25 text-[#F2E9D8] font-mono-code text-base uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal placeholder:text-[#F2E9D8]/35 focus:border-[#C59B48] focus:outline-none"
                  />
                  <p className="text-xs text-[#F2E9D8]/55 mt-1.5">
                    Acepta mayúsculas, minúsculas, con o sin tildes y guiones.
                  </p>
                </div>
              )}

              {errorMsg && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xl bg-[#7B1E26]/25 border border-[#7B1E26]/60 text-[#F2E9D8] text-sm flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-[#F2E9D8] shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#C59B48] hover:bg-[#D4AC5A] active:scale-[0.99] text-[#111315] font-semibold text-[15px] transition-all cursor-pointer"
              >
                {activeLayer === 4
                  ? 'Abrir Cámara Núcleo Cero'
                  : `Desbloquear Capa ${activeLayer + 1}`}
              </button>
            </form>

            <div className="pt-3 border-t border-[#F2E9D8]/10 space-y-2.5">
              <button
                type="button"
                onClick={() =>
                  onCopyText(
                    briefing.whatsappTemplate,
                    'Pregunta copiada lista para pegar en WhatsApp'
                  )
                }
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#111315] hover:bg-[#111315]/80 border border-[#C59B48]/35 text-[#F2E9D8] text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Copy className="w-4 h-4 text-[#C59B48]" />
                <span>Copiar pregunta para WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playPaperRustle();
                  setShowHint((v) => !v);
                }}
                className="w-full min-h-[42px] px-4 py-2 rounded-xl text-sm text-[#F2E9D8]/75 hover:text-[#C59B48] transition-colors cursor-pointer"
              >
                {showHint ? 'Ocultar pista' : 'Necesito una pista'}
              </button>

              {showHint && (
                <div className="p-3.5 rounded-xl bg-[#111315]/80 border border-[#C59B48]/25 text-sm text-[#F2E9D8]/85 leading-relaxed">
                  {briefing.hint}
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {/* Exclusive Custodian Archive ONLY for Xoán (AC-905) */}
      {member.isCustodian && (
        <section className="bg-[#1B1E23] rounded-2xl p-5 border border-[#7B1E26]/50 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#C59B48] shrink-0" />
              <div>
                <h2 className="font-display text-xl font-semibold text-[#F2E9D8]">
                  Archivo de Custodio
                </h2>
                <p className="text-xs text-[#F2E9D8]/65">
                  Exclusivo para Xoán (AC-905) para asistir al grupo.
                </p>
              </div>
            </div>

            {state.custodianUnlocked ? (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPaperRustle();
                  onUpdateState((prev) => ({ ...prev, custodianUnlocked: false }));
                }}
                className="min-h-[40px] px-3.5 py-2 rounded-xl border border-[#F2E9D8]/20 text-xs font-medium text-[#F2E9D8]/80 hover:text-[#F2E9D8] flex items-center gap-1.5 cursor-pointer"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Ocultar soluciones</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPaperRustle();
                  setCustodianConfirmStep((v) => !v);
                }}
                className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#7B1E26] hover:bg-[#8E242D] text-xs font-medium text-[#F2E9D8] flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Abrir Archivo de Custodio</span>
              </button>
            )}
          </div>

          {!state.custodianUnlocked && custodianConfirmStep && (
            <div className="p-4 rounded-xl bg-[#111315] border border-[#7B1E26]/60 space-y-3">
              <p className="text-sm text-[#F2E9D8]/90">
                Este panel contiene los 11 códigos personales y todas las soluciones del juego.
                ¿Confirmas que deseas desplegarlo ahora?
              </p>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playDocumentStamp();
                    setCustodianConfirmStep(false);
                    onUpdateState((prev) => ({ ...prev, custodianUnlocked: true }));
                  }}
                  className="min-h-[40px] px-4 py-2 rounded-xl bg-[#C59B48] text-[#111315] text-xs font-semibold cursor-pointer"
                >
                  Confirmar apertura
                </button>
                <button
                  type="button"
                  onClick={() => setCustodianConfirmStep(false)}
                  className="min-h-[40px] px-4 py-2 rounded-xl border border-[#F2E9D8]/20 text-[#F2E9D8]/75 text-xs cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {state.custodianUnlocked && (
            <div className="flex flex-col gap-5 pt-2 border-t border-[#F2E9D8]/10">
              <div className="space-y-2.5">
                <h3 className="font-mono-code text-xs uppercase tracking-wider text-[#C59B48]">
                  Los 11 códigos de acceso
                </h3>
                <div className="rounded-xl bg-[#111315] border border-[#F2E9D8]/10 divide-y divide-[#F2E9D8]/10">
                  {playableMembers.map((m) => (
                    <div
                      key={m.id}
                      className="px-3.5 py-2.5 flex items-center justify-between gap-3 text-sm"
                    >
                      <div>
                        <span className="font-medium text-[#F2E9D8]">{m.displayName}</span>
                        <span className="text-xs text-[#F2E9D8]/55 ml-2">
                          ({m.category === 'activo' ? 'Activo' : 'Ocasional'})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono-code text-[#C59B48] font-medium">
                          {m.code}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            onCopyText(
                              `Tu código personal para entrar en Archivo Cero es: ${m.code}`,
                              `Código de ${m.displayName} copiado`
                            )
                          }
                          aria-label={`Copiar código de ${m.displayName}`}
                          className="p-1.5 rounded-lg hover:bg-[#1B1E23] text-[#F2E9D8]/70 hover:text-[#C59B48] cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-mono-code text-xs uppercase tracking-wider text-[#C59B48]">
                  Soluciones por capa y llaves personales
                </h3>
                <div className="rounded-xl bg-[#111315] border border-[#F2E9D8]/10 p-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="text-[#F2E9D8]/70">Capa 1 (Plano Gouxa):</span>
                    <span className="font-mono-code text-[#F2E9D8] font-semibold">
                      {LAYER_SOLUTIONS[1]}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-[#F2E9D8]/70">Capa 2 (Memoria):</span>
                    <span className="font-mono-code text-[#F2E9D8] font-semibold">
                      BAILALUA-PEDRO-25
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-[#F2E9D8]/70">Capa 3 (Anular J-00):</span>
                    <span className="font-mono-code text-[#F2E9D8] font-semibold">
                      AGUA-PACTO-GOUXA
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#F2E9D8]/10 space-y-1.5">
                    <p className="text-xs font-mono-code text-[#C59B48]">
                      Capa 4 · Llaves de los 5 Activos:
                    </p>
                    <p className="font-mono-code text-xs text-[#F2E9D8]/90 leading-relaxed">
                      María: {LAYER_4_KEYS.maria} · Charo: {LAYER_4_KEYS.charo} · Rosi:{' '}
                      {LAYER_4_KEYS.rosi} · Pilar: {LAYER_4_KEYS.pilar} · Xoán:{' '}
                      {LAYER_4_KEYS.juan}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
