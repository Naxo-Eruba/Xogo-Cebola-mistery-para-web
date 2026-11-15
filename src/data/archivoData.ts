import { ARCHIVE_ASSETS } from './assets';

export type MemberCategory = 'activo' | 'ocasional' | 'antagonista';

export interface CrossSecret {
  targetId: string;
  targetName: string;
  title: string;
  classification: string;
  body: string;
}

export interface MemberProfile {
  id: string;
  name: string;
  displayName: string;
  code: string;
  category: MemberCategory;
  ringLabel: string;
  zoneId?: 'A' | 'B' | 'C' | 'D' | 'E';
  zoneGlyph?: string;
  personalKey?: string;
  summaryRole: string;
  whatYouHoldByLayer: {
    1: string;
    2: string;
    3: string;
    4: string;
  };
  contingencyClue?: string;
  whatsappAskPrompt: string;
  secretAboutOther?: CrossSecret;
  isCustodian?: boolean;
}

export interface LayerBriefing {
  layer: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  futureLetterTitle: string;
  futureLetterDate: string;
  futureLetterBody: string[];
  objective: string;
  inputLabel: string;
  inputPlaceholder: string;
  hint: string;
  whatsappTemplate: string;
}

export interface GouxaZone {
  id: 'A' | 'B' | 'C' | 'D' | 'E';
  name: string;
  architecturalNote: string;
  holderId: string;
  holderName: string;
  glyph: string;
}

export interface PolaroidEvidence {
  id: string;
  image: string;
  title: string;
  caption: string;
  dateLabel: string;
  minLayer: 1 | 2 | 3 | 4;
  analysis: string;
}

export function normalizeClave(value: string): string {
  return value
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9]/g, '');
}

export const LAYER_SOLUTIONS = {
  1: 'MCV46',
  2: 'BAILALUAPEDRO25',
  3: 'AGUAPACTOGOUXA',
} as const;

export const LAYER_4_KEYS: Record<'maria' | 'charo' | 'rosi' | 'pilar' | 'juan', string> = {
  maria: 'LIRA',
  charo: 'SUIZA',
  rosi: 'VEREDA',
  pilar: 'POZO',
  juan: 'ARIES',
};

export function validateLayerAnswer(layer: 1 | 2 | 3, input: string): boolean {
  return normalizeClave(input) === LAYER_SOLUTIONS[layer];
}

export function validateLayer4Vault(keys: {
  maria: string;
  charo: string;
  rosi: string;
  pilar: string;
  juan: string;
}): { valid: boolean; missingOrWrong: string[] } {
  const checks: Array<{ field: keyof typeof LAYER_4_KEYS; label: string }> = [
    { field: 'maria', label: 'María' },
    { field: 'charo', label: 'Charo' },
    { field: 'rosi', label: 'Rosi' },
    { field: 'pilar', label: 'Pilar' },
    { field: 'juan', label: 'Xoán' },
  ];

  const wrong: string[] = [];
  for (const item of checks) {
    if (normalizeClave(keys[item.field]) !== LAYER_4_KEYS[item.field]) {
      wrong.push(item.label);
    }
  }
  return { valid: wrong.length === 0, missingOrWrong: wrong };
}

export const GOUXA_ZONES: GouxaZone[] = [
  {
    id: 'A',
    name: 'Zona A · Lareira y Salón de Baile',
    architecturalNote: 'Suelo de madera preparado para ensayos de salón y noches largas junto al fuego.',
    holderId: 'maria',
    holderName: 'María',
    glyph: 'M',
  },
  {
    id: 'B',
    name: 'Zona B · Cocina de Piedra',
    architecturalNote: 'Fogón tradicional con encimera de granito y vistas al valle.',
    holderId: 'charo',
    holderName: 'Charo',
    glyph: 'C',
  },
  {
    id: 'C',
    name: 'Zona C · Solaina del Mirador',
    architecturalNote: 'Galería acristalada orientada hacia el Mirador da Gouxa y la niebla de la tarde.',
    holderId: 'rosi',
    holderName: 'Rosi',
    glyph: 'V',
  },
  {
    id: 'D',
    name: 'Zona D · Patio del Pozo Viejo',
    architecturalNote: 'Manantial de piedra musgosa rodeado de hortensias y banco de granito.',
    holderId: 'pilar',
    holderName: 'Pilar',
    glyph: '4',
  },
  {
    id: 'E',
    name: 'Zona E · Desván y Despensa Norte',
    architecturalNote: 'Archivo bajo vigas de castaño donde se guardan mapas, partituras y llaves.',
    holderId: 'juan',
    holderName: 'Xoán',
    glyph: '6',
  },
];

