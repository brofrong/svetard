export type ImageRef = { src: string; alt: string };
export type NavItem = { label: string; href: string };
export type Stat = { value: number; suffix?: string; label: string };
export type Pain = { title: string; text: string };
export type PathStep = {
  key: string;
  title: string;
  keywords: string[];
  text: string;
  image: ImageRef;
};
export type Service = {
  id: string;
  title: string;
  format: string;
  text: string;
  bullets: string[];
  image: ImageRef;
  messengerText: string;
};
export type ProgramModule = { id: string; title: string; points: string[] };
export type Testimonial = {
  name: string;
  result: string;
  text: string;
  image: ImageRef;
};
export type Plan = {
  id: string;
  title: string;
  period: string;
  price: string;
  features: string[];
  featured: boolean;
  badge?: string;
  messengerText: string;
};
export type EcosystemIcon =
  | "user"
  | "leaf"
  | "dumbbell"
  | "users"
  | "play"
  | "sun";
export type EcosystemNode = { label: string; icon: EcosystemIcon };
export type FaqItem = { id: string; question: string; answer: string };
export type BeforeAfterContent = {
  before: ImageRef;
  after: ImageRef;
  beforeLabel: string;
  afterLabel: string;
  caption: string;
  sliderLabel: string;
};

type SectionIntro = { eyebrow: string; title: string };

export type Site = {
  url: string;
  brand: { name: string; tagline: string; expert: string; role: string };
  seo: { title: string; description: string; ogImage: ImageRef };
  contacts: {
    telegram: string;
    whatsapp: string;
    instagram: string;
    email: string;
  };
  media: { warmFilter: boolean };
  nav: NavItem[];
  header: {
    cta: string;
    ctaMessage: string;
    homeLabel: string;
    navLabel: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    messengerText: string;
    image: ImageRef;
  };
  marquee: string[];
  about: SectionIntro & {
    paragraphs: string[];
    credentials: string[];
    stats: Stat[];
    image: ImageRef;
  };
  pains: SectionIntro & { items: Pain[] };
  path: SectionIntro & { items: PathStep[] };
  services: SectionIntro & { cta: string; items: Service[] };
  program: SectionIntro & { subtitle: string; modules: ProgramModule[] };
  results: SectionIntro & {
    prevLabel: string;
    nextLabel: string;
    testimonials: Testimonial[];
    beforeAfter: BeforeAfterContent;
  };
  pricing: SectionIntro & { cta: string; whatsappCta: string; plans: Plan[] };
  ecosystem: SectionIntro & { text: string; nodes: EcosystemNode[] };
  faq: SectionIntro & { items: FaqItem[] };
  cta: SectionIntro & {
    text: string;
    telegram: string;
    whatsapp: string;
    messengerText: string;
    image: ImageRef;
  };
  footer: {
    copyright: string;
    privacy: { label: string; href: string | null };
    links: { telegram: string; whatsapp: string; instagram: string };
    floatingLabel: string;
  };
};
