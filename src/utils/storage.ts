export interface DiaryNote {
  id: string;
  text: string;
  createdAt: string;
}

export interface ExpedienteState {
  unlockedLayer: 1 | 2 | 3 | 4 | 5; // 5 means Capa 4 completed and Acta Final revealed
  introCardOpen: boolean;
  layer4Keys: {
    maria: string;
    charo: string;
    rosi: string;
    pilar: string;
    juan: string;
  };
  contingenciesUnlocked: string[];
  verifiedMembers: string[];
  mirrorFlipped: boolean;
  notes: DiaryNote[];
  custodianUnlocked: boolean;
}

const ACTIVE_CODE_KEY = 'archivo_cero_active_code_v1';
const EXPEDIENTE_PREFIX = 'archivo_cero_exp_v1_';
const SOUND_ENABLED_KEY = 'archivo_cero_sound_enabled_v1';

export function loadSoundEnabled(): boolean {
  try {
    const raw = localStorage.getItem(SOUND_ENABLED_KEY);
    return raw === null ? true : raw === 'true';
  } catch {
    return true;
  }
}

export function saveSoundEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(SOUND_ENABLED_KEY, String(enabled));
  } catch {
    // Ignore storage errors
  }
}

export function getDefaultExpedienteState(): ExpedienteState {
  return {
    unlockedLayer: 1,
    introCardOpen: true,
    layer4Keys: {
      maria: '',
      charo: '',
      rosi: '',
      pilar: '',
      juan: '',
    },
    contingenciesUnlocked: [],
    verifiedMembers: [],
    mirrorFlipped: false,
    notes: [],
    custodianUnlocked: false,
  };
}

export function loadActiveCode(): string | null {
  try {
    return localStorage.getItem(ACTIVE_CODE_KEY);
  } catch {
    return null;
  }
}

export function saveActiveCode(code: string | null): void {
  try {
    if (code === null) {
      localStorage.removeItem(ACTIVE_CODE_KEY);
    } else {
      localStorage.setItem(ACTIVE_CODE_KEY, code);
    }
  } catch {
    // Ignore storage quota / privacy mode failures
  }
}

export function loadExpedienteState(code: string): ExpedienteState {
  try {
    const raw = localStorage.getItem(`${EXPEDIENTE_PREFIX}${code}`);
    if (!raw) return getDefaultExpedienteState();
    const parsed = JSON.parse(raw) as Partial<ExpedienteState>;
    const defaults = getDefaultExpedienteState();
    return {
      ...defaults,
      ...parsed,
      layer4Keys: {
        ...defaults.layer4Keys,
        ...(parsed.layer4Keys ?? {}),
      },
      contingenciesUnlocked: Array.isArray(parsed.contingenciesUnlocked)
        ? parsed.contingenciesUnlocked
        : [],
      verifiedMembers: Array.isArray(parsed.verifiedMembers) ? parsed.verifiedMembers : [],
      notes: Array.isArray(parsed.notes) ? parsed.notes : [],
    };
  } catch {
    return getDefaultExpedienteState();
  }
}

export function saveExpedienteState(code: string, state: ExpedienteState): void {
  try {
    localStorage.setItem(`${EXPEDIENTE_PREFIX}${code}`, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback below
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
