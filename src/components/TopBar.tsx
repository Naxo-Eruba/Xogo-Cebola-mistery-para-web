import React from 'react';
import { HelpCircle, LogOut, Volume2, VolumeX } from 'lucide-react';
import { MemberProfile } from '../data/archivoData';

interface TopBarProps {
  member: MemberProfile;
  unlockedLayer: 1 | 2 | 3 | 4 | 5;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onToggleHelp: () => void;
  onLogout: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  member,
  unlockedLayer,
  soundEnabled,
  onToggleSound,
  onToggleHelp,
  onLogout,
}) => {
  const layerLabel =
    unlockedLayer === 5 ? 'Completado' : `Capa ${unlockedLayer}/4`;

  return (
    <header className="sticky top-0 z-30 h-13 bg-[#111315]/95 backdrop-blur-md border-b border-[#C59B48]/20">
      <div className="max-w-lg mx-auto h-full px-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-display text-base sm:text-lg font-semibold text-[#F2E9D8] whitespace-nowrap shrink-0">
            Archivo Cero
          </span>
          <span className="text-[#C59B48]/60" aria-hidden="true">
            ·
          </span>
          <span className="text-xs font-mono-code text-[#C59B48] truncate">
            {member.displayName} ({layerLabel})
          </span>
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            onClick={onToggleSound}
            aria-pressed={soundEnabled}
            aria-label={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
            title={soundEnabled ? 'Sonido activo' : 'Sonido silenciado'}
            className="min-h-[40px] min-w-[40px] rounded-lg text-[#F2E9D8]/80 hover:text-[#C59B48] hover:bg-[#1B1E23] flex items-center justify-center transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#C59B48]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#F2E9D8]/45" />
            )}
          </button>

          <button
            type="button"
            onClick={onToggleHelp}
            aria-label="Qué tienes entre manos"
            title="Qué tienes entre manos"
            className="min-h-[40px] min-w-[40px] rounded-lg text-[#F2E9D8]/85 hover:text-[#C59B48] hover:bg-[#1B1E23] flex items-center justify-center transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onLogout}
            aria-label="Salir del expediente"
            title="Salir del expediente"
            className="min-h-[40px] px-2 rounded-lg text-xs font-medium text-[#F2E9D8]/75 hover:text-[#F2E9D8] hover:bg-[#1B1E23] flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
          >
            <LogOut className="w-4 h-4" />
            <span>Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
};
