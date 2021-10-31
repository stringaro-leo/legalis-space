import { ILanguage } from 'app/entities/language/language.model';
import { ILaw } from 'app/entities/law/law.model';
import { ITreaty } from 'app/entities/treaty/treaty.model';

export interface ITranslation {
  id?: string;
  note?: string | null;
  author?: string | null;
  source?: string | null;
  official?: boolean | null;
  content?: string | null;
  language?: ILanguage | null;
  law?: ILaw | null;
  treaty?: ITreaty | null;
}

export class Translation implements ITranslation {
  constructor(
    public id?: string,
    public note?: string | null,
    public author?: string | null,
    public source?: string | null,
    public official?: boolean | null,
    public content?: string | null,
    public language?: ILanguage | null,
    public law?: ILaw | null,
    public treaty?: ITreaty | null
  ) {
    this.official = this.official ?? false;
  }
}

export function getTranslationIdentifier(translation: ITranslation): string | undefined {
  return translation.id;
}
