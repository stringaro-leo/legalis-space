import { ILaw } from 'app/entities/law/law.model';
import { IStatement } from 'app/entities/statement/statement.model';
import { ITreaty } from 'app/entities/treaty/treaty.model';

export interface ICountry {
  id?: string;
  code?: string | null;
  name?: string | null;
  laws?: ILaw[] | null;
  statements?: IStatement[] | null;
  ratifiedCountries?: ITreaty | null;
}

export class Country implements ICountry {
  constructor(
    public id?: string,
    public code?: string | null,
    public name?: string | null,
    public laws?: ILaw[] | null,
    public statements?: IStatement[] | null,
    public ratifiedCountries?: ITreaty | null
  ) {}
}

export function getCountryIdentifier(country: ICountry): string | undefined {
  return country.id;
}
