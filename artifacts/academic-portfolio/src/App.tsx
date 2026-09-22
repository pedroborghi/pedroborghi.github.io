import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import {
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleStop,
  Database,
  Github,
  Heart,
  Languages,
  LibraryBig,
  Mail,
  Menu,
  Moon,
  Network,
  Radio,
  ScanHeart,
  Sun,
  Volume2,
  Waves,
  X,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

type IconType = typeof Radio;

const navItems = [
  { href: '/', key: 'home', icon: Radio },
  { href: '/speech', key: 'speech', icon: Waves },
  { href: '/ecg', key: 'ecg', icon: ScanHeart },
  { href: '/signals', key: 'signals', icon: Network },
  { href: '/databases', key: 'databases', icon: Database },
  { href: '/resources', key: 'resources', icon: LibraryBig },
  { href: '/blog', key: 'blog', icon: BookOpen },
];

type Language = 'EN' | 'PT';

const siteCopy = {
  EN: {
    nav: {
      home: 'Home',
      speech: 'Speech Platform',
      ecg: 'ECG Platform',
      signals: 'Signal and Systems',
      databases: 'Databases',
      resources: 'Resources',
      blog: 'Blog',
    },
    header: {
      discipline: 'electronic / biomedical engineering',
      switchToPortuguese: 'Switch language to Portuguese',
      switchToEnglish: 'Switch language to English',
      lightTheme: 'Use light theme',
      darkTheme: 'Use dark theme',
      closeMenu: 'Close navigation menu',
      openMenu: 'Open navigation menu',
      page: 'Page',
    },
    footer: {
      eyebrow: 'open notebook / 2024',
      description: 'A quiet corner for rigorous work, generous teaching, and the questions that do not fit inside a paper.',
      email: 'Send Email',
      source: 'Source Code',
      donate: 'Donate',
    },
    home: {
      heroEyebrow: '01 / personal academic archive',
      heroTitle: 'Making sense of',
      heroTitleAccent: 'living signals.',
      heroDescription: 'The working notebook of Pedro Henrique Borghi — electronic and biomedical engineer building bridges between computation, physiology, and careful questions.',
      explore: 'Explore the platforms',
      notebook: 'Read the notebook',
      traceLabel: 'LIVE TRACE / 01',
      ecgLabel: 'ECG · 250 Hz',
      amplitudeLabel: 'AMPLITUDE / TIME',
      deltaLabel: 'Δt 0.82 s',
      platformLabel: 'platform / 01',
      aboutEyebrow: '02 / about',
      aboutTitle: 'An engineer with one foot in the lab and one in the world.',
      aboutOne: 'I am an electronic and biomedical engineer interested in the places where a signal becomes knowledge. My work moves through physiological measurement, speech technologies, identification, and the small systems that make research reproducible.',
      aboutTwo: 'This site is part portfolio, part lab bench, and part letter to future collaborators. It collects finished work alongside honest “in construction” signs — because a visible process is also a form of rigor.',
      themes: 'core themes',
      themeList: ['Signal processing & systems', 'Biomedical instrumentation', 'Speech and machine listening', 'Open, teachable engineering'],
      biography: '03 / biography',
      cvShort: 'CURRICULUM VITAE / SHORT FORM',
      role: 'Electronic & Biomedical Engineer',
      bioOne: 'Based between a teaching studio and a signal lab. Currently completing graduate research in biomedical signal analysis while designing tools that make technical concepts easier to touch.',
      bioTwo: 'When I am away from the oscilloscope, I write about mathematics, culture, religion, and learning things badly before learning them well.',
      curricula: 'curricula',
      curriculumItems: [['Traditional CV', '#'], ['ORCID', 'https://orcid.org/'], ['Lattes', 'https://lattes.cnpq.br/'], ['CiênciaVitae', 'https://www.cienciavitae.pt/'], ['LinkedIn', 'https://www.linkedin.com/']],
      affiliations: 'affiliations',
      benchEyebrow: '04 / current bench',
      benchTitle: 'Things taking shape.',
      benchNote: 'Not everything is a finished project. Some work needs room to become precise.',
      speechProject: 'Speech Processing',
      speechProjectDescription: 'A browser-based listening and transcription bench.',
    },
    speech: {
      index: '02 / platform',
      title: 'Speech, made tangible.',
      description: 'A small browser laboratory for moving between voice, language, and the signal beneath both.',
      sttLabel: 'speech to text',
      sttTitle: 'Listening bench',
      sttDescription: 'Use your browser microphone to turn a short thought into editable text. Nothing leaves this page.',
      recording: 'recording',
      ready: 'ready',
      start: 'Start recording',
      stop: 'Stop recording',
      clear: 'Clear',
      transcript: 'Transcript',
      transcriptPlaceholder: 'Your transcript will appear here…',
      recognitionLanguage: 'Recognition language',
      autoDetect: 'Automatic detection',
      english: 'English',
      portuguese: 'Portuguese',
      spanish: 'Spanish',
      detect: 'Detect language',
      detectedLanguage: 'Detected language',
      noDetectedLanguage: 'No language detected yet',
      detectedEnglish: 'English',
      detectedPortuguese: 'Portuguese',
      detectedSpanish: 'Spanish',
      detectedOther: 'Other / uncertain',
      unsupported: 'Speech recognition is not available in this browser. You can still write in the transcript field.',
      micError: 'The microphone stopped before a transcript was returned.',
      ttsLabel: 'text to speech',
      ttsTitle: 'A voice for the draft',
      ttsDescription: 'Test a phrase, listen for its rhythm, then return to the text with a different ear.',
      synthText: 'Text to synthesize',
      synthPlaceholder: 'Type something worth hearing…',
      voice: 'Voice',
      voiceAny: 'Any available voice',
      voiceMale: 'Male',
      voiceFemale: 'Female',
      tone: 'Tone',
      speed: 'Speed',
      volume: 'Volume',
      synthesize: 'Synthesize / play',
      speechApi: 'Web Speech API · local browser session',
      projectLabel: 'project / 02',
      processingEyebrow: 'speech processing / next iteration',
      processingTitle: 'The research layer',
      construction: 'Under construction',
      safeCities: 'Safe Cities Project',
      safeCitiesConstruction: 'Under construction: the project description, activities, results, and scripts will be added',
    },
    ecg: {
      index: '03 / platform',
      title: 'The heart as a signal.',
      description: 'An evolving collection of experiments around electrocardiography, models, and the disciplined work of making physiology legible.',
      sections: ['Master’s work', 'Estimation & Identification course work', 'Information Theory course work', 'Replication of other works', 'Cardiac Simulators', 'Other functionalities'],
      construction: 'Under construction',
    },
    signals: {
      index: '04 / notes',
      title: 'Signal and systems.',
      description: 'A home for the mathematics, intuition, and visual experiments that sit underneath every measured thing.',
      headline: 'A frequency is a relationship.',
      body: 'Fourier analysis, linear systems, filters, and the beautiful trouble of trying to describe a changing world with stable tools.',
      construction: 'Under construction',
    },
    databases: {
      index: '05 / infrastructure',
      title: 'The data behind the trace.',
      description: 'Notes on datasets, schemas, provenance, and the quiet architecture that lets a result be trusted twice.',
      sections: ['Speech', 'ECG', 'Other Data'],
      construction: 'Under construction',
    },
    resources: {
      index: '06 / library',
      title: 'Resources for the work.',
      description: 'A shelf of things I use, write, recommend, and intend to make easier for someone else to pick up.',
      sections: ['Scripts', 'My Papers', 'Bibliography', 'Softwares', 'Guides', 'YouTube Channels'],
      construction: 'Under construction: defining the structure, content, and accessibility',
    },
    blog: {
      index: '07 / notebook',
      title: 'The personal margin.',
      description: 'A place for unfinished thoughts, technical notes, and the occasional account of trying to learn something with my whole body.',
      intro: 'This blog is where I share, according to my availability and desire, opinions, enthusiasms, frustrations, and reports about different subjects. Whatever interests me at the moment, such as hobbies, news, culture, science, and religion. In other words, some texts may have high technical and scientific rigor when they are studies of scientific papers, while also containing informal draft notes. Others may be study notes about a particular mathematical tool. Still others may describe my progress in learning to roller skate and my thoughts about it. The very personal character of this page should be clear, so I must warn about the inaccuracies, errors, speculations, opinions, and limited ability to express myself that will certainly be present.',
      newest: 'newest entries',
      fromNotebook: 'From the notebook',
      archive: 'archive / chronological',
      open: 'Open note',
      loading: 'Opening local markdown archive…',
      close: 'Close blog post',
    },
  },
  PT: {
    nav: {
      home: 'Início',
      speech: 'Plataforma de Fala',
      ecg: 'Plataforma ECG',
      signals: 'Sinais e Sistemas',
      databases: 'Bases de Dados',
      resources: 'Recursos',
      blog: 'Blog',
    },
    header: {
      discipline: 'engenharia eletrónica / biomédica',
      switchToPortuguese: 'Mudar idioma para português',
      switchToEnglish: 'Mudar idioma para inglês',
      lightTheme: 'Usar tema claro',
      darkTheme: 'Usar tema escuro',
      closeMenu: 'Fechar menu de navegação',
      openMenu: 'Abrir menu de navegação',
      page: 'Página',
    },
    footer: {
      eyebrow: 'caderno aberto / 2024',
      description: 'Um lugar tranquilo para trabalho rigoroso, ensino generoso e perguntas que não cabem num artigo.',
      email: 'Enviar Email',
      source: 'Código Fonte',
      donate: 'Doar',
    },
    home: {
      heroEyebrow: '01 / arquivo académico pessoal',
      heroTitle: 'Dar sentido a',
      heroTitleAccent: 'sinais vivos.',
      heroDescription: 'O caderno de trabalho de Pedro Henrique Borghi — engenheiro eletrónico e biomédico que constrói pontes entre computação, fisiologia e perguntas cuidadosas.',
      explore: 'Explorar as plataformas',
      notebook: 'Ler o caderno',
      traceLabel: 'TRAÇO AO VIVO / 01',
      ecgLabel: 'ECG · 250 Hz',
      amplitudeLabel: 'AMPLITUDE / TEMPO',
      deltaLabel: 'Δt 0,82 s',
      platformLabel: 'plataforma / 01',
      aboutEyebrow: '02 / sobre',
      aboutTitle: 'Um engenheiro com um pé no laboratório e outro no mundo.',
      aboutOne: 'Sou engenheiro eletrónico e biomédico interessado nos lugares onde um sinal se transforma em conhecimento. O meu trabalho passa por medição fisiológica, tecnologias da fala, identificação e pequenos sistemas que tornam a investigação reproduzível.',
      aboutTwo: 'Este site é parte portefólio, parte bancada de laboratório e parte carta para futuros colaboradores. Reúne trabalho concluído com honestos sinais de “em construção” — porque um processo visível também é uma forma de rigor.',
      themes: 'temas centrais',
      themeList: ['Processamento de sinais e sistemas', 'Instrumentação biomédica', 'Fala e escuta automática', 'Engenharia aberta e ensinável'],
      biography: '03 / biografia',
      cvShort: 'CURRICULUM VITAE / FORMA CURTA',
      role: 'Engenheiro Eletrónico e Biomédico',
      bioOne: 'Entre um estúdio de ensino e um laboratório de sinais. Atualmente a concluir investigação de pós-graduação em análise de sinais biomédicos enquanto desenho ferramentas que tornam conceitos técnicos mais fáceis de tocar.',
      bioTwo: 'Quando estou longe do osciloscópio, escrevo sobre matemática, cultura, religião e sobre aprender coisas mal antes de as aprender bem.',
      curricula: 'currículos',
      curriculumItems: [['CV tradicional', '#'], ['ORCID', 'https://orcid.org/'], ['Lattes', 'https://lattes.cnpq.br/'], ['CiênciaVitae', 'https://www.cienciavitae.pt/'], ['LinkedIn', 'https://www.linkedin.com/']],
      affiliations: 'afiliações',
      benchEyebrow: '04 / bancada atual',
      benchTitle: 'Coisas a ganhar forma.',
      benchNote: 'Nem todo o projeto está terminado. Alguns precisam de espaço para se tornarem precisos.',
      speechProject: 'Processamento da Fala',
      speechProjectDescription: 'Uma bancada de escuta e transcrição no navegador.',
    },
    speech: {
      index: '02 / plataforma',
      title: 'A fala tornada tangível.',
      description: 'Um pequeno laboratório no navegador para passar entre voz, linguagem e o sinal por baixo de ambas.',
      sttLabel: 'fala para texto',
      sttTitle: 'Bancada de escuta',
      sttDescription: 'Use o microfone do navegador para transformar um pensamento breve em texto editável. Nada sai desta página.',
      recording: 'a gravar',
      ready: 'pronto',
      start: 'Começar gravação',
      stop: 'Parar gravação',
      clear: 'Limpar',
      transcript: 'Transcrição',
      transcriptPlaceholder: 'A sua transcrição aparecerá aqui…',
      recognitionLanguage: 'Idioma de reconhecimento',
      autoDetect: 'Deteção automática',
      english: 'Inglês',
      portuguese: 'Português',
      spanish: 'Espanhol',
      detect: 'Detetar idioma',
      detectedLanguage: 'Idioma detetado',
      noDetectedLanguage: 'Ainda não foi detetado nenhum idioma',
      detectedEnglish: 'Inglês',
      detectedPortuguese: 'Português',
      detectedSpanish: 'Espanhol',
      detectedOther: 'Outro / incerto',
      unsupported: 'O reconhecimento de fala não está disponível neste navegador. Ainda pode escrever no campo de transcrição.',
      micError: 'O microfone parou antes de devolver uma transcrição.',
      ttsLabel: 'texto para fala',
      ttsTitle: 'Uma voz para o rascunho',
      ttsDescription: 'Teste uma frase, escute o seu ritmo e volte ao texto com outro ouvido.',
      synthText: 'Texto a sintetizar',
      synthPlaceholder: 'Escreva algo que valha a pena ouvir…',
      voice: 'Voz',
      voiceAny: 'Qualquer voz disponível',
      voiceMale: 'Masculina',
      voiceFemale: 'Feminina',
      tone: 'Tom',
      speed: 'Velocidade',
      volume: 'Volume',
      synthesize: 'Sintetizar / reproduzir',
      speechApi: 'Web Speech API · sessão local do navegador',
      projectLabel: 'projeto / 02',
      processingEyebrow: 'processamento da fala / próxima iteração',
      processingTitle: 'A camada de investigação',
      construction: 'Em construção',
      safeCities: 'Projeto Cidades Seguras',
      safeCitiesConstruction: 'Em construção: será acrescentada a descrição do projeto, as atividades desenvolvidas, os resultados obtidos e os scripts',
    },
    ecg: {
      index: '03 / plataforma',
      title: 'O coração como sinal.',
      description: 'Uma coleção em evolução de experiências sobre eletrocardiografia, modelos e o trabalho disciplinado de tornar a fisiologia legível.',
      sections: ['Trabalho de mestrado', 'Trabalho da disciplina de Estimação e Identificação', 'Trabalho da disciplina de Teoria da Informação', 'Replicação de outros trabalhos', 'Simuladores cardíacos', 'Outras funcionalidades'],
      construction: 'Em construção',
    },
    signals: {
      index: '04 / notas',
      title: 'Sinais e sistemas.',
      description: 'Um lugar para a matemática, a intuição e as experiências visuais por baixo de tudo o que é medido.',
      headline: 'Uma frequência é uma relação.',
      body: 'Análise de Fourier, sistemas lineares, filtros e a bela dificuldade de tentar descrever um mundo em mudança com ferramentas estáveis.',
      construction: 'Em construção',
    },
    databases: {
      index: '05 / infraestrutura',
      title: 'Os dados por trás do traço.',
      description: 'Notas sobre conjuntos de dados, esquemas, proveniência e a arquitetura silenciosa que permite confiar duas vezes num resultado.',
      sections: ['Fala', 'ECG', 'Outros dados'],
      construction: 'Em construção',
    },
    resources: {
      index: '06 / biblioteca',
      title: 'Recursos para o trabalho.',
      description: 'Uma estante de coisas que uso, escrevo, recomendo e pretendo tornar mais fáceis de pegar por outra pessoa.',
      sections: ['Scripts', 'Os meus artigos', 'Bibliografia', 'Software', 'Guias', 'Canais do YouTube'],
      construction: 'Em construção: definindo a estrutura, o conteúdo e a acessibilidade',
    },
    blog: {
      index: '07 / caderno',
      title: 'A margem pessoal.',
      description: 'Um lugar para pensamentos inacabados, notas técnicas e o relato ocasional de tentar aprender algo com o corpo inteiro.',
      intro: 'Este blog serve para eu compartilhar, de acordo com a minha disponibilidade e vontade, opiniões, entusiasmos, frustrações e relatos sobre temas diversos. Os que me apetecerem no momento, como hobbies, notícias, cultura, ciência e religião. Ou seja, alguns textos podem ter alto rigor técnico e científico no caso de um estudo de artigo científico, ao mesmo tempo que pode conter notas informais de rascunho. Outros podem ser notas de estudo sobre uma determinada ferramenta matemática. Ainda outros podem ser a descrição do meu progresso em aprender a andar de patins e meus pensamentos sobre. Nota-se o caráter muito pessoal desta página, por isso devo deixar um alerta sobre as imprecisões, os erros, as especulações, as opiniões e a minha capacidade limitada de expressão que certamente estarão presentes.',
      newest: 'entradas recentes',
      fromNotebook: 'Do caderno',
      archive: 'arquivo / cronológico',
      open: 'Abrir nota',
      loading: 'A abrir arquivo markdown local…',
      close: 'Fechar publicação',
    },
  },
} as const;

type SiteCopy = typeof siteCopy.EN;
type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void };
const LanguageContext = createContext<LanguageContextValue | null>(null);