export const MEMBERS: MemberProfile[] = [
  {
    id: 'maria',
    name: 'María',
    displayName: 'María',
    code: 'AC-714',
    category: 'activo',
    ringLabel: 'Anillo Interior · Activo',
    zoneId: 'A',
    zoneGlyph: 'M',
    personalKey: 'LIRA',
    summaryRole: 'Custodia de la Zona A del plano y del Sello PACTO.',
    whatYouHoldByLayer: {
      1: 'En tu copia del plano de Gouxa aparece marcada la Zona A con la letra «M».',
      2: 'Recuerdas las noches de baile y tienes el contacto directo de Pilar y Carmen para confirmar la escuela.',
      3: 'Guardas un fragmento de la Cláusula 2 de J-00 que se anula con la palabra «PACTO».',
      4: 'Tu llave personal para la Cámara Núcleo Cero es: LIRA.',
    },
    whatsappAskPrompt: 'Hola María, estoy cruzando el archivo de La Cebolla. ¿Me pasas tu dato de esta capa (tu marca del plano o llave)?',
    secretAboutOther: {
      targetId: 'charo',
      targetName: 'Charo',
      title: 'Nota reservada sobre Charo',
      classification: 'Ficción lúdica · Uso interno',
      body: 'Según un borrador apócrifo fechado en 2046, Charo mantiene bajo llave un recetario titulado «La cuisine reste à moi» con una norma estricta: nadie entra en la cocina de piedra de Gouxa sin su visto bueno culinario.',
    },
  },
  {
    id: 'charo',
    name: 'Charo',
    displayName: 'Charo',
    code: 'AC-289',
    category: 'activo',
    ringLabel: 'Anillo Interior · Activo',
    zoneId: 'B',
    zoneGlyph: 'C',
    personalKey: 'SUIZA',
    summaryRole: 'Custodia de la Zona B, recuerdos de Londres y del Sello AGUA.',
    whatYouHoldByLayer: {
      1: 'En tu copia del plano de Gouxa aparece marcada la Zona B con la letra «C».',
      2: 'Conservas entradas del West End que confirman los «25» años de amistad de La Cebolla.',
      3: 'Tu expediente registra que la Cláusula 1 de J-00 sobre el manantial cae con la palabra «AGUA».',
      4: 'Tu llave personal para la Cámara Núcleo Cero es: SUIZA.',
    },
    whatsappAskPrompt: 'Hola Charo, ¿me confirmas tu marca del plano de Gouxa o el dato de tus entradas/llave para avanzar en Archivo Cero?',
    secretAboutOther: {
      targetId: 'pilar',
      targetName: 'Pilar',
      title: 'Nota reservada sobre Pilar',
      classification: 'Ficción lúdica · Uso interno',
      body: 'Un apunte ficticio de vigilancia describe a Pilar recogiendo muestras de agua del pozo de Gouxa antes del alba en pequeños frascos botánicos etiquetados con tinta invisible para proteger el manantial.',
    },
  },
  {
    id: 'rosi',
    name: 'Rosi',
    displayName: 'Rosi',
    code: 'AC-503',
    category: 'activo',
    ringLabel: 'Anillo Interior · Activo',
    zoneId: 'C',
    zoneGlyph: 'V',
    personalKey: 'VEREDA',
    summaryRole: 'Custodia de la Zona C, la pista del espejo y del Sello PACTO.',
    whatYouHoldByLayer: {
      1: 'En tu copia del plano de Gouxa aparece marcada la Zona C con la letra «V».',
      2: 'Guardas la nota del espejo antiguo: la palabra invertida «ORDEP» viene de la broma «¿Óscar o Pedro?».',
      3: 'Tu dosier confirma que el segundo sello contra L\'Autòctone responde al nombre «PACTO».',
      4: 'Tu llave personal para la Cámara Núcleo Cero es: VEREDA.',
    },
    whatsappAskPrompt: 'Hola Rosi, estoy cruzando el expediente de Gouxa. ¿Me confirmas tu letra de la Zona C o tu pista/llave?',
    secretAboutOther: {
      targetId: 'juan',
      targetName: 'Xoán',
      title: 'Nota reservada sobre Xoán',
      classification: 'Ficción lúdica · Uso interno',
      body: 'En los archivos imaginarios de 2046 figura un borrador teatral firmado por Xoán donde reparte las habitaciones de Gouxa por orden de ensayo y proyecta una cerradura secreta en la despensa para guardar provisiones de emergencia.',
    },
  },
  {
    id: 'pilar',
    name: 'Pilar',
    displayName: 'Pilar',
    code: 'AC-641',
    category: 'activo',
    ringLabel: 'Anillo Interior · Activo',
    zoneId: 'D',
    zoneGlyph: '4',
    personalKey: 'POZO',
    summaryRole: 'Custodia de la Zona D, memoria de Bailalúa y del Sello AGUA.',
    whatYouHoldByLayer: {
      1: 'En tu copia del plano de Gouxa aparece marcada la Zona D con el dígito «4».',
      2: 'Recuerdas el nombre exacto de la escuela a la que fuisteis tras dejar Pasos: «BAILALUA».',
      3: 'En tu carpeta aparece el primer sello para anular a J-00: «AGUA».',
      4: 'Tu llave personal para la Cámara Núcleo Cero es: POZO.',
    },
    whatsappAskPrompt: 'Hola Pilar, un abrazo grande. Cuando puedas, ¿me confirmas tu número de la Zona D, el nombre de la escuela o tu llave?',
    secretAboutOther: {
      targetId: 'maria',
      targetName: 'María',
      title: 'Nota reservada sobre María',
      classification: 'Ficción lúdica · Uso interno',
      body: 'Consta una leyenda cariñosa de la finca según la cual María enterró un pequeño cuarzo blanco bajo el muro de piedra norte el primer día de visita para asegurar que La Cebolla nunca dejara de reunirse allí.',
    },
  },
  {
    id: 'juan',
    name: 'Xoán',
    displayName: 'Xoán',
    code: 'AC-905',
    category: 'activo',
    ringLabel: 'Anillo Interior · Activo',
    zoneId: 'E',
    zoneGlyph: '6',
    personalKey: 'ARIES',
    isCustodian: true,
    summaryRole: 'Custodio de la Zona E, del Sello GOUXA y del Archivo de Custodio.',
    whatYouHoldByLayer: {
      1: 'En tu copia del plano de Gouxa aparece marcada la Zona E con el dígito «6».',
      2: 'Tienes acceso a la red completa y puedes ayudar a coordinar las piezas entre activos y ocasionales.',
      3: 'Tu carpeta guarda la tercera palabra para frenar la reconversión en L\'Autòctone: «GOUXA».',
      4: 'Tu llave personal para la Cámara Núcleo Cero es: ARIES.',
    },
    whatsappAskPrompt: 'Hola Xoán, ¿me echas una mano confirmando tu dígito de la Zona E o tu llave de la Capa 4?',
    secretAboutOther: {
      targetId: 'rosi',
      targetName: 'Rosi',
      title: 'Nota reservada sobre Rosi',
      classification: 'Ficción lúdica · Uso interno',
      body: 'Se atribuye a Rosi un cuaderno caligrafiado titulado «Las 7 Reglas Claras de Convivencia» para la casa de 2046, cuya primera norma prohíbe opinar antes del primer café en el mirador.',
    },
  },
  {
    id: 'quique',
    name: 'Quique',
    displayName: 'Quique',
    code: 'AC-318',
    category: 'ocasional',
    ringLabel: 'Anillo Exterior · Ocasional',
    summaryRole: 'Testigo de los 25 años (Londres) y co-custodio del Sello GOUXA.',
    whatYouHoldByLayer: {
      1: 'No tienes zona del plano en Capa 1: pregunta a María, Charo, Rosi, Pilar y Xoán por sus 5 letras/números (A-E).',
      2: 'Conservas posavasos y entradas de Londres que datan la amistad del grupo en «25» años.',
      3: 'Tienes una copia del acta donde la tercera cláusula de J-00 se desactiva con «GOUXA».',
      4: 'En Capa 4 debes reunir las 5 llaves personales de María, Charo, Rosi, Pilar y Xoán.',
    },
    contingencyClue: 'Pista de Quique: Los recuerdos del West End confirman el número «25» (Capa 2) y el nombre del mirador «GOUXA» (Sello 3 de Capa 3).',
    whatsappAskPrompt: 'Hola Quique, estamos jugando a Archivo Cero. ¿Me confirmas el número de años en tus entradas de Londres o tu sello de Capa 3?',
    secretAboutOther: {
      targetId: 'jose',
      targetName: 'Jose',
      title: 'Nota reservada sobre Jose',
      classification: 'Ficción lúdica · Uso interno',
      body: 'Un informe ficticio asegura que Jose esconde tras la estantería del salón una colección secreta de partituras de baile de salón listas para un maratón sorpresa en 2046.',
    },
  },
  {
    id: 'oscar',
    name: 'Óscar',
    displayName: 'Óscar',
    code: 'AC-462',
    category: 'ocasional',
    ringLabel: 'Anillo Exterior · Ocasional',
    summaryRole: 'Protagonista del enigma del espejo («¿Óscar o Pedro?»).',
    whatYouHoldByLayer: {
      1: 'En Capa 1 consulta en WhatsApp a los 5 activos por las zonas A, B, C, D y E del plano de Gouxa.',
      2: 'En tu expediente figura el guiño clásico del grupo «¿Óscar o Pedro?», que coincide al invertir ORDEP -> «PEDRO».',
      3: 'Para Capa 3 pide a los demás los tres sellos (AGUA, PACTO y GOUXA).',
      4: 'En Capa 4 reúne las 5 llaves personales de los activos en WhatsApp.',
    },
    contingencyClue: 'Pista de Óscar: La broma histórica «¿Óscar o Pedro?» confirma que el espejo invertido ORDEP se lee «PEDRO» (Capa 2).',
    whatsappAskPrompt: 'Hola Óscar (¿o Pedro?), ¿me confirmas la broma del espejo para desbloquear la Capa 2 de Archivo Cero?',
    secretAboutOther: {
      targetId: 'belen',
      targetName: 'Belén',
      title: 'Nota reservada sobre Belén',
      classification: 'Ficción lúdica · Uso interno',
      body: 'Según un dossier humorístico, Belén organiza ensayos clandestinos de Fit Dance al atardecer en el hórreo de la finca, precisamente lo que Jorge intenta prohibir en L\'Autòctone.',
    },
  },
  {
    id: 'merchy',
    name: 'Merchy',
    displayName: 'Merchy',
    code: 'AC-827',
    category: 'ocasional',
    ringLabel: 'Anillo Exterior · Ocasional',
    summaryRole: 'Guardiana de las entradas del West End (25 años).',
    whatYouHoldByLayer: {
      1: 'Pregunta a los 5 activos por sus marcas del plano de Gouxa (zonas A a E) para abrir la Capa 2.',
      2: 'Guardas las entradas originales del West End de Londres que certifican «25» años de La Cebolla.',
      3: 'Cruza datos en el grupo para obtener los 3 sellos que frenan a J-00.',
      4: 'Recoge las 5 llaves personales de los activos para abrir la Cámara Núcleo Cero.',
    },
    contingencyClue: 'Pista de Merchy: Tus entradas del West End de Londres señalan exactamente «25» años de historia compartida (Capa 2).',
    whatsappAskPrompt: 'Hola Merchy, ¿me confirmas el número que aparece junto a tus entradas de Londres en Archivo Cero?',
    secretAboutOther: {
      targetId: 'carmen',
      targetName: 'Carmen',
      title: 'Nota reservada sobre Carmen',
      classification: 'Ficción lúdica · Uso interno',
      body: 'Un recorte ficticio atribuye a Carmen una libreta secreta con la coreografía exacta del primer día tras dejar Pasos y el mapa de todas las cafeterías donde paraba el grupo.',
    },
  },
  {
    id: 'carmen',
    name: 'Carmen',
    displayName: 'Carmen',
    code: 'AC-159',
    category: 'ocasional',
    ringLabel: 'Anillo Exterior · Ocasional',
    summaryRole: 'Testigo de la escuela Bailalúa y co-custodia del Sello PACTO.',
    whatYouHoldByLayer: {
      1: 'Pregunta en el grupo de WhatsApp a María, Charo, Rosi, Pilar y Xoán por sus zonas del plano.',
      2: 'En tu archivo aparece la escuela donde seguisteis bailando tras dejar Pasos: «BAILALUA».',
      3: 'Tienes acceso a la cláusula intermedia de la finca, que se protege con la palabra «PACTO».',
      4: 'Pregunta a los 5 activos por sus llaves personales para cerrar la investigación.',
    },
    contingencyClue: 'Pista de Carmen: La escuela tras dejar Pasos es «BAILALUA» (Capa 2) y el segundo sello es «PACTO» (Capa 3).',
    whatsappAskPrompt: 'Hola Carmen, ¿me confirmas el nombre de la escuela tras dejar Pasos o tu sello para Archivo Cero?',
    secretAboutOther: {
      targetId: 'merchy',
      targetName: 'Merchy',
      title: 'Nota reservada sobre Merchy',
      classification: 'Ficción lúdica · Uso interno',
      body: 'Un apunte ficticio describe un sobre sellado donde Merchy conserva posavasos de pubs londinenses y entradas del West End ordenadas por año de escapada.',
    },
  },
  {
    id: 'jose',
    name: 'Jose',
    displayName: 'Jose',
    code: 'AC-736',
    category: 'ocasional',
    ringLabel: 'Anillo Exterior · Ocasional',
    summaryRole: 'Co-custodio del Sello GOUXA contra L\'Autòctone.',
    whatYouHoldByLayer: {
      1: 'Pide en WhatsApp las 5 letras o dígitos del plano de Gouxa a los compañeros activos.',
      2: 'Ayuda a cruzar las pistas de Bailalúa, el espejo de Óscar/Pedro y los años en Londres.',
      3: 'Tu archivo conserva el tercer sello territorial frente a J-00: «GOUXA».',
      4: 'Solicita las 5 llaves personales de los activos para completar el Núcleo Cero.',
    },
    contingencyClue: 'Pista de Jose: El tercer sello que anula la conversión elitista de Jorge es «GOUXA» (Capa 3).',
    whatsappAskPrompt: 'Hola Jose, ¿me confirmas el sello que aparece en tu expediente de la Capa 3 en Archivo Cero?',
    secretAboutOther: {
      targetId: 'quique',
      targetName: 'Quique',
      title: 'Nota reservada sobre Quique',
      classification: 'Ficción lúdica · Uso interno',
      body: 'Según un dossier ficticio, Quique guarda un mapa anotado a lápiz con cada cafetería y pub de Londres donde La Cebolla celebró sus primeros viajes hace 25 años.',
    },
  },
  {
    id: 'belen',
    name: 'Belén',
    displayName: 'Belén',
    code: 'AC-940',
    category: 'ocasional',
    ringLabel: 'Anillo Exterior · Ocasional',
    summaryRole: 'Co-custodia del Sello AGUA del manantial de Gouxa.',
    whatYouHoldByLayer: {
      1: 'Pregunta a los 5 activos en WhatsApp por sus marcas de las zonas A, B, C, D y E.',
      2: 'Combina en el grupo la escuela tras Pasos, el espejo y los 25 años.',
      3: 'Tu nota del archivo protege el pozo frente a J-00 con el sello «AGUA».',
      4: 'Reúne las 5 llaves de los activos para abrir el Acta Final de 2046.',
    },
    contingencyClue: 'Pista de Belén: El primer sello para frenar las cláusulas de L\'Autòctone es «AGUA» (Capa 3).',
    whatsappAskPrompt: 'Hola Belén, ¿me confirmas el sello de tu expediente para desmontar la cláusula de L\'Autòctone?',
    secretAboutOther: {
      targetId: 'oscar',
      targetName: 'Óscar',
      title: 'Nota reservada sobre Óscar',
      classification: 'Ficción lúdica · Uso interno',
      body: 'En los papeles humorísticos del archivo figura una tarjeta de reserva en una cafetería del centro a nombre de «Sr. Pedro», usada por Óscar cada vez que alguien repite la broma clásica.',
    },
  },
  {
    id: 'jorge',
    name: 'Jorge (El Ausente)',
    displayName: 'Jorge · Expediente J-00',
    code: 'EXP-J00',
    category: 'antagonista',
    ringLabel: 'Expediente J-00 · Ficción Cómica',
    summaryRole: 'Antagonista ficticio ausente. Promotor secreto de «L\'Autòctone».',
    whatYouHoldByLayer: {
      1: 'Mientras el grupo descansa, J-00 proyecta convertir la casa en un bistró elitista sin alma.',
      2: 'Quiere prohibir el fast food de Londres en la cocina de piedra.',
      3: 'Pretende vetar el Fit Dance y el escándalo alegre de los viernes en La Lira.',
      4: 'Al final de 2046, La Cebolla le reserva una mesa fast-food de reconciliación para que vuelva al grupo.',
    },
    whatsappAskPrompt: 'Aviso de Archivo Cero: Jorge (EXP-J00) está intentando prohibir el Fit Dance y las hamburguesas de Londres en Gouxa.',
  },
];

