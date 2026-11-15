import React, { useState } from 'react';
import { Check, Copy, LifeBuoy, ShieldAlert, UserCheck } from 'lucide-react';
import { MEMBERS, MemberProfile } from '../data/archivoData';
import { ExpedienteState } from '../utils/storage';
import { soundEngine } from '../utils/soundEngine';

interface RedTabProps {
  currentMember: MemberProfile;
  state: ExpedienteState;
  onUpdateState: (updater: (prev: ExpedienteState) => ExpedienteState) => void;
  onCopyText: (text: string, feedback: string) => void;
}

const NODE_COORDS: Record<string, { x: number; y: number }> = {
  maria: { x: 240, y: 112 },
  charo: { x: 333, y: 180 },
  rosi: { x: 298, y: 288 },
  pilar: { x: 182, y: 288 },
  juan: { x: 147, y: 180 },
  quique: { x: 240, y: 44 },
  oscar: { x: 384, y: 126 },
  merchy: { x: 384, y: 294 },
  carmen: { x: 240, y: 376 },
  jose: { x: 96, y: 294 },
  belen: { x: 96, y: 126 },
};

export const RedTab: React.FC<RedTabProps> = ({
  currentMember,
  state,
  onUpdateState,
  onCopyText,
}) => {
  const [viewMode, setViewMode] = useState<'tablero' | 'directorio'>('tablero');
  const [selectedId, setSelectedId] = useState<string>('maria');
  const [pendingContingencyId, setPendingContingencyId] = useState<string | null>(null);

  const selectedMember = MEMBERS.find((m) => m.id === selectedId) || MEMBERS[0];

  const activos = MEMBERS.filter((m) => m.category === 'activo');
  const ocasionales = MEMBERS.filter((m) => m.category === 'ocasional');
  const jorge = MEMBERS.find((m) => m.category === 'antagonista');

  const toggleVerified = (memberId: string) => {
    soundEngine.playDocumentStamp();
    onUpdateState((prev) => {
      const exists = prev.verifiedMembers.includes(memberId);
      return {
        ...prev,
        verifiedMembers: exists
          ? prev.verifiedMembers.filter((id) => id !== memberId)
          : [...prev.verifiedMembers, memberId],
      };
    });
  };

  const unlockContingency = (memberId: string) => {
    soundEngine.playDocumentStamp();
    setPendingContingencyId(null);
    onUpdateState((prev) => {
      if (prev.contingenciesUnlocked.includes(memberId)) return prev;
      return {
        ...prev,
        contingenciesUnlocked: [...prev.contingenciesUnlocked, memberId],
      };
    });
  };

  const isVerified = (id: string) =>
    id === currentMember.id || state.verifiedMembers.includes(id);

  return (
    <div className="flex flex-col gap-5">
      {/* Header & Full-Width Vertical Segmented Switch */}
      <div className="space-y-3">
        <div>
          <span className="font-mono-code text-xs uppercase tracking-wider text-[#C59B48]">
            Red de La Cebolla
          </span>
          <h1 className="font-display text-2xl font-semibold text-[#F2E9D8] mt-0.5">
            Conexiones y Directorio
          </h1>
        </div>

        <div
          role="tablist"
          aria-label="Vista de red"
          className="grid grid-cols-2 p-1 rounded-xl bg-[#1B1E23] border border-[#C59B48]/25"
        >
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'tablero'}
            onClick={() => {
              soundEngine.playPaperRustle();
              setViewMode('tablero');
            }}
            className={`min-h-[42px] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
              viewMode === 'tablero'
                ? 'bg-[#C59B48] text-[#111315] font-semibold'
                : 'text-[#F2E9D8]/75 hover:text-[#F2E9D8]'
            }`}
          >
            Tablero La Cebolla
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'directorio'}
            onClick={() => {
              soundEngine.playPaperRustle();
              setViewMode('directorio');
            }}
            className={`min-h-[42px] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
              viewMode === 'directorio'
                ? 'bg-[#C59B48] text-[#111315] font-semibold'
                : 'text-[#F2E9D8]/75 hover:text-[#F2E9D8]'
            }`}
          >
            Directorio (12)
          </button>
        </div>
      </div>

      {viewMode === 'tablero' ? (
        <div className="flex flex-col gap-5">
          {/* Concentric SVG Board */}
          <section className="bg-[#1B1E23] rounded-2xl p-4 border border-[#C59B48]/25">
            <div className="flex items-center justify-between gap-2 mb-3 text-xs font-mono-code text-[#F2E9D8]/70">
              <span>Capas concéntricas del grupo</span>
              <span className="tabular-nums text-[#C59B48]">
                {state.verifiedMembers.length} hilos verificados
              </span>
            </div>

            <div className="bg-[#111315] rounded-xl p-2 border border-[#F2E9D8]/10">
              <svg
                viewBox="0 0 480 420"
                className="w-full h-auto select-none"
                role="img"
                aria-label="Tablero concéntrico de La Cebolla con los cinco activos en el anillo interior y seis ocasionales en el anillo exterior"
              >
                <circle
                  cx="240"
                  cy="210"
                  r="166"
                  fill="none"
                  stroke="#F2E9D8"
                  strokeOpacity="0.14"
                  strokeDasharray="4 4"
                />
                <circle
                  cx="240"
                  cy="210"
                  r="98"
                  fill="none"
                  stroke="#C59B48"
                  strokeOpacity="0.3"
                />
                <circle
                  cx="240"
                  cy="210"
                  r="38"
                  fill="#1B1E23"
                  stroke="#C59B48"
                  strokeWidth="1.5"
                />
                <text
                  x="240"
                  y="206"
                  textAnchor="middle"
                  fill="#F2E9D8"
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="Playfair Display, serif"
                >
                  NÚCLEO
                </text>
                <text
                  x="240"
                  y="220"
                  textAnchor="middle"
                  fill="#C59B48"
                  fontSize="9"
                  fontFamily="JetBrains Mono, monospace"
                >
                  GOUXA
                </text>

                {Object.entries(NODE_COORDS).map(([id, coords]) => {
                  const verified = isVerified(id);
                  return (
                    <line
                      key={`thread-${id}`}
                      x1="240"
                      y1="210"
                      x2={coords.x}
                      y2={coords.y}
                      stroke={verified ? '#C59B48' : '#F2E9D8'}
                      strokeOpacity={verified ? 0.85 : 0.1}
                      strokeWidth={verified ? 2 : 1}
                      strokeDasharray={verified ? undefined : '3 4'}
                    />
                  );
                })}

                {[...activos, ...ocasionales].map((m) => {
                  const pos = NODE_COORDS[m.id];
                  if (!pos) return null;
                  const selected = selectedId === m.id;
                  const verified = isVerified(m.id);
                  const isSelf = m.id === currentMember.id;

                  return (
                    <g
                      key={m.id}
                      onClick={() => {
                        soundEngine.playTypewriterClick();
                        setSelectedId(m.id);
                      }}
                      className="cursor-pointer"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          soundEngine.playTypewriterClick();
                          setSelectedId(m.id);
                        }
                      }}
                      aria-label={`Seleccionar a ${m.displayName}`}
                    >
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={selected ? 25 : 21}
                        fill={verified ? '#C59B48' : '#1B1E23'}
                        stroke={
                          selected
                            ? '#F2E9D8'
                            : verified
                              ? '#F2E9D8'
                              : '#C59B48'
                        }
                        strokeWidth={selected ? 2.5 : 1.5}
                      />
                      <text
                        x={pos.x}
                        y={pos.y + 4}
                        textAnchor="middle"
                        fill={verified ? '#111315' : '#F2E9D8'}
                        fontSize="11"
                        fontWeight="700"
                        fontFamily="Plus Jakarta Sans, sans-serif"
                      >
                        {m.name.split(' ')[0]}
                      </text>
                      {isSelf && (
                        <text
                          x={pos.x}
                          y={pos.y + 34}
                          textAnchor="middle"
                          fill="#C59B48"
                          fontSize="9"
                          fontFamily="JetBrains Mono, monospace"
                        >
                          TÚ
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
            <p className="text-xs text-[#F2E9D8]/65 mt-3">
              Pulsa en cualquier nombre para ver qué pieza guarda y trazar su hilo dorado al cruzar
              datos por WhatsApp.
            </p>
          </section>

          {/* Selected Node Inspector */}
          <section className="paper-surface rounded-2xl p-5 sm:p-6 border border-[#C59B48]/40 space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-[#1D1A16]/15 pb-3">
              <span className="font-mono-code text-xs uppercase text-[#7B1E26] font-semibold">
                {selectedMember.ringLabel}
              </span>
              {selectedMember.id === currentMember.id && (
                <span className="font-mono-code text-xs text-[#1D1A16]/70">Tu expediente</span>
              )}
            </div>

            <div>
              <h2 className="font-display text-2xl font-semibold text-[#1D1A16]">
                {selectedMember.displayName}
              </h2>
              <p className="text-[15px] text-[#1D1A16]/85 mt-1.5 leading-relaxed">
                {selectedMember.summaryRole}
              </p>
            </div>

            {selectedMember.id === currentMember.id ? (
              <div className="p-4 rounded-xl bg-[#1D1A16]/6 border border-[#1D1A16]/15 text-sm text-[#1D1A16]/90">
                Este es tu propio expediente. Tus pistas activas aparecen siempre en la pestaña{' '}
                <strong>Misión</strong>.
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <button
                  type="button"
                  onClick={() => toggleVerified(selectedMember.id)}
                  className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    state.verifiedMembers.includes(selectedMember.id)
                      ? 'bg-[#1D1A16] text-[#F2E9D8] border-[#1D1A16]'
                      : 'bg-white/75 text-[#1D1A16] border-[#1D1A16]/25 hover:bg-white'
                  }`}
                >
                  {state.verifiedMembers.includes(selectedMember.id) ? (
                    <>
                      <Check className="w-4 h-4 text-[#C59B48]" />
                      <span>Hilo verificado con {selectedMember.name}</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4 text-[#7B1E26]" />
                      <span>Marcar dato cruzado con {selectedMember.name}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onCopyText(
                      selectedMember.whatsappAskPrompt,
                      `Mensaje para ${selectedMember.name} copiado`
                    )
                  }
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#7B1E26] hover:bg-[#8E242D] text-[#F2E9D8] text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copiar WhatsApp para {selectedMember.name}</span>
                </button>
              </div>
            )}

            {selectedMember.category === 'ocasional' && selectedMember.contingencyClue && (
              <div className="pt-3 border-t border-[#1D1A16]/15 space-y-2.5">
                {state.contingenciesUnlocked.includes(selectedMember.id) ? (
                  <div className="p-3.5 rounded-xl bg-[#C59B48]/20 border border-[#1D1A16]/20 text-sm text-[#1D1A16]">
                    {selectedMember.contingencyClue}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => unlockContingency(selectedMember.id)}
                    className="w-full min-h-[42px] px-3.5 py-2 rounded-xl border border-[#1D1A16]/25 text-xs font-medium text-[#1D1A16]/85 hover:bg-[#1D1A16]/5 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LifeBuoy className="w-4 h-4 text-[#7B1E26]" />
                    <span>Contingencia: revelar pista si {selectedMember.name} tarda</span>
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      ) : (
        /* Vertical Directory View */
        <div className="flex flex-col gap-6">
          {/* Activos */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-[#C59B48]">
              Anillo Interior · Activos (5)
            </h2>
            <div className="flex flex-col gap-3">
              {activos.map((m) => (
                <article
                  key={m.id}
                  className="bg-[#1B1E23] rounded-2xl p-4 sm:p-5 border border-[#C59B48]/20 space-y-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2 text-xs font-mono-code text-[#C59B48]">
                      <span>{m.ringLabel}</span>
                      {m.zoneId && <span>Zona {m.zoneId}</span>}
                    </div>
                    <h3 className="font-display text-xl font-semibold text-[#F2E9D8]">
                      {m.displayName}
                    </h3>
                    <p className="text-sm text-[#F2E9D8]/80 leading-relaxed">{m.summaryRole}</p>
                  </div>

                  {m.id !== currentMember.id && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-[#F2E9D8]/10">
                      <button
                        type="button"
                        onClick={() =>
                          onCopyText(m.whatsappAskPrompt, `Mensaje para ${m.name} copiado`)
                        }
                        className="min-h-[42px] px-3.5 py-2 rounded-xl bg-[#111315] hover:bg-[#111315]/80 border border-[#C59B48]/35 text-xs font-medium text-[#F2E9D8] flex items-center gap-1.5 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5 text-[#C59B48]" />
                        <span>Copiar WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleVerified(m.id)}
                        className={`min-h-[42px] px-3.5 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 cursor-pointer ${
                          state.verifiedMembers.includes(m.id)
                            ? 'bg-[#C59B48] text-[#111315] border-[#C59B48]'
                            : 'border-[#F2E9D8]/20 text-[#F2E9D8]/80 hover:text-[#F2E9D8]'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>
                          {state.verifiedMembers.includes(m.id) ? 'Verificado' : 'Marcar cruce'}
                        </span>
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>

          {/* Ocasionales */}
          <section className="space-y-3">
            <div>
              <h2 className="font-display text-xl font-semibold text-[#C59B48]">
                Anillo Exterior · Ocasionales (6)
              </h2>
              <p className="text-sm text-[#F2E9D8]/70 mt-0.5">
                Si alguno tarda en contestar en WhatsApp, usa «Contingencia» para desbloquear su
                pista sin esperas.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {ocasionales.map((m) => {
                const contingencyOpen = state.contingenciesUnlocked.includes(m.id);
                const confirming = pendingContingencyId === m.id;
                return (
                  <article
                    key={m.id}
                    className="bg-[#1B1E23] rounded-2xl p-4 sm:p-5 border border-[#F2E9D8]/12 space-y-3"
                  >
                    <div className="space-y-1">
                      <span className="font-mono-code text-xs text-[#F2E9D8]/60">
                        {m.ringLabel}
                      </span>
                      <h3 className="font-display text-xl font-semibold text-[#F2E9D8]">
                        {m.displayName}
                      </h3>
                      <p className="text-sm text-[#F2E9D8]/80 leading-relaxed">
                        {m.summaryRole}
                      </p>
                    </div>

                    {contingencyOpen && m.contingencyClue && (
                      <div className="p-3.5 rounded-xl bg-[#C59B48]/12 border border-[#C59B48]/35 text-sm text-[#F2E9D8]">
                        {m.contingencyClue}
                      </div>
                    )}

                    {confirming && !contingencyOpen && (
                      <div className="p-3 rounded-xl bg-[#111315] border border-[#C59B48]/35 space-y-2">
                        <p className="text-xs text-[#F2E9D8]/85">
                          ¿Desbloquear la pista de contingencia de {m.name}?
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => unlockContingency(m.id)}
                            className="min-h-[36px] px-3 py-1 rounded-lg bg-[#C59B48] text-[#111315] text-xs font-semibold cursor-pointer"
                          >
                            Sí, desbloquear
                          </button>
                          <button
                            type="button"
                            onClick={() => setPendingContingencyId(null)}
                            className="min-h-[36px] px-3 py-1 rounded-lg border border-[#F2E9D8]/20 text-[#F2E9D8]/75 text-xs cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}

                    {m.id !== currentMember.id && (
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-[#F2E9D8]/10">
                        <button
                          type="button"
                          onClick={() =>
                            onCopyText(m.whatsappAskPrompt, `Mensaje para ${m.name} copiado`)
                          }
                          className="min-h-[42px] px-3.5 py-2 rounded-xl bg-[#111315] hover:bg-[#111315]/80 border border-[#C59B48]/35 text-xs font-medium text-[#F2E9D8] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5 text-[#C59B48]" />
                          <span>Copiar WhatsApp</span>
                        </button>

                        {!contingencyOpen && !confirming && (
                          <button
                            type="button"
                            onClick={() => {
                              soundEngine.playPaperRustle();
                              setPendingContingencyId(m.id);
                            }}
                            className="min-h-[42px] px-3.5 py-2 rounded-xl border border-[#F2E9D8]/20 text-xs font-medium text-[#F2E9D8]/80 hover:text-[#C59B48] flex items-center gap-1.5 cursor-pointer"
                          >
                            <LifeBuoy className="w-3.5 h-3.5" />
                            <span>Contingencia</span>
                          </button>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>

          {/* Fictional Absent Antagonist (Jorge) */}
          {jorge && (
            <section className="flex flex-col gap-4">
              <article className="bg-[#1B1E23] rounded-2xl p-5 border border-[#7B1E26]/45 space-y-2.5">
                <div className="flex items-center gap-2 text-[#C59B48]">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span className="font-mono-code text-xs uppercase font-semibold">
                    {jorge.ringLabel}
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold text-[#F2E9D8]">
                  {jorge.displayName}
                </h3>
                <p className="text-sm text-[#F2E9D8]/80 leading-relaxed">
                  {jorge.summaryRole} No entra en la aplicación, pero sus borradores de menú
                  elitista mantienen en vilo las sobremesas de La Cebolla.
                </p>
              </article>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
