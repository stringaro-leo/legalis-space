import * as dayjs from 'dayjs';
import { IStatement } from 'app/entities/statement/statement.model';
import { ITranslation } from 'app/entities/translation/translation.model';
import { ICountry } from 'app/entities/country/country.model';
import { ILaw } from 'app/entities/law/law.model';

export interface ITreaty {
  id?: string;
  description?: string | null;
  name?: string | null;
  voteDate?: dayjs.Dayjs | null;
  effectiveDate?: dayjs.Dayjs | null;
  statements?: IStatement[] | null;
  translations?: ITranslation[] | null;
  countries?: ICountry[] | null;
  law?: ILaw | null;
}

export class Treaty implements ITreaty {
  constructor(
    public id?: string,
    public description?: string | null,
    public name?: string | null,
    public voteDate?: dayjs.Dayjs | null,
    public effectiveDate?: dayjs.Dayjs | null,
    public statements?: IStatement[] | null,
    public translations?: ITranslation[] | null,
    public countries?: ICountry[] | null,
    public law?: ILaw | null
  ) {}
}

export function getTreatyIdentifier(treaty: ITreaty): string | undefined {
  return treaty.id;
}