export const LAYER_BRIEFINGS: Record<1 | 2 | 3 | 4, LayerBriefing> = {
  1: {
    layer: 1,
    title: 'Capa 1 · El Plano Fragmentado de Gouxa',
    subtitle: 'Reconstruir la planta original de la casa',
    futureLetterTitle: 'Primera transmisión desde 2046',
    futureLetterDate: 'Archivo fechado · Otoño de 2046',
    futureLetterBody: [
      'Si estás leyendo este sobre, la operación que amenaza la finca junto al Mirador da Gouxa acaba de ponerse en marcha en vuestro presente de 2026.',
      'En 2046 La Cebolla entera comparte esta casa de piedra rehabilitada. Para protegerla antes de que la conviertan en otra cosa, hemos dividido las escrituras y memorias del grupo en cuatro capas.',
      'Nadie tiene la clave completa en su teléfono. En esta primera capa, los cinco miembros del anillo interior guardan una letra o un número distinto sobre el plano de Gouxa (Zonas A, B, C, D y E).',
    ],
    objective: 'Reúne en orden los 5 símbolos de las zonas A, B, C, D y E del plano de Gouxa (María, Charo, Rosi, Pilar y Xoán).',
    inputLabel: 'Clave del Plano (5 caracteres)',
    inputPlaceholder: 'Ej. XXXXX',
    hint: 'Consulta el Plano interactivo en la pestaña Pruebas: ordena los símbolos de la Zona A (María), Zona B (Charo), Zona C (Rosi), Zona D (Pilar) y Zona E (Xoán) todo seguido.',
    whatsappTemplate: 'Hola La Cebolla, estoy en Capa 1 de Archivo Cero. ¿Qué letra o número os sale a cada activo en vuestra zona del plano de Gouxa (A, B, C, D, E)?',
  },
  2: {
    layer: 2,
    title: 'Capa 2 · Memoria de La Cebolla',
    subtitle: 'Baile, espejo invertido y 25 años de viaje',
    futureLetterTitle: 'Segunda transmisión · Cuaderno de Londres y Salón',
    futureLetterDate: 'Archivo fechado · Invierno de 2046',
    futureLetterBody: [
      'Habéis recompuesto el plano de la casa, pero los muros por sí solos no bastan para acreditar que esta casa pertenece a vuestra historia.',
      'Para superar el segundo filtro tenéis que unir tres recuerdos reales del grupo: la escuela a la que fuisteis tras dejar Pasos, la palabra oculta en el espejo antiguo de la broma clásica y los años de amistad reflejados en las entradas del West End.',
    ],
    objective: 'Une los tres elementos separados por guiones: [ESCUELA]-[NOMBRE DEL ESPEJO]-[AÑOS].',
    inputLabel: 'Clave de Memoria (Formato PALABRA-PALABRA-NÚMERO)',
    inputPlaceholder: 'Ej. ESCUELA-NOMBRE-00',
    hint: 'Pregunta a Pilar o Carmen por la escuela tras dejar Pasos; usa el botón "Invertir espejo" en Pruebas sobre ORDEP (broma de Rosi y Óscar); y pregunta a Merchy, Charo o Quique por los años en las entradas de Londres.',
    whatsappTemplate: 'Hola grupo, estoy en la Capa 2 de Archivo Cero. ¿Me confirmáis: 1) la escuela después de Pasos, 2) la broma de Óscar en el espejo y 3) cuántos años marcan las entradas de Londres?',
  },
  3: {
    layer: 3,
    title: 'Capa 3 · Cláusulas de L\'Autòctone',
    subtitle: 'Desmontar el proyecto de Expediente J-00',
    futureLetterTitle: 'Tercera transmisión · Borrador interceptado a J-00',
    futureLetterDate: 'Archivo fechado · Primavera de 2046',
    futureLetterBody: [
      'Hemos interceptado el plan completo de Jorge (Expediente J-00 · El Ausente). Aprovechando vuestros fines de semana libres, quiere transformar Gouxa en «L\'Autòctone»: un restaurante elitista de menú minúsculo.',
      'Su reglamento interno prohíbe expresamente tres pilares sagrados del grupo: el fast food de Londres, las sesiones de Fit Dance y el escándalo alegre de los viernes en La Lira.',
      'Para anular sus tres cláusulas legales debéis introducir los tres sellos de protección de la finca.',
    ],
    objective: 'Introduce los tres sellos en orden (Sello 1 - Sello 2 - Sello 3) hablando con quienes custodian cada cláusula.',
    inputLabel: 'Clave de Anulación (3 sellos separados por guion)',
    inputPlaceholder: 'Ej. SELLO1-SELLO2-SELLO3',
    hint: 'Sello 1 lo custodian Pilar, Charo y Belén (el recurso del pozo); Sello 2 lo custodian María, Rosi y Carmen (el acuerdo del grupo); Sello 3 lo custodian Xoán, Jose y Quique (el lugar).',
    whatsappTemplate: 'Hola La Cebolla, en la Capa 3 hay que frenar L\'Autòctone. ¿Qué sellos os aparecen en vuestro expediente para las cláusulas 1, 2 y 3?',
  },
  4: {
    layer: 4,
    title: 'Capa 4 · Cámara Núcleo Cero',
    subtitle: 'Las cinco llaves personales de 2046',
    futureLetterTitle: 'Cuarta transmisión · La última cerradura',
    futureLetterDate: 'Archivo fechado · Verano de 2046',
    futureLetterBody: [
      'L\'Autòctone ha quedado archivado. Solo falta abrir la Cámara Núcleo Cero para descubrir quién ha estado enviando estos documentos desde 2046 y leer el Acta Fundacional de la casa.',
      'La cerradura final solo responde cuando se reúnen las cinco llaves personales que custodian María, Charo, Rosi, Pilar y Xoán.',
    ],
    objective: 'Introduce las 5 llaves personales de los compañeros activos para abrir el Acta Final de 2046.',
    inputLabel: 'Las 5 llaves personales',
    inputPlaceholder: '',
    hint: 'Cada uno de los 5 activos (María, Charo, Rosi, Pilar y Xoán) tiene una única palabra en su sección de Capa 4. Pídelas por WhatsApp.',
    whatsappTemplate: '¡Recta final en Archivo Cero! Estoy en la Cámara Núcleo Cero. María, Charo, Rosi, Pilar y Xoán, ¿me pasáis cada uno vuestra llave personal de Capa 4?',
  },
};

