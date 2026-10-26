// Model menu shown on the home page. Tiers are ordered by price only; quality per task has not been measured yet.
// Prices come from third-party trackers (not official pages) and are shown as rough $ levels, not as numbers.
// Model names are display names, not API ids. Check each provider's docs before wiring real API calls.

export type Lang = 'en' | 'tr';

export interface Tier {
  id: 'fast' | 'balanced' | 'strong' | 'top';
  icon: string;
  price: string;
  label: Record<Lang, string>;
  goodFor: Record<Lang, string>;
  choose: Record<Lang, string>;
  models: string[];
}

export const TIERS: Tier[] = [
  {
    id: 'fast',
    icon: '🟢',
    price: '$',
    label: { en: 'Fast and cheap', tr: 'Hızlı ve ucuz' },
    goodFor: {
      en: 'Short questions, simple translation, quick summaries, draft text.',
      tr: 'Kısa sorular, basit çeviri, hızlı özet, taslak metin.'
    },
    choose: {
      en: 'The answer is short, a mistake is easy to fix, and you will ask many questions.',
      tr: 'Cevap kısa, hata olursa kolayca düzelir ve çok sayıda soru soracaksınız.'
    },
    models: ['GPT-5 nano', 'Claude Haiku 5.5', 'DeepSeek V4.1 Flash', 'Gemini Flash-Lite']
  },
  {
    id: 'balanced',
    icon: '🔵',
    price: '$$',
    label: { en: 'Balanced', tr: 'Dengeli' },
    goodFor: {
      en: 'Medium-length writing, code fixes, reading tables, a few steps of reasoning.',
      tr: 'Orta uzunlukta yazı, kod düzeltme, tablo yorumlama, birkaç adımlı düşünme.'
    },
    choose: {
      en: 'Most everyday work. If you are not sure, start here.',
      tr: 'Günlük işlerinizin çoğu. Emin değilseniz buradan başlayın.'
    },
    models: ['GPT-5 mini', 'DeepSeek V4 Pro', 'Gemini 3.8 Flash']
  },
  {
    id: 'strong',
    icon: '🟣',
    price: '$$$',
    label: { en: 'Strong', tr: 'Güçlü' },
    goodFor: {
      en: 'Reading long documents, complex analysis, hard code, detailed reports.',
      tr: 'Uzun belgeleri okuma, karmaşık analiz, zor kod, ayrıntılı rapor.'
    },
    choose: {
      en: 'Quality matters and you do not want to ask twice.',
      tr: 'İşin kalitesi önemli ve cevabı tekrar yazdırmak istemiyorsunuz.'
    },
    models: ['Claude Sonnet 5.5', 'Gemini 3.1 Pro', 'Claude Opus 5.5']
  },
  {
    id: 'top',
    icon: '🟠',
    price: '$$$$',
    label: { en: 'Top tier', tr: 'En üst' },
    goodFor: {
      en: 'Very hard and risky work.',
      tr: 'Çok zor ve riskli işler.'
    },
    choose: {
      en: 'Law, medicine and finance, where a mistake is not acceptable. Still have an expert check the answer.',
      tr: 'Hukuk, tıp, finans gibi hataya yer olmayan konular. Cevabı yine de bir uzmana doğrulatın.'
    },
    models: ['Claude Fable 5.1']
  }
];

export const QUICK_GUIDE: { question: Record<Lang, string>; tier: Tier['id'] }[] = [
  { question: { en: 'A one-line answer is enough', tr: 'Tek cümlelik cevap yeter' }, tier: 'fast' },
  { question: { en: 'A normal task, a few steps', tr: 'Normal bir iş, birkaç adım' }, tier: 'balanced' },
  { question: { en: 'A long document or hard analysis', tr: 'Uzun belge veya zor analiz' }, tier: 'strong' },
  { question: { en: 'A mistake is not acceptable', tr: 'Hata kabul edilemez' }, tier: 'top' }
];

export const MENU_TEXT: Record<Lang, Record<string, string>> = {
  en: {
    title: 'Which AI should I choose?',
    intro: 'Look at your task first, then pick a box.',
    goodFor: 'Good for',
    choose: 'Choose it when',
    options: 'Options',
    guide: 'Quick guide',
    unsure: 'Not sure? Press "Recommend Model" above and ModelMatch will suggest a box and explain why.',
    privacy: 'Privacy: do not type personal or customer data. Check where each provider processes your data before you choose. This has not been checked for DeepSeek yet.',
    note: 'Boxes are ordered by price only. We have not measured which model is better for which task yet.'
  },
  tr: {
    title: 'Hangi yapay zekayı seçeyim?',
    intro: 'Önce işinize bakın, sonra kutuyu seçin.',
    goodFor: 'Ne için',
    choose: 'Şu durumda seçin',
    options: 'Seçenekler',
    guide: 'Kısa karar rehberi',
    unsure: 'Emin değil misiniz? Yukarıdaki "Recommend Model" düğmesine basın, ModelMatch uygun kutuyu ve nedenini söyler.',
    privacy: 'Gizlilik: kişisel veya müşteri verisi yazmayın. Seçmeden önce sağlayıcının verinizi nerede işlediğini kontrol edin. DeepSeek için bu henüz kontrol edilmedi.',
    note: 'Kutular yalnız fiyata göre sıralı. Hangi modelin hangi işte daha iyi olduğunu henüz ölçmedik.'
  }
};
