import * as dayjs from 'dayjs';
import { ITranslation } from 'app/entities/translation/translation.model';
import { ITreaty } from 'app/entities/treaty/treaty.model';
import { ICountry } from 'app/entities/country/country.model';

export interface ILaw {
  id?: string;
  description?: string | null;
  name?: string | null;
  publicationDate?: dayjs.Dayjs | null;
  effectiveDate?: dayjs.Dayjs | null;
  translations?: ITranslation[] | null;
  treaties?: ITreaty[] | null;
  laws?: ILaw[] | null;
  country?: ICountry | null;
  ref?: ILaw | null;
}

export class Law implements ILaw {
  constructor(
    public id?: string,
    public description?: string | null,
    public name?: string | null,
    public publicationDate?: dayjs.Dayjs | null,
    public effectiveDate?: dayjs.Dayjs | null,
    public translations?: ITranslation[] | null,
    public treaties?: ITreaty[] | null,
    public laws?: ILaw[] | null,
    public country?: ICountry | null,
    public ref?: ILaw | null
  ) {}
}

export function getLawIdentifier(law: ILaw): string | undefined {
  return law.id;
}
