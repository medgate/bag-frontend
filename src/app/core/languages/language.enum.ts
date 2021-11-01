export enum Language {
  DE = 'de',
  FR = 'fr',
  IT = 'it',
  EN = 'en'
}

export const ALL_LANGUAGES = [Language.DE, Language.FR, Language.IT, Language.EN];

export const DEFAULT_LANGUAGE = Language.DE;

export const HOSTNAME_2_LANGUAGE = {
  'check.ofsp-coronavirus.ch': Language.FR,
  'check.foph-coronavirus.ch': Language.EN,
  'check.bag-coronavirus.ch': Language.DE,
  'check.ufsp-coronavirus.ch': Language.IT
}; 
