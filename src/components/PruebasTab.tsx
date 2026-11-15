import React, { useState } from 'react';
import { FlipHorizontal, MapPin, Maximize2, X } from 'lucide-react';
import {
  GOUXA_ZONES,
  GouxaZone,
  MemberProfile,
  POLAROID_ITEMS,
  PolaroidEvidence,
} from '../data/archivoData';
import { soundEngine } from '../utils/soundEngine';

interface PruebasTabProps {
  member: MemberProfile;
  unlockedLayer: 1 | 2 | 3 | 4 | 5;
  mirrorFlipped: boolean;
  onToggleMirror: () => void;
}

export const PruebasTab: React.FC<PruebasTabProps> = ({
  member,
  unlockedLayer,
  mirrorFlipped,
  onToggleMirror,
}) => {
  const [selectedZone, setSelectedZone] = useState<GouxaZone>(
    GOUXA_ZONES.find((z) => z.holderId === member.id) || GOUXA_ZONES[0]
  );
  const [activePolaroid, setActivePolaroid] = useState<PolaroidEvidence | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const canRevealZoneGlyph = (zone: GouxaZone) =>
    zone.holderId === member.id || unlockedLayer >= 2;

  const handleSelectZone = (zone: GouxaZone) => {
    soundEngine.playTypewriterClick();
    setSelectedZone(zone);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Interactive SVG Floor Plan of Gouxa */}
      <section className="bg-[#1B1E23] rounded-2xl p-5 border border-[#C59B48]/25 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <span className="font-mono-code text-xs uppercase tracking-wider text-[#C59B48]">
              Prueba Cartográfica · Capa 1
            </span>
            <h2 className="font-display text-2xl font-semibold text-[#F2E9D8] mt-0.5">
              Plano interactivo de Gouxa
            </h2>
            <p className="text-sm text-[#F2E9D8]/75 mt-1">
              Toca cualquiera de las 5 zonas (A–E) para ver quién custodia cada símbolo.
            </p>
          </div>
          {member.zoneId && (
            <span className="font-mono-code text-xs text-[#C59B48] bg-[#111315] px-3 py-1.5 rounded-lg border border-[#C59B48]/30">
              Tu zona: {member.zoneId} ({member.zoneGlyph})
            </span>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {/* Interactive Blueprint SVG */}
          <div className="bg-[#111315] rounded-xl p-2.5 border border-[#C59B48]/20">
            <svg
              viewBox="0 0 600 360"
              className="w-full h-auto select-none"
              role="img"
              aria-label="Plano arquitectónico de la casa de Gouxa dividido en cinco zonas A, B, C, D y E"
            >
              <defs>
                <pattern id="gridGouxa" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path
                    d="M 24 0 L 0 0 0 24"
                    fill="none"
                    stroke="#C59B48"
                    strokeOpacity="0.08"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect x="0" y="0" width="600" height="360" fill="url(#gridGouxa)" rx="12" />

              <text
                x="24"
                y="28"
                fill="#C59B48"
                fontSize="11"
                fontFamily="JetBrains Mono, monospace"
                opacity="0.85"
              >
                MIRADOR DA GOUXA · PLANTA GENERAL
              </text>

              {/* Zone A */}
              <g
                onClick={() => handleSelectZone(GOUXA_ZONES[0])}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleSelectZone(GOUXA_ZONES[0]);
                }}
                aria-label="Zona A Lareira y Salón de Baile"
              >
                <rect
                  x="28"
                  y="48"
                  width="190"
                  height="160"
                  rx="6"
                  fill={selectedZone.id === 'A' ? '#C59B48' : '#1B1E23'}
                  fillOpacity={selectedZone.id === 'A' ? 0.25 : 0.9}
                  stroke={selectedZone.id === 'A' ? '#C59B48' : '#F2E9D8'}
                  strokeOpacity={selectedZone.id === 'A' ? 1 : 0.35}
                  strokeWidth={selectedZone.id === 'A' ? 2.5 : 1.5}
                />
                <text x="44" y="78" fill="#F2E9D8" fontSize="14" fontWeight="600" fontFamily="Playfair Display, serif">
                  ZONA A
                </text>
                <text x="44" y="98" fill="#F2E9D8" fontSize="11" opacity="0.75">
                  Lareira y Salón
                </text>
                <text x="123" y="155" textAnchor="middle" fill="#C59B48" fontSize="30" fontWeight="700" fontFamily="JetBrains Mono, monospace">
                  {canRevealZoneGlyph(GOUXA_ZONES[0]) ? 'M' : '?'}
                </text>
                <text x="123" y="185" textAnchor="middle" fill="#F2E9D8" fontSize="11" opacity="0.75" fontFamily="JetBrains Mono, monospace">
                  María
                </text>
              </g>

              {/* Zone B */}
              <g
                onClick={() => handleSelectZone(GOUXA_ZONES[1])}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleSelectZone(GOUXA_ZONES[1]);
                }}
                aria-label="Zona B Cocina de Piedra"
              >
                <rect
                  x="228"
                  y="48"
                  width="168"
                  height="115"
                  rx="6"
                  fill={selectedZone.id === 'B' ? '#C59B48' : '#1B1E23'}
                  fillOpacity={selectedZone.id === 'B' ? 0.25 : 0.9}
                  stroke={selectedZone.id === 'B' ? '#C59B48' : '#F2E9D8'}
                  strokeOpacity={selectedZone.id === 'B' ? 1 : 0.35}
                  strokeWidth={selectedZone.id === 'B' ? 2.5 : 1.5}
                />
                <text x="244" y="74" fill="#F2E9D8" fontSize="14" fontWeight="600" fontFamily="Playfair Display, serif">
                  ZONA B
                </text>
                <text x="244" y="92" fill="#F2E9D8" fontSize="11" opacity="0.75">
                  Cocina de Piedra
                </text>
                <text x="312" y="130" textAnchor="middle" fill="#C59B48" fontSize="26" fontWeight="700" fontFamily="JetBrains Mono, monospace">
                  {canRevealZoneGlyph(GOUXA_ZONES[1]) ? 'C' : '?'}
                </text>
                <text x="312" y="150" textAnchor="middle" fill="#F2E9D8" fontSize="11" opacity="0.75" fontFamily="JetBrains Mono, monospace">
                  Charo
                </text>
              </g>

              {/* Zone C */}
              <g
                onClick={() => handleSelectZone(GOUXA_ZONES[2])}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleSelectZone(GOUXA_ZONES[2]);
                }}
                aria-label="Zona C Solaina del Mirador"
              >
                <rect
                  x="406"
                  y="48"
                  width="166"
                  height="160"
                  rx="6"
                  fill={selectedZone.id === 'C' ? '#C59B48' : '#1B1E23'}
                  fillOpacity={selectedZone.id === 'C' ? 0.25 : 0.9}
                  stroke={selectedZone.id === 'C' ? '#C59B48' : '#F2E9D8'}
                  strokeOpacity={selectedZone.id === 'C' ? 1 : 0.35}
                  strokeWidth={selectedZone.id === 'C' ? 2.5 : 1.5}
                />
                <text x="422" y="78" fill="#F2E9D8" fontSize="14" fontWeight="600" fontFamily="Playfair Display, serif">
                  ZONA C
                </text>
                <text x="422" y="98" fill="#F2E9D8" fontSize="11" opacity="0.75">
                  Solaina Mirador
                </text>
                <text x="489" y="155" textAnchor="middle" fill="#C59B48" fontSize="30" fontWeight="700" fontFamily="JetBrains Mono, monospace">
                  {canRevealZoneGlyph(GOUXA_ZONES[2]) ? 'V' : '?'}
                </text>
                <text x="489" y="185" textAnchor="middle" fill="#F2E9D8" fontSize="11" opacity="0.75" fontFamily="JetBrains Mono, monospace">
                  Rosi
                </text>
              </g>

              {/* Zone D */}
              <g
                onClick={() => handleSelectZone(GOUXA_ZONES[3])}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleSelectZone(GOUXA_ZONES[3]);
                }}
                aria-label="Zona D Patio del Pozo Viejo"
              >
                <rect
                  x="28"
                  y="218"
                  width="310"
                  height="118"
                  rx="6"
                  fill={selectedZone.id === 'D' ? '#C59B48' : '#1B1E23'}
                  fillOpacity={selectedZone.id === 'D' ? 0.25 : 0.9}
                  stroke={selectedZone.id === 'D' ? '#C59B48' : '#F2E9D8'}
                  strokeOpacity={selectedZone.id === 'D' ? 1 : 0.35}
                  strokeWidth={selectedZone.id === 'D' ? 2.5 : 1.5}
                />
                <circle cx="82" cy="288" r="22" fill="none" stroke="#C59B48" strokeDasharray="4 3" strokeOpacity="0.6" />
                <text x="44" y="246" fill="#F2E9D8" fontSize="14" fontWeight="600" fontFamily="Playfair Display, serif">
                  ZONA D · Patio del Pozo
                </text>
                <text x="220" y="296" textAnchor="middle" fill="#C59B48" fontSize="30" fontWeight="700" fontFamily="JetBrains Mono, monospace">
                  {canRevealZoneGlyph(GOUXA_ZONES[3]) ? '4' : '?'}
                </text>
                <text x="220" y="320" textAnchor="middle" fill="#F2E9D8" fontSize="11" opacity="0.75" fontFamily="JetBrains Mono, monospace">
                  Pilar
                </text>
              </g>

              {/* Zone E */}
              <g
                onClick={() => handleSelectZone(GOUXA_ZONES[4])}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleSelectZone(GOUXA_ZONES[4]);
                }}
                aria-label="Zona E Desván y Despensa Norte"
              >
                <rect
                  x="348"
                  y="218"
                  width="224"
                  height="118"
                  rx="6"
                  fill={selectedZone.id === 'E' ? '#C59B48' : '#1B1E23'}
                  fillOpacity={selectedZone.id === 'E' ? 0.25 : 0.9}
                  stroke={selectedZone.id === 'E' ? '#C59B48' : '#F2E9D8'}
                  strokeOpacity={selectedZone.id === 'E' ? 1 : 0.35}
                  strokeWidth={selectedZone.id === 'E' ? 2.5 : 1.5}
                />
                <text x="364" y="246" fill="#F2E9D8" fontSize="14" fontWeight="600" fontFamily="Playfair Display, serif">
                  ZONA E · Desván
                </text>
                <text x="460" y="296" textAnchor="middle" fill="#C59B48" fontSize="30" fontWeight="700" fontFamily="JetBrains Mono, monospace">
                  {canRevealZoneGlyph(GOUXA_ZONES[4]) ? '6' : '?'}
                </text>
                <text x="460" y="320" textAnchor="middle" fill="#F2E9D8" fontSize="11" opacity="0.75" fontFamily="JetBrains Mono, monospace">
                  Xoán
                </text>
              </g>
            </svg>
          </div>

          {/* Selected Zone Detail */}
          <div className="paper-surface rounded-xl p-5 border border-[#C59B48]/40 space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-[#1D1A16]/15 pb-2.5">
              <div className="flex items-center gap-2 text-[#7B1E26]">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="font-mono-code text-xs uppercase font-semibold">
                  Zona {selectedZone.id}
                </span>
              </div>
              <span className="font-mono-code text-xs text-[#1D1A16]/70">
                Custodia: {selectedZone.holderName}
              </span>
            </div>

            <h3 className="font-display text-xl font-semibold text-[#1D1A16]">
              {selectedZone.name}
            </h3>
            <p className="text-[15px] text-[#1D1A16]/85 leading-relaxed">
              {selectedZone.architecturalNote}
            </p>

            <div className="p-3.5 rounded-lg bg-[#1D1A16]/6 border border-[#1D1A16]/15">
              {canRevealZoneGlyph(selectedZone) ? (
                <p className="text-sm text-[#1D1A16]">
                  Marca registrada en esta zona:{' '}
                  <strong className="font-mono-code text-base text-[#7B1E26]">
                    {selectedZone.glyph}
                  </strong>
                </p>
              ) : (
                <p className="text-sm text-[#1D1A16]/80">
                  Símbolo oculto en tu copia. Pregunta a <strong>{selectedZone.holderName}</strong>{' '}
                  en WhatsApp qué letra o número aparece en su Zona {selectedZone.id}.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Antique Mirror Viewer (ORDEP -> PEDRO) */}
      <section className="bg-[#1B1E23] rounded-2xl p-5 border border-[#C59B48]/25 space-y-4">
        <div>
          <span className="font-mono-code text-xs uppercase tracking-wider text-[#C59B48]">
            Visor Óptico · Capa 2
          </span>
          <h2 className="font-display text-2xl font-semibold text-[#F2E9D8] mt-0.5">
            Espejo de mano antiguo
          </h2>
          <p className="text-sm text-[#F2E9D8]/75 mt-1">
            El grabado trasero aparece reflejado al revés. Pulsa el botón para invertir el espejo.
          </p>
        </div>

        <div className="bg-[#111315] rounded-2xl p-6 border-2 border-[#C59B48]/45 flex flex-col items-center justify-center min-h-[160px]">
          <div className="w-full py-7 px-4 rounded-[999px] border border-[#C59B48]/50 bg-gradient-to-br from-[#23272E] via-[#171A1F] to-[#111315] flex flex-col items-center justify-center shadow-inner">
            <span
              className="font-display text-4xl font-bold tracking-[0.2em] text-[#F2E9D8] transition-transform duration-300 select-none"
              style={{
                transform: mirrorFlipped ? 'scaleX(1)' : 'scaleX(-1)',
              }}
            >
              PEDRO
            </span>
            <span className="font-mono-code text-xs text-[#C59B48] mt-3">
              {mirrorFlipped ? 'Lectura real: PEDRO' : 'Inscripción invertida: ORDEP'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleMirror}
          className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-[#C59B48] hover:bg-[#D4AC5A] text-[#111315] font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <FlipHorizontal className="w-4 h-4" />
          <span>{mirrorFlipped ? 'Volver al reflejo original' : 'Invertir espejo'}</span>
        </button>

        <div className="paper-surface rounded-xl p-4 border border-[#C59B48]/35 space-y-1.5">
          <span className="font-mono-code text-xs text-[#7B1E26] uppercase font-semibold">
            Nota adjunta de Rosi y Óscar
          </span>
          <p className="font-display text-lg font-semibold text-[#1D1A16]">
            «¿Óscar o Pedro?»
          </p>
          <p className="text-sm text-[#1D1A16]/85 leading-relaxed">
            {mirrorFlipped
              ? 'Al invertir el reflejo de ORDEP aparece el nombre PEDRO, guiño directo a la broma histórica del grupo.'
              : 'A simple vista la placa parece decir ORDEP. Usa el botón «Invertir espejo» para leer la palabra tal como es.'}
          </p>
        </div>
      </section>

      {/* 3. Polaroid Evidence Gallery (Vertical Stack) */}
      <section className="space-y-4">
        <div>
          <span className="font-mono-code text-xs uppercase tracking-wider text-[#C59B48]">
            Galería fotográfica
          </span>
          <h2 className="font-display text-2xl font-semibold text-[#F2E9D8] mt-0.5">
            Pruebas Polaroid del expediente
          </h2>
        </div>

        <div className="flex flex-col gap-5">
          {POLAROID_ITEMS.map((item) => {
            const hasFailed = failedImages[item.id];
            return (
              <article
                key={item.id}
                className="bg-[#F2E9D8] text-[#1D1A16] rounded-xl p-3.5 pb-5 shadow-xl border border-[#C59B48]/30"
              >
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#1B1E23]">
                  {!hasFailed ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [item.id]: true }))
                      }
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-4 text-center text-[#F2E9D8]/80 text-sm">
                      {item.title}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playPaperRustle();
                      setActivePolaroid(item);
                    }}
                    aria-label={`Ampliar prueba ${item.title}`}
                    className="absolute bottom-2.5 right-2.5 min-h-[40px] min-w-[40px] px-2.5 rounded-lg bg-[#111315]/85 hover:bg-[#111315] text-[#F2E9D8] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-[#C59B48]" />
                    <span>Ver detalle</span>
                  </button>
                </div>

                <div className="mt-3.5 px-1 space-y-1">
                  <div className="flex items-center justify-between gap-2 text-xs font-mono-code text-[#7B1E26]">
                    <span>{item.dateLabel}</span>
                    <span className="text-[#1D1A16]/55">Capa {item.minLayer}+</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-[#1D1A16]">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#1D1A16]/75 italic">{item.caption}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Polaroid Detail Modal */}
      {activePolaroid && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activePolaroid.title}
          className="fixed inset-0 z-50 bg-[#111315]/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActivePolaroid(null)}
        >
          <div
            className="paper-surface rounded-2xl max-w-md w-full p-5 space-y-4 border border-[#C59B48]/50 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono-code text-xs text-[#7B1E26] font-semibold">
                {activePolaroid.dateLabel}
              </span>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPaperRustle();
                  setActivePolaroid(null);
                }}
                aria-label="Cerrar detalle"
                className="min-h-[40px] min-w-[40px] rounded-lg flex items-center justify-center text-[#1D1A16] hover:bg-[#1D1A16]/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#1B1E23]">
              <img
                src={activePolaroid.image}
                alt={activePolaroid.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-2xl font-semibold text-[#1D1A16]">
                {activePolaroid.title}
              </h3>
              <p className="text-[15px] text-[#1D1A16]/85 leading-relaxed">
                {activePolaroid.analysis}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
