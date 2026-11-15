import { useEffect, useRef, useState } from 'react';
import { MEMBERS, MemberProfile } from './data/archivoData';
import {
  copyTextToClipboard,
  ExpedienteState,
  loadActiveCode,
  loadExpedienteState,
  loadSoundEnabled,
  saveActiveCode,
  saveExpedienteState,
  saveSoundEnabled,
} from './utils/storage';
import { soundEngine } from './utils/soundEngine';
import { AccessGate } from './components/AccessGate';
import { TopBar } from './components/TopBar';
import { BottomNav, TabKey } from './components/BottomNav';
import { ToastBanner } from './components/ToastBanner';
import { MisionTab } from './components/MisionTab';
import { ArchivoTab } from './components/ArchivoTab';
import { PruebasTab } from './components/PruebasTab';
import { RedTab } from './components/RedTab';
import { DiarioTab } from './components/DiarioTab';

export default function App() {
  const [activeMember, setActiveMember] = useState<MemberProfile | null>(() => {
    const savedCode = loadActiveCode();
    if (!savedCode) return null;
    return MEMBERS.find((m) => m.code === savedCode) || null;
  });

  const [expedienteState, setExpedienteState] = useState<ExpedienteState>(() => {
    const savedCode = loadActiveCode();
    return loadExpedienteState(savedCode || 'guest');
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const initial = loadSoundEnabled();
    soundEngine.setEnabled(initial);
    return initial;
  });

  const [activeTab, setActiveTab] = useState<TabKey>('mision');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMsg(null);
    }, 2800);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  const handleToggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      soundEngine.setEnabled(next);
      saveSoundEnabled(next);
      if (next) {
        soundEngine.playTypewriterClick();
      }
      showToast(next ? 'Sonido analógico activado' : 'Modo silencio activado');
      return next;
    });
  };

  const handleAuthenticate = (member: MemberProfile) => {
    saveActiveCode(member.code);
    const loaded = loadExpedienteState(member.code);
    setActiveMember(member);
    setExpedienteState(loaded);
    setActiveTab('mision');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    soundEngine.playPaperRustle();
    saveActiveCode(null);
    setActiveMember(null);
    setActiveTab('mision');
  };

  const updateState = (updater: (prev: ExpedienteState) => ExpedienteState) => {
    if (!activeMember) return;
    setExpedienteState((prev) => {
      const next = updater(prev);
      saveExpedienteState(activeMember.code, next);
      return next;
    });
  };

  const handleCopyText = async (text: string, feedback: string) => {
    soundEngine.playTypewriterClick();
    const ok = await copyTextToClipboard(text);
    showToast(ok ? feedback : 'No se pudo copiar automáticamente; selecciona el texto manualmente.');
  };

  const handleToggleHelp = () => {
    soundEngine.playPaperRustle();
    setActiveTab('mision');
    updateState((prev) => ({
      ...prev,
      introCardOpen: true,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTab = (tab: TabKey) => {
    if (tab !== activeTab) {
      soundEngine.playPaperRustle();
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddNote = (text: string) => {
    soundEngine.playDocumentStamp();
    const now = new Date();
    const formatted = now.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
    const newNote = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      text,
      createdAt: formatted,
    };
    updateState((prev) => ({
      ...prev,
      notes: [newNote, ...prev.notes],
    }));
    showToast('Nota guardada en tu diario');
  };

  const handleDeleteNote = (id: string) => {
    soundEngine.playPaperRustle();
    updateState((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.id !== id),
    }));
  };

  if (!activeMember) {
    return (
      <>
        <AccessGate
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onAuthenticate={handleAuthenticate}
        />
        <ToastBanner message={toastMsg} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#111315] text-[#F2E9D8] flex flex-col">
      <TopBar
        member={activeMember}
        unlockedLayer={expedienteState.unlockedLayer}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onToggleHelp={handleToggleHelp}
        onLogout={handleLogout}
      />

      <main className="flex-1 w-full max-w-lg mx-auto px-4 pt-5 pb-24">
        {activeTab === 'mision' && (
          <MisionTab
            member={activeMember}
            state={expedienteState}
            onUpdateState={updateState}
            onCopyText={handleCopyText}
            onGoToTab={(tab) => handleSelectTab(tab)}
          />
        )}

        {activeTab === 'archivo' && (
          <ArchivoTab
            member={activeMember}
            unlockedLayer={expedienteState.unlockedLayer}
          />
        )}

        {activeTab === 'pruebas' && (
          <PruebasTab
            member={activeMember}
            unlockedLayer={expedienteState.unlockedLayer}
            mirrorFlipped={expedienteState.mirrorFlipped}
            onToggleMirror={() => {
              soundEngine.playBrassChime();
              updateState((prev) => ({ ...prev, mirrorFlipped: !prev.mirrorFlipped }));
            }}
          />
        )}

        {activeTab === 'red' && (
          <RedTab
            currentMember={activeMember}
            state={expedienteState}
            onUpdateState={updateState}
            onCopyText={handleCopyText}
          />
        )}

        {activeTab === 'diario' && (
          <DiarioTab
            member={activeMember}
            notes={expedienteState.notes}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
          />
        )}
      </main>

      <BottomNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
      />

      <ToastBanner message={toastMsg} />
    </div>
  );
}
