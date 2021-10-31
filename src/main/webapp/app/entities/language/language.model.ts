import { ITranslation } from 'app/entities/translation/translation.model';

export interface ILanguage {
  id?: string;
  code?: string | null;
  name?: string | null;
  translation?: ITranslation | null;
}

export class Language implements ILanguage {
  constructor(public id?: string, public code?: string | null, public name?: string | null, public translation?: ITranslation | null) {}
}

export function getLanguageIdentifier(language: ILanguage): string | undefined {
  return language.id;
}