function useSiteCopy() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useSiteCopy must be used inside LanguageContext');
  return { ...context, copy: siteCopy[context.language] };
}

const affiliations = [
  {
    name: 'Federal University of Santa Catarina',
    address: 'Campus Universitário, Trindade',
    postalCode: '88040-900',
    city: 'Florianópolis',
    country: 'Brazil',
    email: 'contact@example.edu',
    website: 'https://ufsc.br/',
    role: 'Research collaborator',
    rolePt: 'Colaborador de investigação',
    period: '2022—present',
    periodPt: '2022—presente',
  },
  {
    name: 'Biomedical Engineering Laboratory',
    address: 'Research Centre, Avenida da Universidade 1',
    postalCode: '1649-004',
    city: 'Lisbon',
    country: 'Portugal',
    email: 'lab@example.org',
    website: 'https://www.example.org/',
    role: 'Signal analysis group',
    rolePt: 'Grupo de análise de sinais',
    period: '2023—present',
    periodPt: '2023—presente',
  },
  {
    name: 'IEEE Engineering in Medicine & Biology Society',
    address: '445 Hoes Lane',
    postalCode: '08854',
    city: 'Piscataway, NJ',
    country: 'United States',
    email: 'embs@example.org',
    website: 'https://www.embs.org/',
    role: 'Student member',
    rolePt: 'Membro estudante',
    period: '2021—present',
    periodPt: '2021—presente',
  },
];

