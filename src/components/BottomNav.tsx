import React from 'react';
import { Compass, FolderOpen, Search, Users, BookOpen } from 'lucide-react';

export type TabKey = 'mision' | 'archivo' | 'pruebas' | 'red' | 'diario';

interface BottomNavProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

const NAV_ITEMS: Array<{ key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { key: 'mision', label: 'Misión', icon: Compass },
  { key: 'archivo', label: 'Archivo', icon: FolderOpen },
  { key: 'pruebas', label: 'Pruebas', icon: Search },
  { key: 'red', label: 'Red', icon: Users },
  { key: 'diario', label: 'Diario', icon: BookOpen },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#111315]/95 backdrop-blur-md border-t border-[#C59B48]/25 pb-safe"
    >
      <div className="max-w-lg mx-auto grid grid-cols-5 h-[58px]">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelectTab(item.key)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center min-h-[44px] px-1 transition-colors cursor-pointer ${
                isActive
                  ? 'text-[#C59B48]'
                  : 'text-[#F2E9D8]/65 hover:text-[#F2E9D8]'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-[11px] font-medium mt-0.5 whitespace-nowrap leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