export const J00_CLAUSES = [
  {
    id: 'clausula-1',
    code: 'J00-C1',
    title: 'Cláusula del Manantial Privado y Cero Fast Food',
    description:
      'Propuesta de convertir el patio del pozo en terraza de degustación minimalista, prohibiendo expresamente hamburguesas, patatas y bolsas de fast food traídas de viajes a Londres.',
    counterSeal: 'AGUA',
    custodians: 'Pilar · Charo · Belén',
  },
  {
    id: 'clausula-2',
    code: 'J00-C2',
    title: 'Cláusula de Silencio Coreográfico y Cero Fit Dance',
    description:
      'Prohibición total de altavoces, pasos de baile de salón o sesiones improvisadas de Fit Dance en el salón principal bajo pretexto de «atmósfera gastronómica».',
    counterSeal: 'PACTO',
    custodians: 'María · Rosi · Carmen',
  },
  {
    id: 'clausula-3',
    code: 'J00-C3',
    title: 'Cláusula Contra el Escándalo de los Viernes en La Lira',
    description:
      'Reglamento que veta las risas pasadas las diez de la noche y cualquier sobremesa heredada del ambiente de los viernes en La Lira.',
    counterSeal: 'GOUXA',
    custodians: 'Xoán · Jose · Quique',
  },
];

