import React, { useState } from 'react';
import { Plus, Trash2, BookOpen } from 'lucide-react';
import { MemberProfile } from '../data/archivoData';
import { DiaryNote } from '../utils/storage';
import { soundEngine } from '../utils/soundEngine';

interface DiarioTabProps {
  member: MemberProfile;
  notes: DiaryNote[];
  onAddNote: (text: string) => void;
  onDeleteNote: (id: string) => void;
}

const QUICK_STARTERS = [
  'Zona del plano confirmada: ',
  'Pista recibida por WhatsApp: ',
  'Llave personal de Capa 4: ',
];

export const DiarioTab: React.FC<DiarioTabProps> = ({
  member,
  notes,
  onAddNote,
  onDeleteNote,
}) => {
  const [draft, setDraft] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    onAddNote(trimmed);
    setDraft('');
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <span className="font-mono-code text-xs uppercase tracking-wider text-[#C59B48]">
          Cuaderno de campo · {member.displayName}
        </span>
        <h1 className="font-display text-2xl font-semibold text-[#F2E9D8] mt-0.5">
          Diario de investigación
        </h1>
        <p className="text-sm text-[#F2E9D8]/75 mt-1">
          Anota aquí las letras, nombres o llaves que recibas por WhatsApp. Todo se guarda
          automáticamente en tu dispositivo.
        </p>
      </div>

      {/* New Note Form */}
      <form
        onSubmit={handleSubmit}
        className="paper-surface rounded-2xl p-5 border border-[#C59B48]/40 space-y-4"
      >
        <div className="flex items-center justify-between gap-2 border-b border-[#1D1A16]/15 pb-3">
          <label
            htmlFor="diary-draft"
            className="font-mono-code text-xs uppercase tracking-wider text-[#7B1E26] font-semibold"
          >
            Nueva anotación
          </label>
          <span className="font-mono-code text-xs text-[#1D1A16]/60">
            Guardado local
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {QUICK_STARTERS.map((starter) => (
            <button
              key={starter}
              type="button"
              onClick={() => {
                soundEngine.playTypewriterClick();
                setDraft((prev) => (prev ? `${prev}\n${starter}` : starter));
              }}
              className="min-h-[34px] px-2.5 py-1 rounded-lg bg-[#1D1A16]/8 hover:bg-[#1D1A16]/14 text-xs text-[#1D1A16] font-medium transition-colors cursor-pointer"
            >
              + {starter.replace(': ', '')}
            </button>
          ))}
        </div>

        <textarea
          id="diary-draft"
          rows={4}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Escribe aquí cualquier dato que hayas cruzado con La Cebolla..."
          className="w-full p-3.5 rounded-xl bg-white/85 border border-[#1D1A16]/25 text-[#1D1A16] placeholder:text-[#1D1A16]/45 text-[15px] leading-relaxed focus:border-[#7B1E26] focus:outline-none resize-y"
        />

        <button
          type="submit"
          disabled={!draft.trim()}
          className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-[#1D1A16] hover:bg-[#2B2620] disabled:opacity-45 text-[#F2E9D8] font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 text-[#C59B48]" />
          <span>Guardar nota</span>
        </button>
      </form>

      {/* Notes List */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-xl font-semibold text-[#F2E9D8]">
            Notas guardadas
          </h2>
          <span className="font-mono-code text-xs text-[#C59B48] tabular-nums">
            {notes.length} {notes.length === 1 ? 'nota' : 'notas'}
          </span>
        </div>

        {notes.length === 0 ? (
          <div className="bg-[#1B1E23] rounded-2xl p-6 border border-[#F2E9D8]/12 text-center space-y-2">
            <BookOpen className="w-8 h-8 text-[#C59B48]/70 mx-auto" />
            <p className="font-display text-lg text-[#F2E9D8]">
              Tu cuaderno está todavía en blanco
            </p>
            <p className="text-sm text-[#F2E9D8]/65">
              Cuando empieces a recibir letras del plano de Gouxa o sellos de tus compañeros,
              apúntalos aquí para tenerlos siempre a mano.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {notes.map((note) => (
              <article
                key={note.id}
                className="bg-[#1B1E23] rounded-2xl p-4 border border-[#C59B48]/20 flex items-start justify-between gap-3"
              >
                <div className="space-y-1.5 min-w-0">
                  <span className="block font-mono-code text-xs text-[#C59B48]">
                    {note.createdAt}
                  </span>
                  <p className="text-[15px] text-[#F2E9D8]/90 whitespace-pre-wrap break-words leading-relaxed">
                    {note.text}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteNote(note.id)}
                  aria-label="Borrar nota"
                  title="Borrar nota"
                  className="min-h-[40px] min-w-[40px] rounded-xl text-[#F2E9D8]/55 hover:text-[#F2E9D8] hover:bg-[#7B1E26]/40 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
