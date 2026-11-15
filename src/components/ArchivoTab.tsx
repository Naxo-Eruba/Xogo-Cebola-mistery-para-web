import React from 'react';
import { FileText, Lock, ShieldAlert } from 'lucide-react';
import {
  FINAL_ACTA_2046,
  J00_CLAUSES,
  LAYER_BRIEFINGS,
  MemberProfile,
} from '../data/archivoData';

interface ArchivoTabProps {
  member: MemberProfile;
  unlockedLayer: 1 | 2 | 3 | 4 | 5;
}

export const ArchivoTab: React.FC<ArchivoTabProps> = ({ member, unlockedLayer }) => {
  const letters = ([1, 2, 3, 4] as const).map((layerNum) => ({
    layerNum,
    unlocked: unlockedLayer >= layerNum,
    briefing: LAYER_BRIEFINGS[layerNum],
  }));

  const thirdPartySecret =
    member.secretAboutOther && member.secretAboutOther.targetId !== member.id
      ? member.secretAboutOther
      : null;

  return (
    <div className="flex flex-col gap-5">
      {/* Highlighted Crimson Card: Informe Reservado de Terceros */}
      {thirdPartySecret && (
        <section
          aria-label="Informe Reservado de Terceros"
          className="rounded-2xl p-5 sm:p-6 bg-[#7B1E26] text-[#F2E9D8] border border-[#C59B48]/40 shadow-xl space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F2E9D8]/20 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#C59B48] shrink-0" />
              <span className="font-mono-code text-xs uppercase tracking-wider font-semibold text-[#F2E9D8]">
                Informe Reservado de Terceros
              </span>
            </div>
            <span className="font-mono-code text-xs text-[#F2E9D8]/80">
              {thirdPartySecret.classification}
            </span>
          </div>

          <h2 className="font-display text-2xl font-semibold text-[#F2E9D8]">
            {thirdPartySecret.title}
          </h2>
          <p className="text-[15px] text-[#F2E9D8]/95 leading-relaxed">
            {thirdPartySecret.body}
          </p>
          <p className="text-xs text-[#F2E9D8]/75 pt-1">
            Este apunte es ficción lúdica compartida exclusivamente contigo y permanece oculto en
            el expediente de {thirdPartySecret.targetName}.
          </p>
        </section>
      )}

      {/* Intercepted J-00 Project: L'Autòctone */}
      <section className="bg-[#1B1E23] rounded-2xl p-5 sm:p-6 border border-[#C59B48]/25 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F2E9D8]/10 pb-3">
          <div>
            <span className="font-mono-code text-xs uppercase tracking-wider text-[#C59B48]">
              Expediente J-00 · Jorge (El Ausente)
            </span>
            <h2 className="font-display text-2xl font-semibold text-[#F2E9D8] mt-0.5">
              Proyecto «L&apos;Autòctone»
            </h2>
          </div>
          <span className="font-mono-code text-xs text-[#F2E9D8]/70">
            {unlockedLayer >= 4 ? 'Cláusulas anuladas' : 'Amenaza en curso'}
          </span>
        </div>

        <p className="text-[15px] text-[#F2E9D8]/80 leading-relaxed">
          Documentación interceptada sobre los planes que Jorge prepara en sus fines de semana
          libres para transformar la casa de Gouxa en un restaurante elitista sin fast food de
          Londres, sin Fit Dance y sin el ruido alegre de los viernes en La Lira.
        </p>

        <div className="flex flex-col gap-3">
          {J00_CLAUSES.map((clause, index) => {
            const annulled = unlockedLayer >= 4;
            return (
              <div
                key={clause.id}
                className="rounded-xl p-4 bg-[#111315]/75 border border-[#F2E9D8]/12 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono-code text-xs text-[#C59B48]">
                    Cláusula 0{index + 1} · {clause.code}
                  </span>
                  <span className="font-mono-code text-[11px] text-[#F2E9D8]/60">
                    {annulled ? `Anulada (${clause.counterSeal})` : 'Activa'}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold text-[#F2E9D8]">
                  {clause.title}
                </h3>
                <p className="text-sm text-[#F2E9D8]/75 leading-relaxed">
                  {clause.description}
                </p>
                <p className="text-xs font-mono-code text-[#F2E9D8]/60 pt-2 border-t border-[#F2E9D8]/10">
                  Custodian sello: {clause.custodians}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Letters from Capa Futura */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold text-[#F2E9D8]">
            Cartas de Capa Futura
          </h2>
          <span className="font-mono-code text-xs text-[#C59B48] tabular-nums">
            {Math.min(unlockedLayer, 4)} / 4 recibidas
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {letters.map(({ layerNum, unlocked, briefing }) => (
            <article
              key={layerNum}
              className={`rounded-2xl p-5 border transition-colors ${
                unlocked
                  ? 'paper-surface border-[#C59B48]/40'
                  : 'bg-[#1B1E23]/60 border-[#F2E9D8]/10 text-[#F2E9D8]/60'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-current/15">
                <div className="flex items-center gap-2">
                  {unlocked ? (
                    <FileText className="w-4 h-4 text-[#7B1E26] shrink-0" />
                  ) : (
                    <Lock className="w-4 h-4 text-[#F2E9D8]/45 shrink-0" />
                  )}
                  <span
                    className={`font-mono-code text-xs uppercase tracking-wider font-semibold ${
                      unlocked ? 'text-[#7B1E26]' : 'text-[#F2E9D8]/50'
                    }`}
                  >
                    Capa {layerNum} · {briefing.futureLetterDate}
                  </span>
                </div>
                <span className="font-mono-code text-xs opacity-70">
                  {unlocked ? 'Desclasificada' : 'Sellada'}
                </span>
              </div>

              {unlocked ? (
                <div className="mt-4 space-y-3">
                  <h3 className="font-display text-xl font-semibold text-[#1D1A16]">
                    {briefing.futureLetterTitle}
                  </h3>
                  {briefing.futureLetterBody.map((p, idx) => (
                    <p key={idx} className="text-[15px] text-[#1D1A16]/85 leading-relaxed">
                      {p}
                    </p>
                  ))}
                  <p className="text-sm font-medium text-[#7B1E26] pt-1">
                    Tu aporte en esta carta: {member.whatYouHoldByLayer[layerNum]}
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-sm text-[#F2E9D8]/55">
                  Completa la Capa {layerNum - 1} en la pestaña Misión para abrir esta transmisión de
                  2046.
                </p>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Final Acta summary if unlocked */}
      {unlockedLayer === 5 && (
        <section className="paper-surface rounded-2xl p-5 sm:p-6 border border-[#C59B48]/50 space-y-3">
          <span className="font-mono-code text-xs uppercase tracking-wider text-[#7B1E26] font-semibold">
            Acta Archivada · 2046
          </span>
          <h3 className="font-display text-2xl font-semibold text-[#1D1A16]">
            {FINAL_ACTA_2046.actaTitle}
          </h3>
          <p className="text-[15px] text-[#1D1A16]/85 leading-relaxed">
            Firmada tras la revelación de {FINAL_ACTA_2046.identityName}. La casa rural de Gouxa
            queda protegida para La Cebolla, con mesa fast-food de reconciliación para Jorge.
          </p>
        </section>
      )}
    </div>
  );
};