export const POLAROID_ITEMS: PolaroidEvidence[] = [
  {
    id: 'pol-gouxa',
    image: ARCHIVE_ASSETS.gouxasHouse,
    title: 'Finca junto al Mirador da Gouxa',
    caption: 'Casa de piedra · Rehabilitación proyectada 2046',
    dateLabel: 'Prueba P-01 · Galicia',
    minLayer: 1,
    analysis:
      'Fotografía tomada entre la niebla de la tarde. Su estructura original de granito coincide punto por punto con el plano dividido en las cinco zonas A–E.',
  },
  {
    id: 'pol-london',
    image: ARCHIVE_ASSETS.londonTickets,
    title: 'Entradas del West End y posavasos',
    caption: 'Londres · 25 años de amistad sin pausa',
    dateLabel: 'Prueba P-02 · Londres',
    minLayer: 2,
    analysis:
      'Talones conservados por Merchy, Charo y Quique junto a posavasos de cafetería. Acreditan un cuarto de siglo (25 años) de recuerdos compartidos desde las primeras clases de baile.',
  },
  {
    id: 'pol-mirror',
    image: ARCHIVE_ASSETS.antiqueMirror,
    title: 'Espejo de mano y frasco botánico',
    caption: 'Inscripción trasera: ORDEP · Muestras del pozo',
    dateLabel: 'Prueba P-03 · Tocador',
    minLayer: 2,
    analysis:
      'Espejo de latón envejecido con la palabra «ORDEP» grabada en el reverso junto a un pequeño frasco de herbario. Utiliza el visor interactivo inferior para invertir el reflejo.',
  },
  {
    id: 'pol-folder',
    image: ARCHIVE_ASSETS.dossierCover,
    title: 'Carpeta original de Capa Futura',
    caption: 'Remite: 2046 · Destinatario: La Cebolla',
    dateLabel: 'Prueba P-04 · Origen',
    minLayer: 1,
    analysis:
      'Carpeta lacrada sin remitente nominal. Cada miembro del grupo recibió un fragmento distinto para asegurar que solo colaborando pudieran completar el protocolo.',
  },
];

export const FINAL_ACTA_2046 = {
  identityRevealTitle: 'Identidad desvelada de CAPA FUTURA',
  identityName: 'Rosi de 2046 · «La Custodia Silenciosa»',
  identityStory:
    'Durante años guardó en silencio los planos, las notas de convivencia y la memoria de cada encuentro. En 2046 comprendió que la única manera de salvar la casa de Gouxa no era actuar sola, sino romper su silencio y enviar este archivo atrás en el tiempo para que toda La Cebolla lo resolviera unida.',
  actaTitle: 'Acta Fundacional de la Casa de Gouxa · 2046',
  clauses: [
    'La casa rural de piedra junto al Mirador da Gouxa queda protegida para uso y disfrute perpetuo de La Cebolla, sin reglamentos elitistas ni cierres de horario.',
    'Queda garantizado el derecho irrenunciable al Fit Dance en la lareira, a los viajes improvisados, al buen humor de los viernes en La Lira y al fast food traído de Londres sin culpa alguna.',
    'Se reserva en el porche una «Mesa Fast-Food de Reconciliación» con el nombre de Jorge (Expediente J-00), con hamburguesas calientes esperándole en cuanto abandone el proyecto de L\'Autòctone.',
  ],
};