interface BlogPostCopy {
  title: string;
  category: string;
  excerpt: string;
  body: string[];
}

interface BlogPost {
  id: string;
  date: string;
  visual: string;
  en: BlogPostCopy;
  pt: BlogPostCopy;
}

const posts: BlogPost[] = [
  {
    id: 'spectral-notes',
    date: '2024-05-18',
    visual: 'spectral',
    en: {
      title: 'Notes on listening to signals',
      category: 'signal processing',
      excerpt: 'A conversation between the ear, the Fourier window, and what we insist on calling noise.',
      body: [
        'There is a particular kind of attention that appears when you observe a signal for long enough. The trace stops being a sequence of values and becomes an event.',
        'This note gathers a few intuitions about windows, spectra, and the difference between removing an imperfection and erasing information. Technique matters, but the right question usually arrives before it.',
      ],
    },
    pt: {
      title: 'Notas sobre a escuta de sinais',
      category: 'processamento de sinais',
      excerpt: 'Uma conversa entre o ouvido, a janela de Fourier e aquilo que insistimos em chamar de ruído.',
      body: [
        'Há uma forma particular de atenção que nasce quando se observa um sinal durante tempo suficiente. O traço deixa de ser uma sequência de valores e passa a ser um acontecimento.',
        'Nesta nota, reúno algumas intuições sobre janelas, espectros e a diferença entre remover uma imperfeição e apagar uma informação. A técnica é importante, mas a pergunta certa costuma chegar antes dela.',
      ],
    },
  },
  {
    id: 'small-tools',
    date: '2024-02-06',
    visual: 'tools',
    en: {
      title: 'Small tools, generous intervals',
      category: 'engineering practice',
      excerpt: 'On scripts that solve a ten-minute task and end up changing an entire afternoon.',
      body: [
        'The best scripts I have written do not look like systems. They are small levers: a file reader, a figure that updates, a check that prevents a repeated mistake.',
        'Everyday engineering is made of these intervals between an idea and its verification. Documenting the path is often more useful than keeping only the final result.',
      ],
    },
    pt: {
      title: 'Pequenas ferramentas, grandes intervalos',
      category: 'prática de engenharia',
      excerpt: 'Sobre scripts que resolvem uma tarefa de dez minutos e acabam por mudar uma tarde inteira.',
      body: [
        'Os melhores scripts que escrevi não parecem sistemas. São pequenas alavancas: um leitor de ficheiros, uma figura que se atualiza, uma verificação que evita um erro repetido.',
        'A engenharia quotidiana é feita destes intervalos entre a ideia e a sua verificação. Documentar o caminho é, muitas vezes, mais útil do que guardar apenas o resultado final.',
      ],
    },
  },
  {
    id: 'learning-by-reproducing',
    date: '2023-11-21',
    visual: 'reproduce',
    en: {
      title: 'Learning by reproducing',
      category: 'research diary',
      excerpt: 'An honest attempt to repeat published results and discover what remains outside the caption.',
      body: [
        'Reproducing a published result is a strange activity: it starts as copying and ends as critical reading. Between those moments are details about data, seeds, conversions, and choices that do not fit on a page.',
        'Error also has a teaching function. When a graph does not match, it points toward a hypothesis we do not yet fully understand.',
      ],
    },
    pt: {
      title: 'Aprender reproduzindo',
      category: 'diário de investigação',
      excerpt: 'Uma tentativa honesta de repetir resultados publicados e descobrir o que fica fora da legenda.',
      body: [
        'Reproduzir um resultado publicado é uma atividade estranha: começa como cópia e termina como leitura crítica. Entre os dois momentos há detalhes sobre dados, sementes, conversões e escolhas que não cabem numa página.',
        'O erro também tem uma função pedagógica. Quando um gráfico não coincide, ele aponta para uma hipótese que ainda não compreendemos completamente.',
      ],
    },
  },
];

function LogoMark() {
  return (
    <span className="logo-mark" aria-hidden="true">
      <svg viewBox="0 0 80 80" className="logo-mark-svg">
        <g className="chip-body" transform="rotate(-8 40 40)">
          <rect x="18" y="18" width="44" height="44" rx="4" />
          <path d="M10 24h8M10 34h8M10 44h8M10 54h8M62 24h8M62 34h8M62 44h8M62 54h8M24 10v8M34 10v8M44 10v8M54 10v8M24 62v8M34 62v8M44 62v8M54 62v8" />
        </g>
        <path className="logo-ecg-base" pathLength="100" d="M19 41H21.5C22.5 41 22.7 36.8 24.5 36.8C26.3 36.8 26.5 41 28 41H31L32.2 43.5L34.8 27L37.2 45L39.2 41H47C48.5 41 49.3 35 52.2 35C55.1 35 55.7 41 57.2 41H61" />
        <path className="logo-ecg-playhead" pathLength="100" d="M19 41H21.5C22.5 41 22.7 36.8 24.5 36.8C26.3 36.8 26.5 41 28 41H31L32.2 43.5L34.8 27L37.2 45L39.2 41H47C48.5 41 49.3 35 52.2 35C55.1 35 55.7 41 57.2 41H61" />
      </svg>
    </span>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('academic-theme') === 'dark';
  });
  const [language, setLanguage] = useState<'EN' | 'PT'>('EN');
  const copy = siteCopy[language];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.lang = language === 'PT' ? 'pt-PT' : 'en';
    localStorage.setItem('academic-theme', dark ? 'dark' : 'light');
  }, [dark, language]);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);

  const current = navItems.find((item) => item.href === location);
  const navLabel = (item: (typeof navItems)[number]) => copy.nav[item.key as keyof typeof copy.nav];

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <div className="site-shell">
      <header className="site-header sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur">
        <div className="site-header-inner mx-auto flex h-[74px] w-[min(1180px,calc(100%-40px))] items-center justify-between gap-4">
          <Link href="/" className="site-identity group flex items-center gap-3" data-testid="link-site-logo">
            <LogoMark />
            <span className="site-wordmark hidden leading-tight sm:block">
              <span className="block text-[.78rem] font-bold tracking-[.08em] text-foreground">PEDRO HENRIQUE BORGHI</span>
              <span className="block font-mono text-[.62rem] uppercase tracking-[.16em] text-muted-foreground">{copy.header.discipline}</span>
            </span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  href={item.href}
                  key={item.href}
                  className="nav-link flex items-center gap-1.5 rounded-md px-2.5 py-2 text-[.76rem] font-bold"
                  aria-current={location === item.href ? 'page' : undefined}
                  data-testid={`link-nav-${item.key}`}
                >
                  <span className="nav-icon"><Icon size={15} strokeWidth={1.8} aria-hidden="true" /></span>
                  <span className="nav-label">{navLabel(item)}</span>
                </Link>
              );
            })}
          </nav>
          <div className="header-actions flex items-center gap-1.5">
            <button
              type="button"
              className="language-toggle icon-button h-9 rounded-md px-2 font-mono text-[.68rem] font-bold"
              onClick={() => setLanguage(language === 'EN' ? 'PT' : 'EN')}
                aria-label={language === 'EN' ? copy.header.switchToPortuguese : copy.header.switchToEnglish}
              data-testid="button-language-toggle"
            >
              <Languages size={15} className="mr-1" aria-hidden="true" /> {language}
            </button>
            <button
              type="button"
              className="icon-button h-9 w-9 rounded-md"
              onClick={() => setDark(!dark)}
                aria-label={dark ? copy.header.lightTheme : copy.header.darkTheme}
              data-testid="button-theme-toggle"
            >
              {dark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
            </button>
            <button
              type="button"
              className="icon-button mobile-menu h-9 w-9 rounded-md"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
                aria-label={menuOpen ? copy.header.closeMenu : copy.header.openMenu}
              data-testid="button-mobile-menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="mobile-menu mx-auto w-[min(100%-24px,680px)] flex-col gap-1 border-t border-border/70 py-3" aria-label="Mobile navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  href={item.href}
                  key={item.href}
                  className="nav-link flex items-center gap-3 rounded-md px-3 py-3 text-sm font-bold"
                  aria-current={location === item.href ? 'page' : undefined}
                    data-testid={`link-mobile-nav-${item.key}`}
                >
                  <Icon size={16} aria-hidden="true" /> {navLabel(item)}
                </Link>
              );
            })}
          </nav>
        )}
      </header>
      <main className="site-main py-10 sm:py-14">{children}</main>
      <Footer />
      <div className="pointer-events-none fixed inset-0 z-[-1] opacity-[.035]" aria-hidden="true" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 180 180%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%22.75%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%22.7%22/%3E%3C/svg%3E")' }} />
      <span className="sr-only" data-testid="text-current-page">{current ? navLabel(current) : copy.header.page}</span>
      </div>
    </LanguageContext.Provider>
  );
}

function Footer() {
  const { copy } = useSiteCopy();
  return (
    <footer className="mt-16 border-t border-border bg-secondary text-secondary-foreground">
      <div className="mx-auto flex w-[min(1180px,calc(100%-40px))] flex-col gap-7 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow !text-primary-foreground/65">{copy.footer.eyebrow}</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-secondary-foreground/70">
            {copy.footer.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <a href="mailto:pedro.henrique.borghi@example.com" className="flex items-center gap-2 underline decoration-secondary-foreground/25 underline-offset-4 transition hover:text-primary-foreground" data-testid="link-footer-email"><Mail size={15} /> {copy.footer.email}</a>
          <a href="https://github.com/" target="_blank" rel="noreferrer" className="flex items-center gap-2 underline decoration-secondary-foreground/25 underline-offset-4 transition hover:text-primary-foreground" data-testid="link-footer-github"><Github size={15} /> {copy.footer.source}</a>
          <a href="https://ko-fi.com/" target="_blank" rel="noreferrer" className="flex items-center gap-2 underline decoration-secondary-foreground/25 underline-offset-4 transition hover:text-primary-foreground" data-testid="link-footer-donate"><Heart size={15} /> {copy.footer.donate}</a>
        </div>
      </div>
    </footer>
  );
}

function PageIntro({ index, title, description, icon: Icon }: { index: string; title: string; description: string; icon: IconType }) {
  return (
    <div className="mb-12 grid gap-7 border-b border-border pb-10 md:grid-cols-[120px_1fr] md:gap-10">
      <div className="flex items-start gap-3 md:block">
        <span className="eyebrow block pt-1">{index}</span>
        <Icon className="text-primary md:mt-8" size={31} strokeWidth={1.3} aria-hidden="true" />
      </div>
      <div>
        <h1 className="section-title max-w-3xl animate-rise">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground animate-rise-delay-1">{description}</p>
      </div>
    </div>
  );
}

function Construction({ children }: { children?: string }) {
  const { copy } = useSiteCopy();
  return <p className="construction text-sm leading-relaxed" data-testid="status-construction">{children ?? copy.speech.construction}</p>;
}

function Home() {
  const { copy } = useSiteCopy();
  return (
    <>
      <section className="grid gap-8 pb-16 pt-3 lg:grid-cols-[1.04fr_.96fr] lg:items-center lg:gap-14">
        <div>
          <p className="eyebrow animate-rise">{copy.home.heroEyebrow}</p>
          <h1 className="display-title mt-5 max-w-3xl animate-rise-delay-1">
            {copy.home.heroTitle}<br /><span className="text-primary">{copy.home.heroTitleAccent}</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground animate-rise-delay-2">
            {copy.home.heroDescription}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3 animate-rise-delay-3">
            <Link href="/speech" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition hover:-translate-y-0.5 hover:brightness-105" data-testid="link-hero-speech">
              {copy.home.explore} <ArrowUpRight size={16} />
            </Link>
            <Link href="/blog" className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-3 text-sm font-bold transition hover:border-primary hover:text-primary" data-testid="link-hero-blog">
              {copy.home.notebook} <ChevronRight size={16} />
            </Link>
          </div>
        </div>
        <div className="scope-art paper-grid animate-rise-delay-2" role="img" aria-label={copy.home.ecgLabel}>
          <span className="scope-label left-5 top-5">{copy.home.traceLabel}</span>
          <span className="scope-label right-5 top-5 text-primary">{copy.home.ecgLabel}</span>
          <span className="scope-label bottom-5 left-5">{copy.home.amplitudeLabel}</span>
          <span className="scope-label bottom-5 right-5">{copy.home.deltaLabel}</span>
          <span className="scope-wave" />
          <span className="absolute bottom-[35%] left-[16%] h-2 w-2 rounded-full bg-accent shadow-[0_0_0_5px_hsl(var(--accent)/.2)]" />
          <span className="absolute right-[17%] top-[27%] h-2 w-2 rounded-full bg-primary shadow-[0_0_0_5px_hsl(var(--primary)/.2)]" />
        </div>
      </section>

      <section className="grid gap-10 border-y border-border py-14 lg:grid-cols-[1.25fr_.75fr]">
        <div>
          <p className="eyebrow">{copy.home.aboutEyebrow}</p>
          <h2 className="section-title mt-3">{copy.home.aboutTitle}</h2>
          <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
            {copy.home.aboutOne}
          </p>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            {copy.home.aboutTwo}
          </p>
        </div>
        <div className="soft-card p-6">
          <p className="eyebrow">{copy.home.themes}</p>
          <ul className="mt-5 space-y-4">
            {copy.home.themeList.map((item, i) => (
              <li className="flex items-start gap-3 text-sm leading-relaxed" key={item} data-testid={`text-theme-${i}`}>
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-primary text-primary"><Check size={10} /></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-10 py-16 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <p className="eyebrow">{copy.home.biography}</p>
          <div className="paper-grid mt-4 border border-border p-6 sm:p-8">
            <p className="font-mono text-xs text-muted-foreground">{copy.home.cvShort}</p>
            <h2 className="mt-7 text-2xl font-bold">Pedro Henrique Borghi</h2>
            <p className="mt-1 text-sm text-primary">{copy.home.role}</p>
            <div className="my-6 signal-rule" />
            <p className="text-sm leading-relaxed text-muted-foreground">{copy.home.bioOne}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{copy.home.bioTwo}</p>
          </div>
        </div>
        <div className="grid gap-10 sm:grid-cols-2">
          <InfoList title={copy.home.curricula} items={copy.home.curriculumItems} />
          <AffiliationsList title={copy.home.affiliations} />
        </div>
      </section>

      <section className="border-t border-border py-14">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div><p className="eyebrow">{copy.home.benchEyebrow}</p><h2 className="section-title mt-3">{copy.home.benchTitle}</h2></div>
          <p className="max-w-xs text-right text-sm leading-relaxed text-muted-foreground">{copy.home.benchNote}</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Link href="/speech" className="soft-card group flex items-center justify-between p-6 transition hover:-translate-y-1" data-testid="card-speech-project">
            <div><p className="eyebrow">{copy.home.platformLabel}</p><h3 className="mt-3 text-xl font-bold">{copy.home.speechProject}</h3><p className="mt-2 text-sm text-muted-foreground">{copy.home.speechProjectDescription}</p></div><ArrowUpRight className="text-primary transition group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </section>
    </>
  );
}

function InfoList({ title, items, noArrow = false }: { title: string; items: ReadonlyArray<readonly [string, string]>; noArrow?: boolean }) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <ul className="mt-4 divide-y divide-border border-y border-border">
        {items.map(([name, detail]) => (
          <li key={name} className="py-4">
            {noArrow ? <div><p className="text-sm font-bold">{name}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p></div> : <a href={detail} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-3 text-sm font-bold hover:text-primary" data-testid={`link-curriculum-${name.toLowerCase().replaceAll(' ', '-')}`}>{name}<ArrowUpRight size={14} className="shrink-0 text-primary transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></a>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AffiliationsList({ title }: { title: string }) {
  const { language } = useSiteCopy();
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <ul className="mt-4 divide-y divide-border border-y border-border">
        {affiliations.map((affiliation) => (
          <li key={affiliation.name} className="py-4 text-xs leading-relaxed">
            <p className="text-sm font-bold">{affiliation.name}</p>
            <p className="mt-2 text-muted-foreground">
              {affiliation.address}<br />
              {affiliation.postalCode}, {affiliation.city}<br />
              {affiliation.country}
            </p>
            <a className="mt-2 block text-primary underline underline-offset-2 hover:text-accent" href={`mailto:${affiliation.email}`}>
              {affiliation.email}
            </a>
            <a className="mt-1 block text-primary underline underline-offset-2 hover:text-accent" href={affiliation.website} target="_blank" rel="noreferrer">
              Website
            </a>
            <p className="mt-3 border-t border-border/70 pt-2 text-muted-foreground">
              <span className="font-bold text-foreground">{language === 'PT' ? affiliation.rolePt : affiliation.role}</span> · {language === 'PT' ? affiliation.periodPt : affiliation.period}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function detectSpokenLanguage(value: string): 'english' | 'portuguese' | 'spanish' | 'other' | null {
  const text = value.toLowerCase().trim();
  if (!text) return null;
  const dictionaries = {
    english: ['the', 'and', 'this', 'that', 'with', 'from', 'hello', 'is', 'are'],
    portuguese: ['que', 'não', 'uma', 'para', 'com', 'este', 'esta', 'olá', 'são'],
    spanish: ['que', 'una', 'para', 'con', 'este', 'esta', 'hola', 'los', 'las'],
  };
  const scores = Object.entries(dictionaries).map(([name, words]) => ({
    name,
    score: words.reduce((total, word) => total + (new RegExp(`\\b${word}\\b`, 'i').test(text) ? 1 : 0), 0),
  })).sort((a, b) => b.score - a.score);
  return scores[0].score > 0 ? scores[0].name as 'english' | 'portuguese' | 'spanish' : 'other';
}

function SpeechPage() {
  const { language, copy } = useSiteCopy();
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speakText, setSpeakText] = useState('');
  const [recognitionLanguage, setRecognitionLanguage] = useState('auto');
  const [detectedLanguage, setDetectedLanguage] = useState<'english' | 'portuguese' | 'spanish' | 'other' | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceGender, setVoiceGender] = useState<'any' | 'male' | 'female'>('any');
  const [tone, setTone] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const recognitionRef = useRef<{ start: () => void; stop: () => void; lang?: string; onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null; onend: (() => void) | null; onerror: (() => void) | null } | null>(null);
  const [speechError, setSpeechError] = useState('');

  useEffect(() => {
    const refreshVoices = () => setVoices(window.speechSynthesis.getVoices());
    refreshVoices();
    window.speechSynthesis.addEventListener('voiceschanged', refreshVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', refreshVoices);
  }, []);

  const languageLabel = detectedLanguage === 'english'
    ? copy.speech.detectedEnglish
    : detectedLanguage === 'portuguese'
      ? copy.speech.detectedPortuguese
      : detectedLanguage === 'spanish'
        ? copy.speech.detectedSpanish
        : detectedLanguage === 'other'
          ? copy.speech.detectedOther
          : copy.speech.noDetectedLanguage;

  const detectLanguage = (value = transcript) => setDetectedLanguage(detectSpokenLanguage(value));

  const startRecording = () => {
    setSpeechError('');
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: new () => typeof recognitionRef.current; webkitSpeechRecognition?: new () => typeof recognitionRef.current }).SpeechRecognition
      ?? (window as unknown as { webkitSpeechRecognition?: new () => typeof recognitionRef.current }).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError(copy.speech.unsupported);
      return;
    }
    const recognition = new SpeechRecognition();
    if (!recognition) return;
    recognition.lang = recognitionLanguage === 'auto' ? (language === 'PT' ? 'pt-PT' : 'en-US') : recognitionLanguage;
    recognition.onresult = (event) => {
      const words = Array.from(event.results).map((result) => result[0]?.transcript ?? '').join('');
      setTranscript((current) => {
        const next = `${current}${current ? ' ' : ''}${words}`.trim();
        setDetectedLanguage(detectSpokenLanguage(next));
        return next;
      });
    };
    recognition.onend = () => setRecording(false);
    recognition.onerror = () => {
      setRecording(false);
      setSpeechError(copy.speech.micError);
    };
    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setRecording(false);
  };

  const synthesize = () => {
    if (!speakText.trim()) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(speakText);
    const matchingVoices = voiceGender === 'any'
      ? voices
      : voices.filter((voice) => voice.name.toLowerCase().match(voiceGender === 'male' ? /male|david|daniel|jorge|ricardo/ : /female|zira|samantha|victoria|helena/));
    const preferredLocale = language === 'PT' ? 'pt' : 'en';
    utterance.voice = matchingVoices.find((voice) => voice.lang.toLowerCase().startsWith(preferredLocale)) ?? matchingVoices[0] ?? null;
    utterance.pitch = tone;
    utterance.rate = speed;
    utterance.volume = volume;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      <PageIntro index={copy.speech.index} title={copy.speech.title} description={copy.speech.description} icon={Waves} />
      <section className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
        <div className="soft-card p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div><p className="eyebrow">{copy.speech.sttLabel}</p><h2 className="mt-2 text-2xl font-bold">{copy.speech.sttTitle}</h2></div>
            <span className={`rounded-full border px-3 py-1 font-mono text-[.65rem] uppercase tracking-wider ${recording ? 'border-accent/70 text-accent' : 'border-border text-muted-foreground'}`} data-testid="status-recording">{recording ? copy.speech.recording : copy.speech.ready}</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy.speech.sttDescription}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <label className="block text-sm font-bold" htmlFor="recognition-language">
              {copy.speech.recognitionLanguage}
              <select id="recognition-language" value={recognitionLanguage} onChange={(event) => setRecognitionLanguage(event.target.value)} className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2.5 font-normal" data-testid="select-recognition-language">
                <option value="auto">{copy.speech.autoDetect}</option>
                <option value="en-US">{copy.speech.english}</option>
                <option value="pt-PT">{copy.speech.portuguese}</option>
                <option value="es-ES">{copy.speech.spanish}</option>
              </select>
            </label>
            <button type="button" onClick={() => detectLanguage()} className="rounded-md border border-border px-4 py-2.5 text-sm font-bold text-muted-foreground transition hover:border-primary hover:text-primary" data-testid="button-detect-language">{copy.speech.detect}</button>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {!recording ? <button type="button" onClick={startRecording} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:brightness-105" data-testid="button-start-recording"><Radio size={16} /> {copy.speech.start}</button> : <button type="button" onClick={stopRecording} className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-bold text-accent-foreground transition hover:brightness-105" data-testid="button-stop-recording"><CircleStop size={16} /> {copy.speech.stop}</button>}
            <button type="button" onClick={() => { setTranscript(''); setDetectedLanguage(null); }} className="rounded-md border border-border px-4 py-2.5 text-sm font-bold text-muted-foreground transition hover:border-primary hover:text-primary" data-testid="button-clear-transcript">{copy.speech.clear}</button>
          </div>
          {speechError && <p className="mt-4 text-sm text-destructive" role="alert" data-testid="status-speech-error">{speechError}</p>}
          <label className="mt-6 block text-sm font-bold" htmlFor="transcript">{copy.speech.transcript}</label>
          <textarea id="transcript" value={transcript} onChange={(event) => { setTranscript(event.target.value); setDetectedLanguage(null); }} placeholder={copy.speech.transcriptPlaceholder} className="mt-2 min-h-48 w-full resize-y rounded-md border border-input bg-background p-4 text-sm leading-relaxed placeholder:text-muted-foreground/60" data-testid="textarea-transcript" />
          <div className="mt-4 flex items-center justify-between gap-4 border-t border-border pt-4 text-sm">
            <span className="font-bold">{copy.speech.detectedLanguage}</span>
            <span className="font-mono text-primary" aria-live="polite" data-testid="text-detected-language">{languageLabel}</span>
          </div>
        </div>
        <div className="soft-card flex flex-col p-6 sm:p-8">
          <p className="eyebrow">{copy.speech.ttsLabel}</p><h2 className="mt-2 text-2xl font-bold">{copy.speech.ttsTitle}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy.speech.ttsDescription}</p>
          <label className="mt-6 block text-sm font-bold" htmlFor="speak-text">{copy.speech.synthText}</label>
          <textarea id="speak-text" value={speakText} onChange={(event) => setSpeakText(event.target.value)} placeholder={copy.speech.synthPlaceholder} className="mt-2 min-h-32 w-full resize-y rounded-md border border-input bg-background p-4 text-sm leading-relaxed placeholder:text-muted-foreground/60" data-testid="textarea-speech-synthesis" />
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold" htmlFor="voice-gender">{copy.speech.voice}
              <select id="voice-gender" value={voiceGender} onChange={(event) => setVoiceGender(event.target.value as 'any' | 'male' | 'female')} className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2.5 font-normal" data-testid="select-voice-gender">
                <option value="any">{copy.speech.voiceAny}</option>
                <option value="male">{copy.speech.voiceMale}</option>
                <option value="female">{copy.speech.voiceFemale}</option>
              </select>
            </label>
            <label className="text-sm font-bold" htmlFor="tone">{copy.speech.tone}: {tone.toFixed(1)}
              <input id="tone" type="range" min="0.5" max="1.8" step="0.1" value={tone} onChange={(event) => setTone(Number(event.target.value))} className="mt-4 block w-full accent-[hsl(var(--primary))]" data-testid="input-tone" />
            </label>
            <label className="text-sm font-bold" htmlFor="speed">{copy.speech.speed}: {speed.toFixed(1)}×
              <input id="speed" type="range" min="0.5" max="2" step="0.1" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} className="mt-4 block w-full accent-[hsl(var(--primary))]" data-testid="input-speed" />
            </label>
            <label className="text-sm font-bold" htmlFor="volume">{copy.speech.volume}: {Math.round(volume * 100)}%
              <input id="volume" type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => setVolume(Number(event.target.value))} className="mt-4 block w-full accent-[hsl(var(--primary))]" data-testid="input-volume" />
            </label>
          </div>
          <button type="button" onClick={synthesize} disabled={!speakText.trim()} className="mt-5 inline-flex items-center justify-center gap-2 rounded-md border border-primary px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40" data-testid="button-synthesize"><Volume2 size={16} /> {copy.speech.synthesize}</button>
          <div className="mt-auto pt-8"><div className="signal-rule" /><p className="mt-3 font-mono text-[.65rem] uppercase tracking-wider text-muted-foreground">{copy.speech.speechApi}</p></div>
        </div>
      </section>
      <section className="mt-14 border-t border-border pt-12">
        <p className="eyebrow">{copy.speech.processingEyebrow}</p>
        <h2 className="mt-3 text-2xl font-bold">{copy.speech.processingTitle}</h2>
        <div className="mt-5 max-w-2xl"><Construction>{copy.speech.construction}</Construction></div>
      </section>
      <section className="mt-12 border-t border-border pt-12">
        <p className="eyebrow">{copy.speech.projectLabel}</p>
        <h2 className="mt-3 text-2xl font-bold">{copy.speech.safeCities}</h2>
        <div className="mt-5 max-w-2xl"><Construction>{copy.speech.safeCitiesConstruction}</Construction></div>
      </section>
    </>
  );
}

function ECGPage() {
  const { copy } = useSiteCopy();
  return <><PageIntro index={copy.ecg.index} title={copy.ecg.title} description={copy.ecg.description} icon={ScanHeart} /><section className="grid gap-4 md:grid-cols-2">{copy.ecg.sections.map((title, index) => <div className="soft-card group p-6 transition hover:-translate-y-1" key={title} data-testid={`card-ecg-${index}`}><div className="flex items-start justify-between gap-4"><span className="font-mono text-xs text-primary">ECG / 0{index + 1}</span><Heart size={18} className="text-accent transition group-hover:scale-110" aria-hidden="true" /></div><h2 className="mt-10 text-xl font-bold">{title}</h2><div className="mt-4"><Construction>{copy.ecg.construction}</Construction></div></div>)}</section></>;
}

function SignalPage() {
  const { copy } = useSiteCopy();
  return <><PageIntro index={copy.signals.index} title={copy.signals.title} description={copy.signals.description} icon={Network} /><div className="paper-grid border border-border p-8 sm:p-14"><div className="mx-auto max-w-2xl text-center"><Waves className="mx-auto text-primary" size={42} strokeWidth={1.2} /><h2 className="mt-6 text-3xl font-bold">{copy.signals.headline}</h2><p className="mt-4 leading-relaxed text-muted-foreground">{copy.signals.body}</p><div className="mx-auto mt-8 max-w-md"><Construction>{copy.signals.construction}</Construction></div></div></div></>;
}

function DatabasesPage() {
  const { copy } = useSiteCopy();
  return <><PageIntro index={copy.databases.index} title={copy.databases.title} description={copy.databases.description} icon={Database} /><div className="grid gap-4 md:grid-cols-3">{copy.databases.sections.map((title, i) => <div className="soft-card min-h-56 p-6" key={title} data-testid={`card-database-${i}`}><span className="font-mono text-xs text-primary">DB / 0{i + 1}</span><h2 className="mt-12 text-xl font-bold">{title}</h2><div className="mt-4"><Construction>{copy.databases.construction}</Construction></div></div>)}</div></>;
}

function ResourcesPage() {
  const { copy } = useSiteCopy();
  return <><PageIntro index={copy.resources.index} title={copy.resources.title} description={copy.resources.description} icon={LibraryBig} /><div className="grid gap-x-10 gap-y-0 md:grid-cols-2">{copy.resources.sections.map((title, i) => <div className="flex min-h-36 items-start gap-5 border-b border-border py-7" key={title} data-testid={`row-resource-${i}`}><span className="font-mono text-xs text-primary">0{i + 1}</span><div><h2 className="text-xl font-bold">{title}</h2><div className="mt-3"><Construction>{copy.resources.construction}</Construction></div></div></div>)}</div></>;
}

type LocalizedBlogPost = BlogPost & BlogPostCopy;

function localizePost(post: BlogPost, language: Language): LocalizedBlogPost {
  return { ...post, ...(language === 'PT' ? post.pt : post.en) };
}

function BlogVisual({ variant }: { variant: string }) {
  const { language } = useSiteCopy();
  return <div className={`placeholder-visual visual-${variant}`} role="img" aria-label={language === 'PT' ? `Imagem abstrata gerada para a publicação ${variant}` : `Abstract generated visual for ${variant} blog post`}><span className="absolute bottom-4 left-4 z-10 font-mono text-[.62rem] uppercase tracking-[.18em] text-card/75">{language === 'PT' ? 'NOTA DE CAMPO / VISUAL' : 'FIELD NOTE / VISUAL'} {variant}</span></div>;
}

function BlogModal({ post, onClose }: { post: LocalizedBlogPost; onClose: () => void }) {
  const { language, copy } = useSiteCopy();
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = ''; };
  }, [onClose]);
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><article className="modal-panel rounded-lg" role="dialog" aria-modal="true" aria-labelledby="blog-modal-title" data-testid={`modal-post-${post.id}`}><div className="flex items-center justify-between border-b border-border p-4 sm:p-5"><span className="eyebrow">{post.category}</span><button type="button" className="icon-button h-9 w-9 rounded-md" onClick={onClose} aria-label={copy.blog.close} data-testid="button-close-post"><X size={17} /></button></div><BlogVisual variant={post.visual} /><div className="p-6 sm:p-9"><p className="font-mono text-xs text-muted-foreground">{formatDate(post.date, language)}</p><h2 id="blog-modal-title" className="mt-3 text-3xl font-bold leading-tight">{post.title}</h2><div className="mt-7 space-y-4 text-base leading-relaxed text-muted-foreground">{post.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div></article></div>;
}

function formatDate(date: string, language: Language) {
  return new Intl.DateTimeFormat(language === 'PT' ? 'pt-PT' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${date}T12:00:00`));
}

function BlogPage() {
  const { language, copy } = useSiteCopy();
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<LocalizedBlogPost | null>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 520);
    return () => window.clearTimeout(timer);
  }, []);
  const orderedPosts = useMemo(() => posts.map((post) => localizePost(post, language)).sort((a, b) => b.date.localeCompare(a.date)), [language]);
  if (loading) return <div className="animate-pulse" aria-live="polite" data-testid="status-blog-loading"><div className="h-3 w-40 rounded bg-muted" /><div className="mt-6 h-16 w-2/3 rounded bg-muted" /><div className="mt-10 grid gap-4 md:grid-cols-3"><div className="h-64 rounded bg-muted" /><div className="h-64 rounded bg-muted" /><div className="h-64 rounded bg-muted" /></div><p className="mt-5 font-mono text-xs text-muted-foreground">{copy.blog.loading}</p></div>;
  return <>
    <PageIntro index={copy.blog.index} title={copy.blog.title} description={copy.blog.description} icon={BookOpen} />
    <section className="border-l-4 border-accent bg-muted/45 p-6 sm:p-9" data-testid="text-blog-intro"><p className="font-serif text-lg leading-relaxed sm:text-xl">{copy.blog.intro}</p></section>
    <section className="mt-14"><div className="flex items-end justify-between gap-4"><div><p className="eyebrow">{copy.blog.newest}</p><h2 className="mt-3 text-2xl font-bold">{copy.blog.fromNotebook}</h2></div><span className="font-mono text-xs text-muted-foreground">03 / 03</span></div><div className="mt-6 grid gap-5 lg:grid-cols-3">{orderedPosts.map((post) => <button type="button" className="soft-card group overflow-hidden text-left transition hover:-translate-y-1" onClick={() => setSelected(post)} key={post.id} data-testid={`button-open-post-${post.id}`}><BlogVisual variant={post.visual} /><div className="p-5"><div className="flex items-center justify-between gap-3 font-mono text-[.65rem] uppercase tracking-wider text-muted-foreground"><span>{post.category}</span><span>{formatDate(post.date, language)}</span></div><h3 className="mt-4 text-xl font-bold leading-tight group-hover:text-primary">{post.title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p><span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-primary">{copy.blog.open} <ArrowUpRight size={14} /></span></div></button>)}</div></section>
    <section className="mt-16 border-t border-border pt-12"><p className="eyebrow">{copy.blog.archive}</p><div className="mt-5">{[...orderedPosts].reverse().map((post, index) => <button type="button" className="group flex w-full items-start gap-4 border-b border-border py-5 text-left transition hover:bg-muted/40 sm:gap-10" onClick={() => setSelected(post)} key={post.id} data-testid={`button-archive-post-${post.id}`}><span className="w-10 shrink-0 font-mono text-xs text-muted-foreground">0{index + 1}</span><span className="min-w-0 flex-1"><span className="block text-lg font-bold group-hover:text-primary">{post.title}</span><span className="mt-1 block text-sm text-muted-foreground">{post.category}</span></span><span className="shrink-0 font-mono text-xs text-muted-foreground">{formatDate(post.date, language)}</span><ChevronRight className="mt-1 shrink-0 text-primary" size={16} /></button>)}</div></section>
    {selected && <BlogModal post={selected} onClose={() => setSelected(null)} />}
  </>;
}

function Router() {
  return <Switch><Route path="/" component={Home} /><Route path="/speech" component={SpeechPage} /><Route path="/ecg" component={ECGPage} /><Route path="/signals" component={SignalPage} /><Route path="/databases" component={DatabasesPage} /><Route path="/resources" component={ResourcesPage} /><Route path="/blog" component={BlogPage} /><Route component={NotFound} /></Switch>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><RoutedErrorBoundary><Shell><Router /></Shell></RoutedErrorBoundary></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;